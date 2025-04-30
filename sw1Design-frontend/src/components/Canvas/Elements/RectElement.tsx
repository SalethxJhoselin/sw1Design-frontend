import type { Rect as RectType } from 'konva/lib/shapes/Rect';
import type { Transformer as TransformerType } from 'konva/lib/shapes/Transformer';
import { useEffect, useRef } from 'react';
import { Rect, Transformer } from 'react-konva';
import { ElementProps } from '../types';

export const RectElement = ({
  element,
  isSelected,
  onClick,
  onDragEnd,
  onTransformEnd,
  draggable
}: ElementProps) => {
  const shapeRef = useRef<RectType | null>(null);
  const trRef = useRef<TransformerType | null>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        ref={shapeRef}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        fill={element.fill}
        draggable={draggable}
        scaleX={1}  // Aseguramos que siempre esté limpio
        scaleY={1}
        // Propiedades de borde/trazo
        stroke={element.stroke}
        strokeWidth={element.strokeWidth || 1}
        dash={element.dash}
        // Propiedades de esquinas
        cornerRadius={element.cornerRadius || 0}
        // Propiedades de opacidad
        opacity={element.opacity ?? 1}
        // Eventos
        onClick={(e) => onClick(e, element.id)}
        rotation={element.rotation || 0}
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
          const scaleY = node.scaleY();

          onTransformEnd(
            element.id,
            {
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              rotation: node.rotation()
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
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          keepRatio={false}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        />
      )}
    </>
  );
};