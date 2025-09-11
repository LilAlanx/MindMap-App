const express = require('express');
const { body, validationResult } = require('express-validator');
const MindMap = require('../models/MindMap');
const Node = require('../models/Node');

const router = express.Router();

// @route   GET /api/mindmaps
// @desc    Get user's mind maps
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tags, sortBy = 'lastModified', sortOrder = 'desc' } = req.query;
    
    const query = {
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id }
      ]
    };

    // Add search filter
    if (search) {
      query.$and = [
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }

    // Add tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const mindmaps = await MindMap.find(query)
      .populate('owner', 'username email')
      .populate('collaborators.user', 'username email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await MindMap.countDocuments(query);

    res.json({
      success: true,
      data: {
        mindmaps,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get mindmaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mind maps'
    });
  }
});

// @route   GET /api/mindmaps/:id
// @desc    Get specific mind map with nodes
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const mindmap = await MindMap.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id }
      ]
    })
    .populate('owner', 'username email')
    .populate('collaborators.user', 'username email');

    if (!mindmap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found'
      });
    }

    // Get all nodes for this mind map
    const nodes = await Node.find({ mindMap: mindmap._id })
      .populate('createdBy', 'username')
      .populate('lastModifiedBy', 'username')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: {
        mindmap,
        nodes
      }
    });
  } catch (error) {
    console.error('Get mindmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mind map'
    });
  }
});

// @route   POST /api/mindmaps
// @desc    Create new mind map
// @access  Private
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
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

    const { title, description, tags = [], isPublic = false, settings = {} } = req.body;

    const mindmap = new MindMap({
      title,
      description,
      owner: req.user._id,
      tags,
      isPublic,
      settings: {
        layout: settings.layout || 'radial',
        theme: {
          primaryColor: settings.theme?.primaryColor || '#3b82f6',
          backgroundColor: settings.theme?.backgroundColor || '#ffffff',
          textColor: settings.theme?.textColor || '#1f2937'
        },
        zoom: settings.zoom || 1,
        pan: settings.pan || { x: 0, y: 0 }
      }
    });

    await mindmap.save();

    // Create root node
    const rootNode = new Node({
      mindMap: mindmap._id,
      title: 'Central Topic',
      content: 'Click to edit',
      position: { x: 0, y: 0 },
      createdBy: req.user._id,
      lastModifiedBy: req.user._id
    });

    await rootNode.save();

    res.status(201).json({
      success: true,
      message: 'Mind map created successfully',
      data: { mindmap }
    });
  } catch (error) {
    console.error('Create mindmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mind map'
    });
  }
});

// @route   PUT /api/mindmaps/:id
// @desc    Update mind map
// @access  Private
router.put('/:id', [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
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

    const mindmap = await MindMap.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id, 'collaborators.role': 'editor' }
      ]
    });

    if (!mindmap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found or insufficient permissions'
      });
    }

    const { title, description, tags, isPublic, settings } = req.body;

    if (title) mindmap.title = title;
    if (description !== undefined) mindmap.description = description;
    if (tags) mindmap.tags = tags;
    if (isPublic !== undefined) mindmap.isPublic = isPublic;
    if (settings) {
      mindmap.settings = { ...mindmap.settings, ...settings };
    }

    await mindmap.save();

    res.json({
      success: true,
      message: 'Mind map updated successfully',
      data: { mindmap }
    });
  } catch (error) {
    console.error('Update mindmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mind map'
    });
  }
});

// @route   DELETE /api/mindmaps/:id
// @desc    Delete mind map
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const mindmap = await MindMap.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!mindmap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found or insufficient permissions'
      });
    }

    // Delete all nodes associated with this mind map
    await Node.deleteMany({ mindMap: mindmap._id });

    // Delete the mind map
    await MindMap.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Mind map deleted successfully'
    });
  } catch (error) {
    console.error('Delete mindmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mind map'
    });
  }
});

// @route   POST /api/mindmaps/:id/collaborators
// @desc    Add collaborator to mind map
// @access  Private
router.post('/:id/collaborators', [
  body('userId')
    .isMongoId()
    .withMessage('Valid user ID is required'),
  body('role')
    .isIn(['viewer', 'editor'])
    .withMessage('Role must be either viewer or editor')
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

    const mindmap = await MindMap.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!mindmap) {
      return res.status(404).json({
        success: false,
        message: 'Mind map not found or insufficient permissions'
      });
    }

    const { userId, role } = req.body;

    // Check if user is already a collaborator
    const existingCollaborator = mindmap.collaborators.find(
      collab => collab.user.toString() === userId
    );

    if (existingCollaborator) {
      return res.status(400).json({
        success: false,
        message: 'User is already a collaborator'
      });
    }

    mindmap.collaborators.push({
      user: userId,
      role
    });

    await mindmap.save();

    res.json({
      success: true,
      message: 'Collaborator added successfully',
      data: { mindmap }
    });
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add collaborator'
    });
  }
});

module.exports = router;

