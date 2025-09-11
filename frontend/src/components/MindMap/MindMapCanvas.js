import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import MindMapNode from './MindMapNode';
import ConnectionLine from './ConnectionLine';

const Canvas = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: ${props => props.theme.colors.background};
  background-image: 
    radial-gradient(circle, ${props => props.theme.colors.border} 1px, transparent 1px);
  background-size: 20px 20px;
  overflow: hidden;
  cursor: ${props => props.isDragging ? 'grabbing' : props.isConnecting ? 'crosshair' : 'default'};
  user-select: none;
  z-index: 1;
  max-width: 100%;
  max-height: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    background-size: 15px 15px;
    touch-action: none;
    -webkit-overflow-scrolling: touch;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    20% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }
`;

const CanvasContent = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform: ${props => `translate(${props.panX}px, ${props.panY}px) scale(${props.zoom})`};
  transform-origin: 0 0;
  transition: ${props => props.isDragging ? 'none' : props.theme.transitions.fast};
  user-select: none;
  max-width: 100%;
  max-height: 100%;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    transform: ${props => `translate(${props.panX}px, ${props.panY}px) scale(${Math.max(props.zoom, 0.8)})`};
  }
`;

const MindMapCanvas = ({ nodes, onNodeSelect, selectedNode, onCreateNode, onUpdateNode, onAddChild, onDeleteNode, onConnectNode, onConnectionsChange }) => {
  const canvasRef = useRef(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [connections, setConnections] = useState([]);
  const [connectingNode, setConnectingNode] = useState(null);
  const [showConnectionInfo, setShowConnectionInfo] = useState(false);
  
  // Touch gesture states
  const [touchStart, setTouchStart] = useState(null);
  const [lastTouchDistance, setLastTouchDistance] = useState(null);
  const [isPinching, setIsPinching] = useState(false);

  // Use react-dnd's useDrop to handle node dragging
  const [, drop] = useDrop({
    accept: 'node',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const node = nodes.find(n => n._id === item.id);
        if (node) {
          const newPosition = {
            x: node.position.x + delta.x,
            y: node.position.y + delta.y
          };
          handleNodeDrop(item.id, newPosition);
        }
      }
    },
    hover: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const node = nodes.find(n => n._id === item.id);
        if (node) {
          const newPosition = {
            x: node.position.x + delta.x,
            y: node.position.y + delta.y
          };
          handleNodeDrag(item.id, newPosition);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Load connections from nodes when nodes change
  useEffect(() => {
    if (nodes && nodes.length > 0) {
      const loadedConnections = [];
      
      nodes.forEach(node => {
        if (node.connections && Array.isArray(node.connections)) {
          node.connections.forEach(conn => {
            // Find the target node
            const targetNode = nodes.find(n => n._id === conn.node);
            if (targetNode) {
              loadedConnections.push({
                id: `${node._id}-${conn.node}`,
                from: node,
                to: targetNode,
                type: conn.type || 'custom',
                label: conn.label || '',
                style: conn.style || {}
              });
            }
          });
        }
      });
      
      console.log('Loaded connections from nodes:', loadedConnections);
      setConnections(loadedConnections);
    }
  }, [nodes]);

  // Notify parent component when connections change
  useEffect(() => {
    if (onConnectionsChange) {
      onConnectionsChange(connections);
    }
  }, [connections, onConnectionsChange]);

  // Show connection info when connections are added
  useEffect(() => {
    if (connections.length > 0) {
      setShowConnectionInfo(true);
      const timer = setTimeout(() => {
        setShowConnectionInfo(false);
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [connections.length]);

  const handleMouseDown = (e) => {
    // Only start panning with right mouse button (button 2)
    if (e.button === 2) {
      // Don't start panning if we're in connection mode
      if (connectingNode) return;
      
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newPan = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      setPan(newPan);
      e.preventDefault();
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      e?.preventDefault();
    }
  };

  // Touch gesture handlers
  const getTouchDistance = (touches) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touches = e.touches;
    
    if (touches.length === 1) {
      // Single touch - start panning
      setTouchStart({ x: touches[0].clientX - pan.x, y: touches[0].clientY - pan.y });
      setIsDragging(true);
    } else if (touches.length === 2) {
      // Two touches - start pinch zoom
      setIsPinching(true);
      setLastTouchDistance(getTouchDistance(touches));
      setTouchStart(null);
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touches = e.touches;
    
    if (isDragging && touches.length === 1 && touchStart) {
      // Single touch panning
      const newPan = {
        x: touches[0].clientX - touchStart.x,
        y: touches[0].clientY - touchStart.y
      };
      setPan(newPan);
    } else if (isPinching && touches.length === 2) {
      // Pinch zoom
      const currentDistance = getTouchDistance(touches);
      if (lastTouchDistance && currentDistance > 0) {
        const scale = currentDistance / lastTouchDistance;
        const newZoom = Math.max(0.5, Math.min(3, zoom * scale));
        setZoom(newZoom);
        setLastTouchDistance(currentDistance);
      }
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setIsPinching(false);
    setTouchStart(null);
    setLastTouchDistance(null);
  };

  const handleContextMenu = (e) => {
    // Prevent context menu when right-clicking for pan
    e.preventDefault();
  };

  const handleDoubleClick = (e) => {
    if (e.target === canvasRef.current && onCreateNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      onCreateNode({
        title: 'New Node',
        content: 'Click to edit',
        position: { x, y },
        style: {
          backgroundColor: '#ffffff',
          borderColor: '#3b82f6',
          borderWidth: 2,
          borderRadius: 8
        }
      });
    }
  };

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current && connectingNode) {
      // Cancel connection mode if clicking on empty canvas
      setConnectingNode(null);
    }
  };

  const handleDeleteConnection = (connectionId) => {
    // Find the connection to delete
    const connectionToDelete = connections.find(conn => conn.id === connectionId);
    if (!connectionToDelete) return;
    
    // Remove from local state
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    
    // Update the node in the database to remove this connection
    if (onUpdateNode && connectionToDelete.from) {
      // Get current connections for this node from the database
      const currentNode = nodes.find(n => n._id === connectionToDelete.from._id);
      if (currentNode && currentNode.connections) {
        // Remove the connection from the node's connections
        const updatedConnections = currentNode.connections.filter(conn => 
          conn.node !== connectionToDelete.to._id
        );
        
        // Update the node with the new connections (async)
        onUpdateNode(connectionToDelete.from._id, {
          connections: updatedConnections
        }).then(() => {
          console.log('Connection deleted from database:', connectionId);
        }).catch((error) => {
          console.error('Error deleting connection from database:', error);
          // Revert local state if database update failed
          setConnections(prev => [...prev, connectionToDelete]);
        });
      }
    }
  };

  const handleShowConnectionInfo = () => {
    setShowConnectionInfo(true);
    const timer = setTimeout(() => {
      setShowConnectionInfo(false);
    }, 3000);
    return () => clearTimeout(timer);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, zoom * delta));
    setZoom(newZoom);
  };

  const handleNodeClick = (node) => {
    // Only handle node selection when not in connection mode
    if (!connectingNode) {
      onNodeSelect(node);
    }
  };

  const handleConnect = (nodeId) => {
    const node = nodes.find(n => n._id === nodeId);
    
    if (node) {
      if (connectingNode) {
        // If we already have a connecting node, connect them
        if (connectingNode._id !== node._id) {
          // Check if connection already exists
          const connectionExists = connections.some(conn => 
            (conn.from._id === connectingNode._id && conn.to._id === node._id) ||
            (conn.from._id === node._id && conn.to._id === connectingNode._id)
          );
          
          if (connectionExists) {
            setConnectingNode(null);
            return;
          }
          
          const newConnection = {
            id: `${connectingNode._id}-${node._id}`,
            from: connectingNode,
            to: node,
            type: 'custom'
          };
          setConnections(prev => [...prev, newConnection]);
          
          // Update the database with the new connection
          if (onUpdateNode) {
            // Get current connections for the from node
            const fromNode = nodes.find(n => n._id === connectingNode._id);
            if (fromNode) {
              const currentConnections = fromNode.connections || [];
              const newConnectionData = {
                node: node._id,
                type: 'custom',
                label: '',
                style: {}
              };
              
              // Add the new connection to the existing ones
              const updatedConnections = [...currentConnections, newConnectionData];
              
              // Update the node with the new connections (async)
              onUpdateNode(connectingNode._id, {
                connections: updatedConnections
              }).then(() => {
                console.log('Connection added to database:', newConnection.id);
              }).catch((error) => {
                console.error('Error adding connection to database:', error);
                // Remove from local state if database update failed
                setConnections(prev => prev.filter(conn => conn.id !== newConnection.id));
              });
            }
          }
          
          if (onConnectNode) {
            onConnectNode(connectingNode._id, node._id);
          }
        }
        setConnectingNode(null);
      } else {
        // Start connection mode
        setConnectingNode(node);
      }
    }
  };

  const handleNodeDrag = (nodeId, newPosition) => {
    // Update node position in real-time
    // This would typically call an API to update the node position
    
    // Update connections when node is dragged
    setConnections(prev => {
      return prev.map(conn => {
        if (conn.from._id === nodeId) {
          return {
            ...conn,
            from: { ...conn.from, position: newPosition }
          };
        }
        if (conn.to._id === nodeId) {
          return {
            ...conn,
            to: { ...conn.to, position: newPosition }
          };
        }
        return conn;
      });
    });
  };

  const handleNodeDrop = (nodeId, newPosition) => {
    // Final position update when drag ends
    if (onUpdateNode) {
      onUpdateNode(nodeId, { position: newPosition });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('click', handleCanvasClick);
      canvas.addEventListener('dblclick', handleDoubleClick);
      canvas.addEventListener('wheel', handleWheel);
      canvas.addEventListener('contextmenu', handleContextMenu);
      
      // Touch event listeners for mobile
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

      // Add global mouse up listener to handle dragging outside canvas
      const handleGlobalMouseUp = () => {
        if (isDragging) {
          setIsDragging(false);
        }
      };

      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('click', handleCanvasClick);
        canvas.removeEventListener('dblclick', handleDoubleClick);
        canvas.removeEventListener('wheel', handleWheel);
        canvas.removeEventListener('contextmenu', handleContextMenu);
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, pan, zoom, connectingNode]);

  return (
    <Canvas
      ref={(node) => {
        canvasRef.current = node;
        drop(node);
      }}
      data-canvas
      isDragging={isDragging}
      isConnecting={!!connectingNode}
      onMouseLeave={handleMouseUp}
    >
      <CanvasContent
        panX={pan.x}
        panY={pan.y}
        zoom={zoom}
        isDragging={isDragging}
      >
        {/* Render connections first so they appear behind nodes */}
        <svg
          data-connection
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
            zIndex: 1
          }}
        >
          {connections.map(connection => (
            <ConnectionLine
              key={connection.id}
              from={connection.from}
              to={connection.to}
              onDelete={() => handleDeleteConnection(connection.id)}
            />
          ))}
        </svg>

        {/* Render nodes */}
        {nodes.map(node => (
          <div key={node._id} data-node>
            <MindMapNode
              node={node}
              isSelected={selectedNode?._id === node._id}
              isConnecting={connectingNode?._id === node._id}
              onClick={() => handleNodeClick(node)}
              onAddChild={onAddChild}
              onDelete={onDeleteNode}
              onConnect={handleConnect}
              onUpdateNode={onUpdateNode}
            />
          </div>
        ))}

        {/* Connection mode indicator */}
        {connectingNode && (
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              background: 'rgba(245, 158, 11, 0.9)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              zIndex: 1000,
              pointerEvents: 'none'
            }}
          >
            Click the green button on another node to connect
          </div>
        )}

        {/* Pan mode indicator */}
        {isDragging && (
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'rgba(59, 130, 246, 0.9)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              zIndex: 1000,
              pointerEvents: 'none'
            }}
          >
            Right-click and drag to pan
          </div>
        )}

        {/* Pan help indicator */}
        {!isDragging && !connectingNode && (
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '400',
              zIndex: 1000,
              pointerEvents: 'none',
              opacity: 0.8
            }}
          >
            Right-click to pan • Left-click to drag nodes
          </div>
        )}

        {/* Connection info */}
        {showConnectionInfo && connections.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'rgba(16, 185, 129, 0.9)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              zIndex: 1000,
              pointerEvents: 'none',
              animation: 'fadeInOut 3s ease-in-out'
            }}
          >
            {connections.length} connection{connections.length !== 1 ? 's' : ''} • Click lines to delete
          </div>
        )}

        {/* Connection info button */}
        {connections.length > 0 && !showConnectionInfo && (
          <button
            onClick={handleShowConnectionInfo}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'rgba(16, 185, 129, 0.7)',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              zIndex: 1000,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(16, 185, 129, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(16, 185, 129, 0.7)';
            }}
          >
            {connections.length} connection{connections.length !== 1 ? 's' : ''}
          </button>
        )}
      </CanvasContent>
    </Canvas>
  );
};

export default MindMapCanvas;
