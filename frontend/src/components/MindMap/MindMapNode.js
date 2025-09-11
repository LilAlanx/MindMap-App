import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { FiEdit, FiTrash2, FiPlus, FiLink } from 'react-icons/fi';

const NodeContainer = styled.div`
  position: absolute;
  left: ${props => props.position.x}px;
  top: ${props => props.position.y}px;
  width: ${props => props.size.width}px;
  height: ${props => props.size.height}px;
  background-color: ${props => props.style.backgroundColor};
  border: ${props => props.style.borderWidth}px solid ${props => props.isConnecting ? '#10b981' : props.style.borderColor};
  border-radius: ${props => props.style.borderRadius}px;
  box-shadow: ${props => props.isSelected ? props.theme.shadows.lg : props.isConnecting ? '0 0 0 3px rgba(16, 185, 129, 0.3)' : props.theme.shadows.sm};
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  transition: ${props => props.isDragging ? 'none' : '0.1s ease-out'};
  z-index: ${props => props.isSelected ? 10 : 5};
  opacity: 1;
  transform: none;
  overflow: visible;

  @media (max-width: 768px) {
    min-width: 80px;
    min-height: 60px;
    max-width: 200px;
    max-height: 120px;
    touch-action: none;
    
    &:active {
      transform: scale(1.05);
    }
  }
`;

const ResizeHandle = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.white};
  border-radius: 50%;
  cursor: ${props => props.direction}-resize;
  z-index: 15;
  opacity: ${props => props.isSelected ? 1 : 0};
  transition: opacity 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    transform: scale(1.2);
  }
  
  &.nw-resize {
    top: -4px;
    left: -4px;
  }
  
  &.ne-resize {
    top: -4px;
    right: -4px;
  }
  
  &.sw-resize {
    bottom: -4px;
    left: -4px;
  }
  
  &.se-resize {
    bottom: -4px;
    right: -4px;
  }
`;

const NodeContent = styled.div`
  width: 100%;
  height: 100%;
  padding: ${props => props.theme.spacing.sm};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: visible;
`;

const NodeTitle = styled.h3`
  font-size: ${props => props.style?.fontSize || 14}px;
  font-weight: ${props => props.style?.fontWeight || 'normal'};
  color: ${props => props.style?.textColor || '#1f2937'};
  margin: 0;
  line-height: ${props => props.theme.typography.lineHeight.tight};
  word-wrap: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const NodeContentText = styled.p`
  font-size: ${props => Math.max(8, (props.style?.fontSize || 14) - 2)}px;
  color: ${props => props.style?.textColor || '#1f2937'};
  margin: ${props => props.theme.spacing.xs} 0 0 0;
  opacity: 0.8;
  line-height: ${props => props.theme.typography.lineHeight.tight};
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const NodeActions = styled.div`
  position: absolute;
  top: -20px;
  right: -20px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 100;

  ${NodeContainer}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    background-color: #3b82f6;
    color: #ffffff;
    border-color: #3b82f6;
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
  }

  &.danger:hover {
    background-color: #ef4444;
    color: #ffffff;
    border-color: #ef4444;
    box-shadow: 0 6px 12px rgba(239, 68, 68, 0.3);
  }
`;

const AddButton = styled.button`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #3b82f6;
  border: none;
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  z-index: 100;

  ${NodeContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: #2563eb;
    transform: translateX(-50%) scale(1.15);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    bottom: -35px;
    opacity: ${props => props.isSelected ? 1 : 0};
    
    &:active {
      transform: translateX(-50%) scale(1.1);
    }
  }
`;

const ConnectButton = styled.button`
  position: absolute;
  bottom: -30px;
  left: calc(50% + 50px);
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: ${props => props.isConnecting ? '#f59e0b' : '#10b981'};
  border: none;
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  z-index: 100;

  ${NodeContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: ${props => props.isConnecting ? '#d97706' : '#059669'};
    transform: translateX(-50%) scale(1.15);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.5);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    bottom: -35px;
    left: calc(50% + 60px);
    opacity: ${props => props.isSelected ? 1 : 0};
    
    &:active {
      transform: translateX(-50%) scale(1.1);
    }
  }
