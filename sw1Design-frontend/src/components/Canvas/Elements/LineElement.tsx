import type { Line as LineType } from 'konva/lib/shapes/Line';
import type { Transformer as TransformerType } from 'konva/lib/shapes/Transformer';
import { useEffect, useRef } from 'react';
import { Line, Transformer } from 'react-konva';
import { ElementProps } from '../types';

export const LineElement = ({
  element,
  isSelected,
  onClick,
  onDragEnd,
  onTransformEnd,
  draggable
}: ElementProps) => {
  const shapeRef = useRef<LineType | null>(null);
  const trRef = useRef<TransformerType | null>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);
  return (
    <>
      <Line
        ref={shapeRef}
        points={element.points}
        stroke={element.fill}
        strokeWidth={element.strokeWidth || 2}
        draggable={draggable}
        x={element.x || 0}
        y={element.y || 0}
        onDragEnd={(e) => onDragEnd(e, element.id)}
        onClick={(e) => onClick(e, element.id)}
        rotation={element.rotation || 0}
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
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node || !element.points) return; 
        
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
        
          // Ajustar los puntos según el scale
          const newPoints = element.points.map((point, index) => 
            index % 2 === 0 ? point * scaleX : point * scaleY
          );
        
          onTransformEnd(
            element.id,
            {
              x: node.x(),
              y: node.y(),
              points: newPoints,
              rotation: node.rotation()
            }
          );
        
          // Resetear el scale
          node.scaleX(1);
          node.scaleY(1);
        }}
        
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        />
      )}
    </>
  )
};