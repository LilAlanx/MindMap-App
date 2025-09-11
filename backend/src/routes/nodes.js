const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const router = express.Router();
const Node = require('../models/Node');
const MindMap = require('../models/MindMap');

// Get all nodes for a specific mindmap
router.get('/mindmap/:mindmapId', async (req, res) => {
  try {
    const { mindmapId } = req.params;
    const nodes = await Node.find({ mindMap: mindmapId }).sort({ createdAt: 1 });
    
    console.log(`Loaded ${nodes.length} nodes for mindmap ${mindmapId}`);
    nodes.forEach(node => {
      if (node.connections && node.connections.length > 0) {
        console.log(`Node ${node._id} has ${node.connections.length} connections:`, node.connections);
      }
    });
    
    res.json({
      success: true,
      data: {
        nodes
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nodes', error: error.message });
  }
});

// Get a specific node
router.get('/:id', async (req, res) => {
  try {
    const node = await Node.findById(req.params.id);
    if (!node) {
      return res.status(404).json({ message: 'Node not found' });
    }
    res.json({
      success: true,
      data: {
        node
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching node', error: error.message });
  }
});

// Create a new node
router.post('/', [
  body('mindMap')
    .isMongoId()
    .withMessage('Valid mind map ID is required'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Content must be less than 1000 characters'),
  body('position')
    .isObject()
    .withMessage('Position must be an object with x and y coordinates'),
  body('position.x')
    .isNumeric()
    .withMessage('Position x must be a number'),
  body('position.y')
    .isNumeric()
    .withMessage('Position y must be a number'),
  body('parent')
    .optional()
    .isMongoId()
    .withMessage('Parent must be a valid node ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { mindMap, title, content, position, parent } = req.body;
    
    console.log('Creating node with data:', {
      mindMap,
      title,
      content,
      position,
      parent,
      createdBy: req.user._id
    });
    
    const node = new Node({
      mindMap,
      title,
      content,
      position,
      parent,
      createdBy: req.user._id,
      lastModifiedBy: req.user._id
    });

    const savedNode = await node.save();
    
    // Update the mind map's lastModified timestamp
    await MindMap.findByIdAndUpdate(
      mindMap,
      { lastModified: new Date() },
      { new: true }
    );
    
    console.log('Node created successfully:', savedNode._id);
    console.log('Mind map lastModified updated:', mindMap);
    
    res.status(201).json({
      success: true,
      data: {
        node: savedNode
      }
    });
  } catch (error) {
    console.error('Error creating node:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating node', 
      error: error.message 
    });
  }
});

// Update a node
router.put('/:id', async (req, res) => {
  try {
    const { title, content, position, parent, style, connections, size } = req.body;
    
    console.log('Node update request:', {
      nodeId: req.params.id,
      title,
      content,
      position,
      parent,
      style,
      connections,
      size
    });
    
    console.log('Connections details:', JSON.stringify(connections, null, 2));
    
    const node = await Node.findById(req.params.id).populate('mindMap');
    if (!node) {
      return res.status(404).json({ message: 'Node not found' });
    }

    // Check if user has access to the mind map (owner or collaborator)
    const mindMap = node.mindMap;
    const userId = req.user._id.toString();
    const ownerId = mindMap.owner.toString();
    const isOwner = ownerId === userId;
    const isCollaborator = mindMap.collaborators.some(collab => 
      collab.user.toString() === userId && collab.role === 'editor'
    );
    
    console.log('Node update authorization check:', {
      nodeId: req.params.id,
      userId,
      mindMapOwner: ownerId,
      isOwner,
      isCollaborator,
      collaborators: mindMap.collaborators.map(c => ({ user: c.user.toString(), role: c.role }))
    });
    
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Not authorized to update this node' });
    }

    const updateData = { 
      title, 
      content, 
      position, 
      parent,
      lastModifiedBy: req.user._id
    };
    
    // Add size updates if provided
    if (size) {
      updateData.size = size;
    }
    
    // Add style updates if provided
    if (style) {
      updateData.style = { ...node.style, ...style };
    }
    
    // Add connections if provided
    if (connections) {
      console.log('Processing connections:', connections);
      
      // Simple validation - just check if connections is an array
      if (Array.isArray(connections)) {
        updateData.connections = connections;
        console.log('Connections added to update data');
      } else {
        console.warn('Connections is not an array:', typeof connections);
      }
    }
    
    console.log('Updating node with data:', updateData);
    
    try {
      console.log('Attempting to update node with ID:', req.params.id);
      console.log('Update data structure:', JSON.stringify(updateData, null, 2));
      
      const updatedNode = await Node.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
      
      // Update the mind map's lastModified timestamp
      await MindMap.findByIdAndUpdate(
        mindMap._id,
        { lastModified: new Date() },
        { new: true }
      );
      
      console.log('Node updated successfully:', updatedNode._id);
      console.log('Mind map lastModified updated:', mindMap._id);
      
      res.json({
        success: true,
        data: {
          node: updatedNode
        }
      });
    } catch (updateError) {
      console.error('Error during node update:', updateError);
      console.error('Update error details:', {
        message: updateError.message,
        name: updateError.name,
        errors: updateError.errors,
        stack: updateError.stack
      });
      
      // Return more specific error information
      res.status(500).json({ 
        message: 'Error updating node', 
        error: updateError.message,
        details: updateError.errors || updateError.stack
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating node', error: error.message });
  }
});

// Delete a node
router.delete('/:id', async (req, res) => {
  try {
    const node = await Node.findById(req.params.id).populate('mindMap');
    if (!node) {
      return res.status(404).json({ message: 'Node not found' });
    }

    // Check if user has access to the mind map (owner or collaborator)
    const mindMap = node.mindMap;
    const userId = req.user._id.toString();
    const ownerId = mindMap.owner.toString();
    const isOwner = ownerId === userId;
    const isCollaborator = mindMap.collaborators.some(collab => 
      collab.user.toString() === userId && collab.role === 'editor'
    );
    
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Not authorized to delete this node' });
    }

    // Also delete all child nodes
    await Node.deleteMany({ parent: req.params.id });
    await Node.findByIdAndDelete(req.params.id);

    // Update the mind map's lastModified timestamp
    await MindMap.findByIdAndUpdate(
      mindMap._id,
      { lastModified: new Date() },
      { new: true }
    );

    console.log('Node deleted successfully:', req.params.id);
    console.log('Mind map lastModified updated:', mindMap._id);

    res.json({
      success: true,
      message: 'Node deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting node', error: error.message });
  }
});

module.exports = router;
