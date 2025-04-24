import { useEffect, useRef } from 'react';
import { Circle, Transformer } from 'react-konva';
import { ElementProps } from '../types';

export const CircleElement = ({ 
  element, 
  isSelected, 
  onClick, 
  onDragEnd,
  onTransformEnd,
  draggable 
}: ElementProps) => {
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Circle
        ref={shapeRef}
        x={element.x}
        y={element.y}
        radius={element.radius}
        fill={element.fill}
        draggable={draggable}
        onDragEnd={(e) => onDragEnd(e, element.id)}
        onClick={(e) => onClick(e, element.id)}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          
          onTransformEnd(element.id, {
            x: node.x(),
            y: node.y(),
            radius: Math.max(5, element.radius * scaleX),
          });
          
          node.scaleX(1);
          node.scaleY(1);
        }}
        stroke={isSelected ? "#10b981" : undefined}
        strokeWidth={isSelected ? 2 : undefined}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          resizeEnabled={true}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};