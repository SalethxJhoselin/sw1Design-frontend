import { fontFamilies, textAlignOptions } from "../../constants/text";

export const TextProperties = ({ selectedElement, onPropertyChange }) => {
  // Manejar el cambio de estilo de fuente (combinable)
  const handleFontStyleChange = (style: string) => {
    const currentStyle = selectedElement.fontStyle || 'normal';
    let newStyle = currentStyle.split(' ');

    if (currentStyle.includes(style)) {
      newStyle = newStyle.filter(s => s !== style);
    } else {
      newStyle.push(style);
    }

    onPropertyChange("fontStyle", newStyle.join(' ') || 'normal');
  };

  return (
    <div className="space-y-4">
      {/* Editor de texto principal */}
      <div>
        <label className="block text-sm font-medium mb-1">Contenido:</label>
        <textarea
          value={selectedElement.text || ""}
          onChange={(e) => onPropertyChange("text", e.target.value)}
          className="w-full p-2 border rounded min-h-[100px] text-sm"
          placeholder="Escribe tu texto aquí..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Familia tipográfica */}
        <div>
          <label className="block text-sm font-medium mb-1">Fuente:</label>
          <select
            value={selectedElement.fontFamily || 'Arial'}
            onChange={(e) => onPropertyChange("fontFamily", e.target.value)}
            className="w-full p-1 border rounded text-sm"
          >
            {fontFamilies.map(font => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Estilos y alineación */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          {/* Alineación horizontal */}
          <div>
            <label className="block text-sm font-medium mb-1">Alineación horizontal:</label>
            <div className="grid grid-cols-4 gap-1">
              {textAlignOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => onPropertyChange("align", option.value)}
                  className={`p-2 rounded text-sm flex flex-col items-center ${selectedElement.align === option.value ?
                    'bg-blue-100 border border-blue-500' : 'bg-gray-100'
                    }`}
                >
                  <span>{option.icon}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estilos:</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleFontStyleChange('bold')}
                className={`p-2 rounded flex items-center justify-center ${selectedElement.fontStyle?.includes('bold') ?
                  'bg-blue-100 border border-blue-500' : 'bg-gray-100'
                  }`}
                title="Negrita"
              >
                <span className="font-bold">B</span>
              </button>
              <button
                onClick={() => handleFontStyleChange('italic')}
                className={`p-2 rounded flex items-center justify-center ${selectedElement.fontStyle?.includes('italic') ?
                  'bg-blue-100 border border-blue-500' : 'bg-gray-100'
                  }`}
                title="Cursiva"
              >
                <span className="italic">I</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Espaciado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Interlineado: {selectedElement.lineHeight || 1.2}
          </label>
          <input
            type="range"
            min="0.8"
            max="3"
            step="0.1"
            value={selectedElement.lineHeight || 1.2}
            onChange={(e) => onPropertyChange("lineHeight", parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Espaciado letras: {selectedElement.letterSpacing || 0}px
          </label>
          <input
            type="range"
            min="-2"
            max="10"
            step="0.1"
            value={selectedElement.letterSpacing || 0}
            onChange={(e) => onPropertyChange("letterSpacing", parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Sombreado avanzado */}
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Efectos de sombra:</label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={!!selectedElement.shadowEnabled}
              onChange={(e) => onPropertyChange("shadowEnabled", e.target.checked)}
              className="mr-2"
            />
            <span>Habilitar sombra</span>
          </label>
        </div>

        {selectedElement.shadowEnabled && (
          <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Color:</label>
                <input
                  type="color"
                  value={selectedElement.shadowColor || '#000000'}
                  onChange={(e) => onPropertyChange("shadowColor", e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Opacidad:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedElement.shadowOpacity ?? 0.5}
                  onChange={(e) => onPropertyChange("shadowOpacity", parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Desplazamiento X: {selectedElement.shadowOffsetX || selectedElement.shadowOffset || 5}px
                </label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={selectedElement.shadowOffsetX || selectedElement.shadowOffset || 5}
                  onChange={(e) => onPropertyChange("shadowOffsetX", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Desplazamiento Y: {selectedElement.shadowOffsetY || selectedElement.shadowOffset || 5}px
                </label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={selectedElement.shadowOffsetY || selectedElement.shadowOffset || 5}
                  onChange={(e) => onPropertyChange("shadowOffsetY", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Difuminado: {selectedElement.shadowBlur || 5}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={selectedElement.shadowBlur || 5}
                onChange={(e) => onPropertyChange("shadowBlur", parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};