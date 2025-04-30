import type { Element } from "../types";

export const RectProperties = ({
  selectedElement,
  onPropertyChange
}: {
  selectedElement: Element;
  onPropertyChange: (prop: string, value: any) => void;
}) => {
  
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
  