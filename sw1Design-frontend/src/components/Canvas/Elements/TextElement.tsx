import { Text } from 'react-konva';
import { ElementProps } from '../types';

export const TextElement = ({ 
  element, 
  isSelected, 
  onClick, 
  onDragEnd, 
  draggable 
}: ElementProps) => (
  <Text
    x={element.x}
    y={element.y}
    text={element.text}
    fontSize={element.fontSize}
    fill={element.fill}
    draggable={draggable}
    onDragEnd={(e) => onDragEnd(e, element.id)}
    onClick={(e) => onClick(e, element.id)}
    stroke={isSelected ? "#10b981" : undefined}
    strokeWidth={isSelected ? 1 : undefined}
    padding={10}
  />
);