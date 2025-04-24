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
        onClick={(e) => onClick(e, element.id)}
        onDragStart={(e) => {
          e.cancelBubble = true; // Esto evita que el evento se propague al stage
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

          onTransformEnd({
            id: element.id,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation()
          });
          console.log("paso 2")
          console.log(Math.max(5, node.width() * scaleX))
          console.log(Math.max(5, node.height() * scaleY))
          node.scaleX(1);
          node.scaleY(1);
        }}

        stroke={isSelected ? "#10b981" : undefined}
        strokeWidth={isSelected ? 2 : undefined}
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