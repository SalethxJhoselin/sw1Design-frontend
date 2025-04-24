const dashOptions = {
    solid: [],
    dashed: [10, 5],
    dotted: [2, 4]
  };
  
  export const CommonProperties = ({ selectedElement, onPropertyChange }) => {
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
          <select
            value={
              JSON.stringify(selectedElement.dash || []) === JSON.stringify([10, 5])
                ? 'dashed'
                : JSON.stringify(selectedElement.dash || []) === JSON.stringify([2, 4])
                ? 'dotted'
                : 'solid'
            }
            onChange={(e) => onPropertyChange("dash", dashOptions[e.target.value])}
            className="w-full p-2 border rounded"
          >
            <option value="solid">Sólido</option>
            <option value="dashed">Guiones</option>
            <option value="dotted">Punteado</option>
          </select>
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
      </>
    );
  };
  