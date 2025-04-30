import type { Text as TextType } from 'konva/lib/shapes/Text';
import type { Transformer as TransformerType } from 'konva/lib/shapes/Transformer';
import { useEffect, useRef } from 'react';
import { Text, Transformer } from 'react-konva';
import { ElementProps } from '../types';
export const TextElement = ({
  element,
  isSelected,
  onClick,
  onDragEnd,
  onTransformEnd,
  draggable
}: ElementProps) => {
  const shapeRef = useRef<TextType | null>(null);
  const trRef = useRef<TransformerType | null>(null);

  // Actualizar el transformer cuando cambian las propiedades del texto
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, element.text, element.fontSize, element.fontFamily]);

  // Manejar el cambio de tamaño automático del texto
  const handleResize = (node: any) => {
    if (!element.width || !element.height) {
      // Ajuste automático del tamaño
      node.width(null);
      node.height(null);
    }
  };

  return (
    <>
      <Text
        ref={(node) => {
          shapeRef.current = node;
          if (node) handleResize(node);
        }}
        x={element.x}
        y={element.y}
        text={element.text || 'Nuevo texto'}
        fontSize={element.fontSize || 16}
        fontFamily={element.fontFamily || 'Arial'}
        fontStyle={element.fontStyle || 'normal'}
        align={element.align || 'left'}
        verticalAlign={element.verticalAlign || 'top'}
        fill={element.fill || '#000000'}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth || 0}
        dash={element.dash}
        opacity={element.opacity ?? 1}
        width={element.width}
        height={element.height}
        padding={element.padding || 5}
        lineHeight={element.lineHeight || 1.2}
        letterSpacing={element.letterSpacing || 0}
        draggable={draggable}
        onClick={(e) => onClick(e, element.id)}
        rotation={element.rotation || 0}
        onDragStart={(e) => e.cancelBubble = true}
        onDragEnd={(e) => {
          onDragEnd(e, element.id);
          e.cancelBubble = true;
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const newFontSize = Math.max(8, (element.fontSize || 16) * scaleX);

          onTransformEnd(
            element.id,
            {
            x: node.x(),
            y: node.y(),
            width: element.width ? element.width * scaleX : undefined,
            height: element.height ? element.height * scaleX : undefined,
            fontSize: newFontSize,
            rotation: node.rotation()
          });

          node.scaleX(1);
          node.scaleY(1);
        }}
        shadowColor={element.shadowEnabled ? element.shadowColor : undefined}
        shadowBlur={element.shadowEnabled ? element.shadowBlur : undefined}
        shadowOffset={element.shadowEnabled ? {
          x: element.shadowOffsetX || element.shadowOffset || 5,
          y: element.shadowOffsetY || element.shadowOffset || 5
        } : undefined}
        shadowOpacity={element.shadowEnabled ? element.shadowOpacity : undefined}
        shadowForStrokeEnabled={element.shadowEnabled}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 30 || newBox.height < 30) {
              return oldBox;
            }
            return newBox;
          }}
          enabledAnchors={[
            'top-left', 'top-right', 
            'bottom-left', 'bottom-right'
          ]}
        />
      )}
    </>
  );
};