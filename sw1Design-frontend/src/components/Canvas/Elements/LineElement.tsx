import { Line } from 'react-konva';
import { ElementProps } from '../types';

export const LineElement = ({ 
  element, 
  isSelected, 
  onClick, 
  onDragEnd, 
  draggable 
}: ElementProps) => (
  <Line
    points={element.points}
    stroke={element.fill}
    strokeWidth={element.strokeWidth || 2}
    draggable={draggable}
    onDragEnd={(e) => onDragEnd(e, element.id)}
    onClick={(e) => onClick(e, element.id)}
    strokeScaleEnabled={false}
    globalCompositeOperation="source-over"
    tension={0}
    lineCap="round"
    lineJoin="round"
    shadowForStrokeEnabled={false}
    hitStrokeWidth={10}
    strokeHitEnabled={true}
    perfectDrawEnabled={false}
    shadowColor={isSelected ? "#10b981" : undefined}
    shadowBlur={isSelected ? 10 : 0}
  />
);