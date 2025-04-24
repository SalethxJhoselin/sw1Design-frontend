import React, { useRef, useState } from 'react';
import { FiCircle, FiDownload, FiMinus, FiMousePointer, FiSquare, FiType } from 'react-icons/fi';
import { ToolType } from './types';

interface ToolbarProps {
  tool: ToolType;
  onToolChange: (tool: ToolType) => void;
  onExport: () => void;
}

export const Toolbar = ({ tool, onToolChange, onExport }: ToolbarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 100, y: 20 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    const rect = toolbarRef.current?.getBoundingClientRect();
    offset.current = {
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0)
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // Listeners globales
  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={toolbarRef}
      onMouseDown={handleMouseDown}
      className="flex items-center gap-2 p-3 bg-white shadow-lg border rounded-full z-50 cursor-move select-none"
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        maxWidth: '90%',
        flexWrap: 'wrap'
      }}
    >
      {/* Botones */}
      <button
        onClick={() => onToolChange("select")}
        className={`p-2 rounded-full ${tool === "select" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
        title="Seleccionar"
      >
        <FiMousePointer size={20} />
      </button>
      <button onClick={() => onToolChange("rect")} className={`p-2 rounded-full ${tool === "rect" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`} title="Rectángulo"><FiSquare size={20} /></button>
      <button onClick={() => onToolChange("circle")} className={`p-2 rounded-full ${tool === "circle" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`} title="Círculo"><FiCircle size={20} /></button>
      <button onClick={() => onToolChange("text")} className={`p-2 rounded-full ${tool === "text" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`} title="Texto"><FiType size={20} /></button>
      <button onClick={() => onToolChange("line")} className={`p-2 rounded-full ${tool === "line" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`} title="Línea"><FiMinus size={20} /></button>
      <button onClick={onExport} className="p-2 rounded-full hover:bg-gray-100 text-green-600" title="Exportar a PNG"><FiDownload size={20} /></button>
    </div>
  );
};
