export const RectProperties = ({ selectedElement, onPropertyChange }) => {
    return (
      <>
        <div>
          <label className="block text-sm font-medium mb-1">
            Bordes Redondeados: {selectedElement.cornerRadius || 0}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={selectedElement.cornerRadius || 0}
            onChange={(e) => onPropertyChange("cornerRadius", parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Ancho: {selectedElement.width}px
          </label>
          <input
            type="range"
            min="20"
            max="300"
            value={selectedElement.width || 120}
            onChange={(e) => onPropertyChange("width", parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Alto: {selectedElement.height}px
          </label>
          <input
            type="range"
            min="20"
            max="300"
            value={selectedElement.height || 80}
            onChange={(e) => onPropertyChange("height", parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </>
    );
  };
  