`;

const MindMapNode = ({ 
  node, 
  isSelected, 
  isConnecting,
  onClick, 
  onAddChild,
  onDelete,
  onConnect,
  onUpdateNode
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [tempSize, setTempSize] = useState({ width: 0, height: 0 });
  const [tempPosition, setTempPosition] = useState({ x: 0, y: 0 });

  const [{ isDragging: isDragActive }, drag] = useDrag({
    type: 'node',
    item: () => {
      setIsDragging(true);
      return { id: node._id, type: 'node' };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      setIsDragging(false);
    }
  });

  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: node.size.width,
      height: node.size.height
    });
    
    // Initialize temporary values
    setTempSize({ width: node.size.width, height: node.size.height });
    setTempPosition({ x: node.position.x, y: node.position.y });
  };

  const handleResizeMove = useCallback((e) => {
    if (!isResizing || !resizeDirection) return;

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;
    let newX = node.position.x;
    let newY = node.position.y;

    // Calculate new dimensions based on resize direction
    if (resizeDirection.includes('e')) {
      newWidth = Math.max(100, resizeStart.width + deltaX);
    }
    if (resizeDirection.includes('w')) {
      newWidth = Math.max(100, resizeStart.width - deltaX);
      newX = node.position.x + (resizeStart.width - newWidth);
    }
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(60, resizeStart.height + deltaY);
    }
    if (resizeDirection.includes('n')) {
      newHeight = Math.max(60, resizeStart.height - deltaY);
      newY = node.position.y + (resizeStart.height - newHeight);
    }

    // Only update local state during resize (no API calls)
    setTempSize({ width: newWidth, height: newHeight });
    setTempPosition({ x: newX, y: newY });
  }, [isResizing, resizeDirection, resizeStart, node]);

  const handleResizeEnd = useCallback(() => {
    // Send final update to backend only when resize ends
    if (onUpdateNode && (tempSize.width !== node.size.width || tempSize.height !== node.size.height)) {
      onUpdateNode(node._id, {
        size: tempSize,
        position: tempPosition
      });
    }
    
    setIsResizing(false);
    setResizeDirection(null);
    setTempSize({ width: 0, height: 0 });
    setTempPosition({ x: 0, y: 0 });
  }, [onUpdateNode, tempSize, tempPosition, node]);

  // Add event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);



  const handleEdit = (e) => {
    e.stopPropagation();
    onClick(node);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this node?')) {
      if (onDelete) {
        onDelete(node._id);
      }
    }
  };

  const handleConnect = (e) => {
    e.stopPropagation();
    if (onConnect) {
      onConnect(node._id);
    }
  };

  const handleAddChild = (e) => {
    e.stopPropagation();
    if (onAddChild) {
      // Create a new node near the current node
      const newPosition = {
        x: node.position.x + 200,
        y: node.position.y + 100
      };
      
      onAddChild({
        title: 'New Child Node',
        content: 'Click to edit',
        position: newPosition,
        size: { width: 120, height: 60 },
        style: {
          backgroundColor: '#ffffff',
          borderColor: '#3b82f6',
          borderWidth: 2,
          borderRadius: 8,
          textColor: '#1f2937',
          fontSize: 14,
          fontWeight: 'normal'
        },
        parentId: node._id
      });
    }
  };

  const handleNodeClick = (e) => {
    // Only call onClick if we're not in connection mode
    if (!isConnecting) {
      onClick(node);
    }
  };

  // Ensure we have default styles
  const nodeStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    textColor: '#1f2937',
    fontSize: 14,
    fontWeight: 'normal',
    ...node.style
  };

  // Use temporary size and position during resize
  const currentSize = isResizing ? tempSize : node.size;
  const currentPosition = isResizing ? tempPosition : node.position;

  return (
    <NodeContainer
      ref={drag}
      position={currentPosition}
      size={currentSize}
      style={nodeStyle}
      isSelected={isSelected}
      isConnecting={isConnecting}
      isDragging={isDragActive}
      onClick={handleNodeClick}
    >
      <NodeContent>
        <NodeTitle style={nodeStyle}>
          {node.title}
        </NodeTitle>
        
        {node.content && (
          <NodeContentText style={nodeStyle}>
            {node.content}
          </NodeContentText>
        )}

        <NodeActions isConnecting={isConnecting}>
          <ActionButton onClick={handleEdit} title="Edit node">
            <FiEdit size={12} />
          </ActionButton>
          <ActionButton 
            onClick={handleDelete} 
            title="Delete node"
            className="danger"
          >
            <FiTrash2 size={12} />
          </ActionButton>
        </NodeActions>

        <AddButton isSelected={isSelected} isConnecting={isConnecting} onClick={handleAddChild} title="Add child node">
          <FiPlus size={12} />
        </AddButton>

        <ConnectButton isSelected={isSelected} isConnecting={isConnecting} onClick={handleConnect} title={isConnecting ? "Click to connect to this node" : "Connect to another node"}>
          <FiLink size={12} />
        </ConnectButton>
      </NodeContent>
      
      {/* Resize handles - only show when selected */}
      {isSelected && (
        <>
          <ResizeHandle
            direction="nw"
            isSelected={isSelected}
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            className="nw-resize"
          />
          <ResizeHandle
            direction="ne"
            isSelected={isSelected}
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            className="ne-resize"
          />
          <ResizeHandle
            direction="sw"
            isSelected={isSelected}
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            className="sw-resize"
          />
          <ResizeHandle
            direction="se"
            isSelected={isSelected}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            className="se-resize"
          />
        </>
      )}
    </NodeContainer>
  );
};

export default MindMapNode;
