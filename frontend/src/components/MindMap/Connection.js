import React from 'react';
import styled from 'styled-components';

const ConnectionContainer = styled.div`
  position: absolute;
  pointer-events: none;
  z-index: 0;
`;

const ConnectionLine = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const Line = styled.line`
  stroke: ${props => props.color || props.theme.colors.connection};
  stroke-width: ${props => props.width || 2};
  stroke-dasharray: ${props => {
    switch (props.style) {
      case 'dashed': return '5,5';
      case 'dotted': return '2,2';
      default: return 'none';
    }
  }};
  fill: none;
  marker-end: url(#arrowhead);
`;

const ArrowMarker = styled.defs`
  marker {
    markerWidth: 10;
    markerHeight: 10;
    refX: 9;
    refY: 3;
    orient: auto;
  }
`;

const ArrowPath = styled.path`
  d: path('M0,0 L0,6 L9,3 z');
  fill: ${props => props.color || props.theme.colors.connection};
`;

const ConnectionLabel = styled.div`
  position: absolute;
  left: ${props => props.labelX}px;
  top: ${props => props.labelY}px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  transform: translate(-50%, -50%);
  white-space: nowrap;
  pointer-events: none;
`;

const Connection = ({ from, to, type, label, style = {} }) => {
  // Calculate connection points
  const fromCenter = {
    x: from.position.x + (from.size.width / 2),
    y: from.position.y + (from.size.height / 2)
  };
  
  const toCenter = {
    x: to.position.x + (to.size.width / 2),
    y: to.position.y + (to.size.height / 2)
  };

  // Calculate bounding box for the connection
  const minX = Math.min(fromCenter.x, toCenter.x);
  const minY = Math.min(fromCenter.y, toCenter.y);
  const maxX = Math.max(fromCenter.x, toCenter.x);
  const maxY = Math.max(fromCenter.y, toCenter.y);

  // Adjust for node sizes to avoid overlapping
  const fromRadius = Math.max(from.size.width, from.size.height) / 2;
  const toRadius = Math.max(to.size.width, to.size.height) / 2;

  // Calculate actual connection points on node edges
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return null;

  const fromPoint = {
    x: fromCenter.x + (dx / distance) * fromRadius,
    y: fromCenter.y + (dy / distance) * fromRadius
  };

  const toPoint = {
    x: toCenter.x - (dx / distance) * toRadius,
    y: toCenter.y - (dy / distance) * toRadius
  };

  // Calculate label position (midpoint of connection)
  const labelX = (fromPoint.x + toPoint.x) / 2;
  const labelY = (fromPoint.y + toPoint.y) / 2;

  // Adjust coordinates relative to the container
  const containerX = minX - 20;
  const containerY = minY - 20;
  const containerWidth = maxX - minX + 40;
  const containerHeight = maxY - minY + 40;

  const relativeFromPoint = {
    x: fromPoint.x - containerX,
    y: fromPoint.y - containerY
  };

  const relativeToPoint = {
    x: toPoint.x - containerX,
    y: toPoint.y - containerY
  };

  const relativeLabelX = labelX - containerX;
  const relativeLabelY = labelY - containerY;

  return (
    <ConnectionContainer
      style={{
        left: containerX,
        top: containerY,
        width: containerWidth,
        height: containerHeight
      }}
    >
      <ConnectionLine>
        <ArrowMarker>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill={style.color || '#6b7280'}
              />
            </marker>
          </defs>
        </ArrowMarker>
        
        <Line
          x1={relativeFromPoint.x}
          y1={relativeFromPoint.y}
          x2={relativeToPoint.x}
          y2={relativeToPoint.y}
          color={style.color}
          width={style.width}
          style={style.style}
        />
      </ConnectionLine>

      {label && (
        <ConnectionLabel
          labelX={relativeLabelX}
          labelY={relativeLabelY}
        >
          {label}
        </ConnectionLabel>
      )}
    </ConnectionContainer>
  );
};

export default Connection;

