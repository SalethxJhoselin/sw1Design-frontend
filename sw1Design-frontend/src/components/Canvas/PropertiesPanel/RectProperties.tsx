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
      </>
    );
  };
  