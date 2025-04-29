import { forwardRef, useEffect, useRef, useState } from 'react';
import { Circle, Layer, Line, Rect, Stage, Text } from 'react-konva';
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
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1); // 🆕 Zoom inicial
  const [isPanning, setIsPanning] = useState(false);
  const [drawingElement, setDrawingElement] = useState<any>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stageScale;

    const mousePointTo = {
      x: (stage.getPointerPosition().x - stagePosition.x) / oldScale,
      y: (stage.getPointerPosition().y - stagePosition.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? 1 : -1;
    const newScale = direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    setStageScale(newScale);

    setStagePosition({
      x: stage.getPointerPosition().x - mousePointTo.x * newScale,
      y: stage.getPointerPosition().y - mousePointTo.y * newScale,
    });
  };

  const handleMouseDown = (e: any) => {
    if (tool === "select") {
      if (e.evt.button === 1) { // Botón central = pan
        setIsPanning(true);
      }
      return;
    }

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const commonProps = {
      id: 'temp',
      x: (pointer.x - stagePosition.x) / stageScale,
      y: (pointer.y - stagePosition.y) / stageScale,
      fill: "#1d4ed8"
    };

    switch (tool) {
      case "rect":
        setDrawingElement({ ...commonProps, type: 'rect', width: 1, height: 1, rotation: 0 });
        break;
      case "circle":
        setDrawingElement({ ...commonProps, type: 'circle', radius: 1 });
        break;
      case "text":
        setDrawingElement({
          ...commonProps,
          type: 'text',
          text: "Nuevo texto",
          fontSize: 24,
          fontFamily: "Arial",
          fill: "#000000",
          rotation: 0
        });
        break;
      case "line":
        setDrawingElement({
          ...commonProps,
          type: 'line',
          points: [0, 0, 1, 1],
          strokeWidth: 2,
          rotation: 0
        });
        break;
    }
  };

  const handleMouseMove = (e: any) => {
    if (isPanning) {
      setStagePosition(prev => ({
        x: prev.x + e.evt.movementX,
        y: prev.y + e.evt.movementY
      }));
      return;
    }

    if (!drawingElement) return;

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const updated = { ...drawingElement };

    switch (drawingElement.type) {
      case "rect":
        updated.width = Math.max(5, (pointer.x - stagePosition.x) / stageScale - drawingElement.x);
        updated.height = Math.max(5, (pointer.y - stagePosition.y) / stageScale - drawingElement.y);
        break;
        case "circle": {
          const dx = (pointer.x - stagePosition.x) / stageScale - drawingElement.x;
          const dy = (pointer.y - stagePosition.y) / stageScale - drawingElement.y;
          updated.radius = Math.max(5, Math.sqrt(dx * dx + dy * dy));
          break;
        }
      case "line":
        updated.points = [0, 0, (pointer.x - stagePosition.x) / stageScale - drawingElement.x, (pointer.y - stagePosition.y) / stageScale - drawingElement.y];
        break;
    }

    setDrawingElement(updated);
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (drawingElement) {
      const finalizedElement = {
        ...drawingElement,
        id: crypto.randomUUID()
      };
      onElementDraw(finalizedElement);
      setDrawingElement(null);
    }
  };
  const handleDragEndWithBounds = (e: any, id: string) => {
    onDragEnd(e, id); // Esta función ya viene como prop desde `CanvasComponent`
  };
  const handleTransformEndWithBounds = (attrs: any) => {
    onTransformEnd(attrs.id, attrs); // 👉 También llamas al prop normal
  };

  const handleDblClick = (e: any) => {
    if (tool === "select") {
      setIsPanning(true);
    }
  };
  return (
    <div ref={containerRef} className="flex-1 overflow-hidden bg-gray-100">
      <Stage
        ref={ref}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={false} // 🛑 Stage no debe ser draggable por Konva, lo manejas manualmente
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDblClick={handleDblClick}
        className={`bg-white ${tool === "select" ? "cursor-default" : "cursor-crosshair"}`}
      >
        <Layer>
          {/* Elemento temporal */}
          {drawingElement && drawingElement.type === "rect" && (
            <Rect {...drawingElement} opacity={0.3} />
          )}
          {drawingElement && drawingElement.type === "circle" && (
            <Circle {...drawingElement} opacity={0.3} />
          )}
          {drawingElement && drawingElement.type === "text" && (
            <Text {...drawingElement} opacity={0.3} />
          )}
          {drawingElement && drawingElement.type === "line" && (
            <Line
              x={drawingElement.x}
              y={drawingElement.y}
              points={drawingElement.points}
              stroke={drawingElement.fill}
              strokeWidth={drawingElement.strokeWidth}
              opacity={0.3}
              lineCap="round"
              lineJoin="round"
              rotation={drawingElement.rotation || 0}
            />
          )}

          {/* Elementos reales */}
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
              onDragStart: (e: any) => e.cancelBubble = true,
              onDragEnd: (e: any) => {
                e.cancelBubble = true;
                handleDragEndWithBounds(e, element.id);
              },
              draggable: tool === "select" && isSelected
            };

            switch (element.type) {
              case "rect": return <RectElement {...commonProps} onTransformEnd={handleTransformEndWithBounds} />;
              case "circle": return <CircleElement {...commonProps} onTransformEnd={handleTransformEndWithBounds} />;
              case "text": return <TextElement {...commonProps} onTransformEnd={handleTransformEndWithBounds} />;
              case "line": return <LineElement {...commonProps} onTransformEnd={handleTransformEndWithBounds} />;
              default: return null;
            }
          })}
        </Layer>
      </Stage>
    </div>
  );
});
