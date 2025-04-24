export const CircleProperties = ({ selectedElement, onPropertyChange }) => {
    return (
      <div>
        <label className="block text-sm font-medium mb-1">
          Radio: {selectedElement.radius}px
        </label>
        <input
          type="range"
          min="10"
          max="150"
          value={selectedElement.radius || 50}
          onChange={(e) => onPropertyChange("radius", parseInt(e.target.value))}
          className="w-full"
        />
      </div>
    );
  };
  