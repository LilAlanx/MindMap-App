import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiArrowLeft, FiSave, FiDownload, FiShare, FiSettings, FiRotateCcw, FiRotateCw } from 'react-icons/fi';
import Button from '../../components/UI/Button';
import MindMapCanvas from '../../components/MindMap/MindMapCanvas';
import NodeEditor from '../../components/MindMap/NodeEditor';
import { useMindMap } from '../../contexts/MindMapContext';
import { useSocket } from '../../contexts/SocketContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import useUndoRedo from '../../hooks/useUndoRedo';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';

const EditorContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: var(--bg-secondary, #f8fafc);
  position: relative;
  overflow: hidden;
  max-height: 100vh;
  box-sizing: border-box;
`;

const Toolbar = styled.div`
  position: fixed;
  top: 80px;
  left: 280px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1000;
  min-height: 60px;
  color: var(--text-primary, #1f2937);

  @media (max-width: 768px) {
    left: 0;
    right: 0;
    top: 60px;
    border-radius: 0;
    padding: 12px 16px;
    min-height: 50px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    background-color: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.borderHover};
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.textSecondary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover:not(:disabled) {
    background-color: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.backgroundSecondary};
    color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.text};
    border-color: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.borderHover};
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  height: calc(100vh - 80px);
  margin-top: 80px;
  max-height: calc(100vh - 80px);

  @media (max-width: 768px) {
    height: calc(100vh - 110px);
    margin-top: 110px;
    max-height: calc(100vh - 110px);
    flex-direction: column;
  }
`;

const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    border-radius: 0;
    box-shadow: none;
    height: calc(100vh - 110px);
    min-height: 400px;
  }
`;

const SidePanel = styled.div`
  width: 350px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  position: fixed;
  right: 20px;
  top: 80px;
  height: calc(100vh - 80px);
  z-index: 1100;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0;
    z-index: 1200;
  }
`;

const FloatingActionButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const TouchInstructions = styled.div`
  position: fixed;
  bottom: 90px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 12px;
  max-width: 200px;
  z-index: 999;
  display: none;
  animation: fadeInOut 4s ease-in-out;

  @media (max-width: 768px) {
    display: block;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(10px); }
    20% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(10px); }
  }
`;


const MindMapEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [canvasConnections, setCanvasConnections] = useState([]);
  const [showTouchInstructions, setShowTouchInstructions] = useState(false);
  
  // Undo/Redo system
  const { 
    currentState: historyState, 
    pushState, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    reset: resetHistory 
  } = useUndoRedo({ nodes: [], connections: [] });
  
  // Debug: Log sidebar state
  console.log('Sidebar open:', sidebarOpen);
  console.log('Selected node:', selectedNode);
  
  const { 
    currentMindMap, 
    nodes, 
    loading, 
    fetchMindMap, 
    updateNode,
    createNode,
    deleteNode,
    setSelectedNode: setContextSelectedNode
  } = useMindMap();
  
  const { joinMindMap, leaveMindMap } = useSocket();

  useEffect(() => {
    if (id) {
      fetchMindMap(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (currentMindMap) {
      joinMindMap(currentMindMap._id);
      return () => {
        leaveMindMap(currentMindMap._id);
      };
    }
  }, [currentMindMap, joinMindMap, leaveMindMap]);

  // Initialize history only when mind map is first loaded
  useEffect(() => {
    if (nodes.length > 0) {
      resetHistory({ 
        nodes: [...nodes], 
        connections: [...canvasConnections] 
      });
    }
  }, [id]); // Only when mind map ID changes (new mind map loaded)

  const handleNodeSelect = (node) => {
    console.log('Node selected:', node);
    setSelectedNode(node);
    setContextSelectedNode(node);
    setSidebarOpen(true);
  };

  const handleNodeUpdate = async (nodeData) => {
    if (selectedNode) {
      // Save current state before making changes
      pushState({ 
        nodes: [...nodes], 
        connections: [...canvasConnections] 
      });
      
      await updateNode(selectedNode._id, nodeData);
    }
  };

  // Wrapper for canvas node updates that also saves to history
  const handleCanvasNodeUpdate = async (nodeId, updates) => {
    try {
      // Save current state before making changes
      pushState({ 
        nodes: [...nodes], 
        connections: [...canvasConnections] 
      });
      
      await updateNode(nodeId, updates);
      console.log('✅ Canvas node updated successfully');
    } catch (error) {
      console.error('Error updating canvas node:', error);
    }
  };

  const handleCreateNode = async (nodeData) => {
    try {
      // Save current state before making changes
      pushState({ 
        nodes: [...nodes], 
        connections: [...canvasConnections] 
      });
      
      await createNode({
        ...nodeData,
        mindMap: currentMindMap._id
      });
    } catch (error) {
      console.error('Error creating node:', error);
    }
  };

  const handleConnectNode = async (fromNodeId, toNodeId) => {
    try {
      // Save current state before making changes
      pushState({ 
        nodes: [...nodes], 
        connections: [...canvasConnections] 
      });
      
      console.log('Connecting nodes:', fromNodeId, 'to', toNodeId);
      // The actual connection is handled by the canvas and will trigger handleConnectionsChange
    } catch (error) {
      console.error('Error connecting nodes:', error);
    }
  };

  const handleConnectionsChange = (connections) => {
    setCanvasConnections(connections);
    console.log('Canvas connections updated:', connections);
  };

  // Wrapper for node deletion that also saves to history
  const handleCanvasNodeDelete = async (nodeId) => {
    try {
      // Save current state before making changes
      pushState({ 
        nodes: [...nodes], 
        connections: [...canvasConnections] 
      });
      
      await deleteNode(nodeId);
      console.log('✅ Canvas node deleted successfully');
    } catch (error) {
      console.error('Error deleting canvas node:', error);
    }
  };

  const handleFloatingButtonClick = () => {
    // Create a new node at the center of the canvas
    const centerX = window.innerWidth / 2 - 60; // Center horizontally
    const centerY = window.innerHeight / 2 - 40; // Center vertically
    
    const newNodeData = {
      title: 'New Node',
      content: '',
      position: { x: centerX, y: centerY },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 'normal'
      }
    };

    handleCreateNode(newNodeData);
    
    // Show touch instructions
    setShowTouchInstructions(true);
    setTimeout(() => setShowTouchInstructions(false), 4000);
  };

  // Undo/Redo handlers
  const handleUndo = async () => {
    console.log('🔄 Undo triggered!', { canUndo, historyLength: historyState?.length || 0 });
    if (canUndo) {
      // Save current state for redo before undoing
      const currentState = { 
        nodes: [...nodes], 
        connections: [...canvasConnections] 
      };
      
      const previousState = undo();
      if (previousState) {
        // Apply the previous state
        console.log('✅ Undoing to state:', previousState);
        await applyStateToCanvas(previousState);
        
        // Save current state for redo after applying undo
        pushState(currentState);
      }
    } else {
      console.log('❌ Cannot undo - no previous states available');
    }
  };

  const handleRedo = async () => {
    console.log('🔄 Redo triggered!', { canRedo, historyLength: historyState?.length || 0 });
    if (canRedo) {
      const nextState = redo();
      if (nextState) {
        // Apply the next state
        console.log('✅ Redoing to state:', nextState);
        await applyStateToCanvas(nextState);
      }
    } else {
      console.log('❌ Cannot redo - no future states available');
    }
  };

  // Apply state to canvas (nodes and connections)
  const applyStateToCanvas = async (state) => {
    if (state && state.nodes) {
      console.log('🔄 Applying state to canvas:', state);
      
      try {
        // Update all nodes at once
        const updatePromises = state.nodes.map(node => 
          updateNode(node._id, {
            position: node.position,
            size: node.size,
            style: node.style,
            connections: node.connections
          })
        );
        
        await Promise.all(updatePromises);
        console.log('✅ All nodes updated successfully');
        
        // Update connections
        if (state.connections) {
          setCanvasConnections(state.connections);
          console.log('✅ Connections updated:', state.connections);
        }
        
        console.log('✅ State applied successfully');
      } catch (error) {
        console.error('❌ Error applying state:', error);
      }
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+z': {
      handler: handleUndo,
      description: 'Undo last action'
    },
    'ctrl+y': {
      handler: handleRedo,
      description: 'Redo last undone action'
    },
    'ctrl+shift+z': {
      handler: handleRedo, // Alternative redo shortcut
      description: 'Redo last undone action'
    }
  });

  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple saves
    
    try {
      setIsSaving(true);
    console.log('Saving mind map...');
      console.log('Canvas connections to save:', canvasConnections);
      
      // Validate canvas connections structure
      const validConnections = canvasConnections.filter(conn => {
        const isValid = conn && 
                       conn.from && 
                       conn.to && 
                       conn.from._id && 
                       conn.to._id &&
                       typeof conn.from._id === 'string' &&
                       typeof conn.to._id === 'string';
        
        if (!isValid) {
          console.warn('Invalid connection structure:', conn);
        }
        
        return isValid;
      });
      
      console.log('Valid connections:', validConnections.length, 'out of', canvasConnections.length);
      
      // Save all nodes with their current state
      const savePromises = nodes.map(node => {
        // Only save basic node data, connections are handled in real-time
        const updateData = {
          title: node.title,
          content: node.content,
          position: node.position,
          style: node.style
        };
        
        console.log(`Saving node ${node._id} with data:`, updateData);
        
        return updateNode(node._id, updateData);
      });
      
      await Promise.all(savePromises);
      
      // Show success message
      console.log('Mind map saved successfully!');
      // You could add a toast notification here
      
    } catch (error) {
      console.error('Error saving mind map:', error);
      // You could add an error toast here
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting mind map...');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Sharing mind map...');
  };

  if (loading) {
    return <LoadingSpinner text="Loading mind map..." />;
  }

  if (!currentMindMap) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Mind map not found</h2>
        <p>The mind map you're looking for doesn't exist or you don't have access to it.</p>
        <Button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <EditorContainer>
        <Toolbar>
          <LeftSection>
            <BackButton onClick={() => navigate('/dashboard')}>
              <FiArrowLeft size={16} />
              Back
            </BackButton>
            <Title>{currentMindMap.title}</Title>
          </LeftSection>

          <RightSection>
            <ToolButton onClick={handleSave} disabled={isSaving}>
              <FiSave size={16} />
              {isSaving ? 'Saving...' : 'Save'}
            </ToolButton>
            <ToolButton onClick={handleUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
              <FiRotateCcw size={16} />
              Undo
            </ToolButton>
            <ToolButton onClick={handleRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
              <FiRotateCw size={16} />
              Redo
            </ToolButton>
            <ToolButton onClick={handleExport}>
              <FiDownload size={16} />
              Export
            </ToolButton>
            <ToolButton onClick={handleShare}>
              <FiShare size={16} />
              Share
            </ToolButton>
            <ToolButton 
              active={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiSettings size={16} />
              Properties
            </ToolButton>
          </RightSection>
        </Toolbar>

        <MainContent>
          <CanvasContainer>
                      <MindMapCanvas
                        nodes={nodes}
                        onNodeSelect={handleNodeSelect}
                        selectedNode={selectedNode}
                        onCreateNode={handleCreateNode}
                        onUpdateNode={handleCanvasNodeUpdate}
                        onAddChild={handleCreateNode}
                        onDeleteNode={handleCanvasNodeDelete}
                        onConnectNode={handleConnectNode}
                        onConnectionsChange={handleConnectionsChange}
                      />
          </CanvasContainer>

          <SidePanel isOpen={sidebarOpen}>
            <NodeEditor
              node={selectedNode}
              onUpdate={handleNodeUpdate}
              onClose={() => setSidebarOpen(false)}
            />
          </SidePanel>
        </MainContent>

        {/* Mobile Floating Action Button */}
        <FloatingActionButton onClick={handleFloatingButtonClick} title="Create new node">
          +
        </FloatingActionButton>

        {/* Mobile Touch Instructions */}
        {showTouchInstructions && (
          <TouchInstructions>
            <div>📱 <strong>Touch Tips:</strong></div>
            <div>• Tap + to create nodes</div>
            <div>• Drag to move nodes</div>
            <div>• Pinch to zoom</div>
            <div>• Tap node to edit</div>
          </TouchInstructions>
        )}

      </EditorContainer>
    </DndProvider>
  );
};

export default MindMapEditor;
