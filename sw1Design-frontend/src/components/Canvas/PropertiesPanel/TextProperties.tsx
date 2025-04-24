export const TextProperties = ({ selectedElement, onPropertyChange }) => {
    return (
      <>
        <div>
          <label className="block text-sm font-medium mb-1">Texto:</label>
          <input
            type="text"
            value={selectedElement.text || ""}
            onChange={(e) => onPropertyChange("text", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Tamaño: {selectedElement.fontSize}px
          </label>
          <input
            type="range"
            min="10"
            max="72"
            value={selectedElement.fontSize || 22}
            onChange={(e) => onPropertyChange("fontSize", parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </>
    );
  };
  