import { useEffect, useRef, useState } from "react";
import { FiCircle, FiDownload, FiMinus, FiMousePointer, FiRotateCcw, FiRotateCw, FiSquare, FiType } from "react-icons/fi";
import { Circle, Layer, Line, Rect, Stage, Text } from "react-konva";

type Element = {
  id: string;
  type: "rect" | "circle" | "text" | "line";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fontSize?: number;
  fill: string;
  points?: number[];
};

export const CanvasComponent = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [tool, setTool] = useState<"select" | "rect" | "circle" | "text" | "line">("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<Element[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const stageRef = useRef<any>(null);

  const selectedElement = elements.find(el => el.id === selectedId);

  // Historial
  useEffect(() => {
    if (elements.length >= 0) {
      const newHistory = [...history.slice(0, historyIndex + 1), elements];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [elements]);

  const handleCanvasClick = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (tool === "select" && clickedOnEmpty) {
      setSelectedId(null);
      return;
    }

    if (tool !== "select") {
      const { x, y } = e.target.getStage().getPointerPosition();
      const newElement: Element = {
        id: crypto.randomUUID(),
        type: tool,
        x,
        y,
        fill: "#1d4ed8",
        ...(tool === "rect" && { width: 120, height: 80 }),
        ...(tool === "circle" && { radius: 50 }),
        ...(tool === "text" && { text: "Texto", fontSize: 22 }),
        ...(tool === "line" && { points: [x, y, x + 100, y + 100] }),
      };
      setElements([...elements, newElement]);
      setSelectedId(newElement.id);
    }
  };

  const handleElementClick = (e: any, id: string) => {
    e.cancelBubble = true;
    if (tool === "select") {
      setSelectedId(id);
    }
  };

  const handleDragEnd = (e: any, id: string) => {
    const updated = elements.map((el) => 
      el.id === id ? { ...el, x: e.target.x(), y: e.target.y() } : el
    );
    setElements(updated);
  };

  const updateProperty = (prop: string, value: any) => {
    const updated = elements.map((el) => 
      el.id === selectedId ? { ...el, [prop]: value } : el
    );
    setElements(updated);
  };

  const exportToPNG = () => {
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "design.png";
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mini Sidebar de Propiedades */}
      <div className={`bg-white p-4 border-r shadow-md transition-all duration-200 ${
        selectedId ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"
      }`}>
        {selectedId && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Propiedades</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Color:</label>
              <input
                type="color"
                value={selectedElement?.fill || "#1d4ed8"}
                onChange={(e) => updateProperty("fill", e.target.value)}
                className="w-full h-10 cursor-pointer"
              />
            </div>

            {selectedElement?.type === "text" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Texto:</label>
                  <input
                    type="text"
                    value={selectedElement?.text || ""}
                    onChange={(e) => updateProperty("text", e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tamaño: {selectedElement?.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="72"
                    value={selectedElement?.fontSize || 22}
                    onChange={(e) => updateProperty("fontSize", parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {selectedElement?.type === "rect" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ancho: {selectedElement?.width}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    value={selectedElement?.width || 120}
                    onChange={(e) => updateProperty("width", parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Alto: {selectedElement?.height}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    value={selectedElement?.height || 80}
                    onChange={(e) => updateProperty("height", parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {selectedElement?.type === "circle" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Radio: {selectedElement?.radius}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="150"
                  value={selectedElement?.radius || 50}
                  onChange={(e) => updateProperty("radius", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {selectedElement?.type === "line" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Grosor: 2px
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={2}
                  onChange={(e) => updateProperty("strokeWidth", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar Superior */}
        <div className="flex items-center gap-4 p-3 bg-white shadow-md border-b">
          <button 
            onClick={() => setTool("select")} 
            className={`p-2 rounded ${tool === "select" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <FiMousePointer size={20} />
          </button>
          <button 
            onClick={() => setTool("rect")} 
            className={`p-2 rounded ${tool === "rect" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <FiSquare size={20} />
          </button>
          <button 
            onClick={() => setTool("circle")} 
            className={`p-2 rounded ${tool === "circle" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <FiCircle size={20} />
          </button>
          <button 
            onClick={() => setTool("text")} 
            className={`p-2 rounded ${tool === "text" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <FiType size={20} />
          </button>
          <button 
            onClick={() => setTool("line")} 
            className={`p-2 rounded ${tool === "line" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <FiMinus size={20} />
          </button>
          
          <div className="flex-1"></div>
          
          <button 
            onClick={exportToPNG}
            className="p-2 rounded hover:bg-gray-100 text-green-600"
            title="Exportar a PNG"
          >
            <FiDownload size={20} />
          </button>
          <button 
            onClick={() => {
              if (historyIndex > 0) {
                setElements(history[historyIndex - 1]);
                setHistoryIndex(historyIndex - 1);
              }
            }}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            disabled={historyIndex === 0}
            title="Deshacer"
          >
            <FiRotateCcw size={20} />
          </button>
          <button 
            onClick={() => {
              if (historyIndex < history.length - 1) {
                setElements(history[historyIndex + 1]);
                setHistoryIndex(historyIndex + 1);
              }
            }}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            disabled={historyIndex === history.length - 1}
            title="Rehacer"
          >
            <FiRotateCw size={20} />
          </button>
        </div>

        {/* Lienzo */}
        <Stage
          ref={stageRef}
          width={window.innerWidth - (selectedId ? 256 : 0)}
          height={window.innerHeight - 64}
          onClick={handleCanvasClick}
          className="bg-white"
        >
          <Layer>
            {elements.map((el) => {
              const isSelected = el.id === selectedId;
              const commonProps = {
                key: el.id,
                x: el.x,
                y: el.y,
                fill: el.fill,
                draggable: tool === "select",
                onDragEnd: (e: any) => handleDragEnd(e, el.id),
                onClick: (e: any) => handleElementClick(e, el.id),
                stroke: isSelected ? "#10b981" : undefined,
                strokeWidth: isSelected ? 2 : undefined,
              };

              switch (el.type) {
                case "rect":
                  return <Rect {...commonProps} width={el.width} height={el.height} />;
                case "circle":
                  return <Circle {...commonProps} radius={el.radius} />;
                case "text":
                  return (
                    <Text
                      {...commonProps}
                      text={el.text}
                      fontSize={el.fontSize}
                      padding={10}
                    />
                  );
                case "line":
                  return (
                    <Line
                      {...commonProps}
                      points={el.points}
                      stroke={el.fill}
                      strokeWidth={2}
                    />
                  );
                default:
                  return null;
              }
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};