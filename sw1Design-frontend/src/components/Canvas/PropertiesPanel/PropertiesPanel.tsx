import { useEffect, useRef, useState } from 'react';
import { Element } from '../types';
import { CircleProperties } from './CircleProperties';
import { CommonProperties } from './CommonProperties';
import { RectProperties } from './RectProperties';
import { TextProperties } from './TextProperties';

interface PropertiesPanelProps {
  selectedElement: Element | undefined;
  onPropertyChange: (prop: string, value: any) => void;
}

export const PropertiesPanel = ({ selectedElement, onPropertyChange }: PropertiesPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 300, y: 40 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    const rect = panelRef.current?.getBoundingClientRect();
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

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={panelRef}
      onMouseDown={handleMouseDown}
      className="p-4 bg-white shadow-lg border rounded-xl z-50 cursor-move select-none overflow-y-auto"
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        width: '300px',
        maxHeight: '80vh'
      }}
    >
      <h3 className="font-semibold text-lg border-b pb-2 text-center">Propiedades</h3>

      {selectedElement ? (
        <div className="space-y-4 mt-2">
          <CommonProperties selectedElement={selectedElement} onPropertyChange={onPropertyChange} />

          {selectedElement.type === "text" && (
            <TextProperties selectedElement={selectedElement} onPropertyChange={onPropertyChange} />
          )}

          {selectedElement.type === "rect" && (
            <RectProperties selectedElement={selectedElement} onPropertyChange={onPropertyChange} />
          )}

          {selectedElement.type === "circle" && (
            <CircleProperties selectedElement={selectedElement} onPropertyChange={onPropertyChange} />
          )}
        </div>
      ) : (
        <div className="text-gray-500 text-center mt-10">
          <p>Selecciona un elemento para ver sus propiedades.</p>
        </div>
      )}
    </div>
  );
};
