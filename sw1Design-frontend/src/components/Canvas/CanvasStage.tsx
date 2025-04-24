import { forwardRef, useEffect, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import { CircleElement } from './Elements/CircleElement';
import { LineElement } from './Elements/LineElement';
import { RectElement } from './Elements/RectElement';
import { TextElement } from './Elements/TextElement';
import { CanvasProps } from './types';

export const CanvasStage = forwardRef<any, CanvasProps>(({
  elements,
  selectedId,
  onElementClick,
  onDragEnd,
  onTransformEnd,
  onElementDraw,
  tool,
  hasSidebar
}, ref) => {
  const cursorClass = tool === "select" ? "cursor-default" : "cursor-crosshair";
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth - (hasSidebar ? 256 : 0),
    height: window.innerHeight - 64
  });
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [drawingElement, setDrawingElement] = useState<any>(null);

  const handleMouseDown = (e: any) => {
    if (tool === "select") {
      if (e.evt.button === 1) {  // Pan con botón del medio
        setIsPanning(true);
      }
      return;
    }

    // Iniciar dibujo dinámico
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();

    if (tool === "rect") {
      setDrawingElement({
        id: 'temp',
        type: 'rect',
        x: pointer.x,
        y: pointer.y,
        width: 1,
        height: 1,
        fill: "#1d4ed8"
      });
    }
    // Aquí puedes agregar lógica similar para circle, line, etc.
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }

    if (drawingElement) {
      // Guardar el elemento dibujado en la lista principal
      const finalizedElement = {
        ...drawingElement,
        id: crypto.randomUUID()
      };
      onElementDraw(finalizedElement);   // Debes crear esta función en el padre
      setDrawingElement(null);
    }
  };


  const handleMouseMove = (e: any) => {
    if (isPanning) {
      setStagePosition(prev => ({
        x: prev.x + e.evt.movementX,
        y: prev.y + e.evt.movementY
      }));
    }

    if (drawingElement) {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();

      const newWidth = pointer.x - drawingElement.x;
      const newHeight = pointer.y - drawingElement.y;

      setDrawingElement({
        ...drawingElement,
        width: Math.max(5, newWidth),
        height: Math.max(5, newHeight)
      });
    }
  };


  // Actualizar dimensiones cuando cambia el sidebar o el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth - (hasSidebar ? 256 : 0),
        height: window.innerHeight - 64
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasSidebar]);

  const handleTransformEndWithBounds = ( attrs: any) => {
    console.log('Transform end 3:', attrs.id, attrs);
    onTransformEnd(attrs.id, attrs);
  };

  const handleDragEndWithBounds = (e: any, id: string) => {
    onDragEnd(e, id);
  };

  return (
    <div className="flex-1 overflow-auto flex justify-center items-center bg-gray-100">
      <Stage
        ref={ref}
        width={dimensions.width}
        height={dimensions.height}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={false}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`bg-white ${cursorClass}`}
      >
        <Layer>
          {drawingElement && drawingElement.type === "rect" && (
            <Rect
              x={drawingElement.x}
              y={drawingElement.y}
              width={drawingElement.width}
              height={drawingElement.height}
              fill={drawingElement.fill}
              opacity={0.3}
            />
          )}
          {elements.map((element) => {
            const isSelected = element.id === selectedId;
            const commonProps = {
              key: element.id,
              element,
              isSelected,
              onClick: (e: any) => {
                e.cancelBubble = true;
                onElementClick(e, element.id);
              },
              onDragStart: (e: any) => {
                e.cancelBubble = true;
              },
              onDragEnd: (e: any) => {
                e.cancelBubble = true;
                handleDragEndWithBounds(e, element.id);
              },
              draggable: tool === "select" && isSelected
            };

            switch (element.type) {
              case "rect": return <RectElement 
                {...commonProps}
                onTransformEnd={(attrs) => handleTransformEndWithBounds(attrs)}
              />;
              case "circle": return <CircleElement {...commonProps} />;
              case "text": return <TextElement {...commonProps} />;
              case "line": return <LineElement {...commonProps} />;
              default: return null;
            }
          })}
        </Layer>
      </Stage>
    </div>
  );
});