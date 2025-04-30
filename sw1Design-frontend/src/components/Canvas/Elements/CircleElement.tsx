import type { Circle as CircleType } from 'konva/lib/shapes/Circle';
import type { Transformer as TransformerType } from 'konva/lib/shapes/Transformer';
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
  const shapeRef = useRef<CircleType | null>(null);
  const trRef = useRef<TransformerType | null>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Circle
        ref={shapeRef}
        x={element.x}
        y={element.y}
        radius={element.radius || 50}
        fill={element.fill}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth || 1}
        dash={element.dash}
        opacity={element.opacity ?? 1}
        draggable={draggable}
        onClick={(e) => onClick(e, element.id)}
        onDragStart={(e) => {
          e.cancelBubble = true;
        }}
        onDragEnd={(e) => {
          onDragEnd(e, element.id);
          e.cancelBubble = true;
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();

          onTransformEnd(
            element.id,
            {
              x: node.x(),
              y: node.y(),
              radius: Math.max(5, (element.radius || 50) * scaleX),
            }
          );

          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
          keepRatio={true} // Mantener relación de aspecto para círculos
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right'
          ]}
        />
      )}
    </>
  );
};