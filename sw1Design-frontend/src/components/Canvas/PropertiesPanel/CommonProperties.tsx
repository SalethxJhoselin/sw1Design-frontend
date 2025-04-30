import { PropertiesPanelProps } from "../types";

const dashOptions = {
  solid: [],
  dashed: [10, 5],
  dotted: [2, 4]
};
export const CommonProperties = ({
  selectedElement,
  onPropertyChange
}: PropertiesPanelProps) => {
  if (!selectedElement) return null;
  const currentDash = JSON.stringify(selectedElement.dash || []);

  const getDashType = () => {
    if (currentDash === JSON.stringify([10, 5])) return 'dashed';
    if (currentDash === JSON.stringify([2, 4])) return 'dotted';
    return 'solid';
  };

  const dashType = getDashType();
  return (
    <>
      {/* 🎨 Trazo */}
      <div>
        <label className="block text-sm font-medium mb-1">Color del Borde (Trazo):</label>
        <input
          type="color"
          value={selectedElement.stroke || '#000000'}
          onChange={(e) => onPropertyChange("stroke", e.target.value)}
          className="w-full h-10 cursor-pointer"
        />
      </div>

      {/* 🎨 Fondo */}
      {"fill" in selectedElement && (
        <div>
          <label className="block text-sm font-medium mb-1">Color de Fondo:</label>
          <input
            type="color"
            value={selectedElement.fill || '#ffffff'}
            onChange={(e) => onPropertyChange("fill", e.target.value)}
            className="w-full h-10 cursor-pointer"
          />
        </div>
      )}

      {/* ➖ Grosor del Trazo */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Grosor del Trazo: {selectedElement.strokeWidth || 2}px
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={selectedElement.strokeWidth || 2}
          onChange={(e) => onPropertyChange("strokeWidth", parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* 📏 Estilo del Trazo */}
      <div>
        <label className="block text-sm font-medium mb-1">Estilo del Trazo:</label>
        <div className="flex gap-2">
          <button
            onClick={() => onPropertyChange("dash", dashOptions.solid)}
            className={`w-10 h-10 flex items-center justify-center rounded ${dashType === 'solid' ? 'bg-blue-100 border border-blue-500' : 'bg-gray-100'}`}
          >
            <div className="w-6 h-0.5 bg-black"></div>
          </button>
          <button
            onClick={() => onPropertyChange("dash", dashOptions.dashed)}
            className={`w-10 h-10 flex items-center justify-center rounded ${dashType === 'dashed' ? 'bg-blue-100 border border-blue-500' : 'bg-gray-100'}`}
          >
            <div className="w-6 h-0.5 border-t-2 border-dashed"></div>
          </button>
          <button
            onClick={() => onPropertyChange("dash", dashOptions.dotted)}
            className={`w-10 h-10 flex items-center justify-center rounded ${dashType === 'dotted' ? 'bg-blue-100 border border-blue-500' : 'bg-gray-100'}`}
          >
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
            </div>
          </button>
        </div>
      </div>

      {/* 🌫️ Opacidad */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Opacidad: {Math.round((selectedElement.opacity || 1) * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={selectedElement.opacity ?? 1}
          onChange={(e) => onPropertyChange("opacity", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* 🗂️ Capas */}
      <div>
        <label className="block text-sm font-medium mb-1">Capas:</label>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => onPropertyChange("layer", "front")} className="p-2 bg-gray-100 rounded hover:bg-gray-200">⏫</button>
          <button onClick={() => onPropertyChange("layer", "back")} className="p-2 bg-gray-100 rounded hover:bg-gray-200">⏬</button>
          <button onClick={() => onPropertyChange("layer", "up")} className="p-2 bg-gray-100 rounded hover:bg-gray-200">⬆️</button>
          <button onClick={() => onPropertyChange("layer", "down")} className="p-2 bg-gray-100 rounded hover:bg-gray-200">⬇️</button>
        </div>
      </div>
    </>
  );
};
