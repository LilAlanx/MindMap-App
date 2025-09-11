import React from 'react';
import styled from 'styled-components';

const Line = styled.line`
  stroke: #6b7280;
  stroke-width: 3;
  stroke-dasharray: 5, 5;
  opacity: 0.7;
  transition: all 0.2s ease;
  cursor: pointer;
  z-index: 2;

  &:hover {
    stroke: #ef4444;
    stroke-width: 4;
    opacity: 1;
  }
`;

const ConnectionLine = ({ from, to, onDelete }) => {
  // Check if from and to have position and size properties
  if (!from.position || !to.position || !from.size || !to.size) {
    return null;
  }
  
  const x1 = from.position.x + from.size.width / 2;
  const y1 = from.position.y + from.size.height / 2;
  const x2 = to.position.x + to.size.width / 2;
  const y2 = to.position.y + to.size.height / 2;

  const handleClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      onClick={handleClick}
    />
  );
};

export default ConnectionLine;
