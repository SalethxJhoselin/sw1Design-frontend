import { useRef, useState } from 'react';
import { CanvasStage } from './CanvasStage';
import { PropertiesPanel } from './PropertiesPanel/PropertiesPanel';
import { Toolbar } from './Toolbar';
import { Element, ToolType } from './types';

export const CanvasComponent = () => {
    const [elements, setElements] = useState<Element[]>([]);
    const [tool, setTool] = useState<ToolType>("select");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const stageRef = useRef<any>(null);

    const selectedElement = elements.find(el => el.id === selectedId);

    const handleToolChange = (newTool: ToolType) => {
        setTool(newTool);
        setSelectedId(null);
    };

    const handleElementClick = (e: any, id: string) => {
        e.cancelBubble = true;
        if (tool === "select") {
            setSelectedId(id);
        }
    };

    const handleDragEnd = (e: any, id: string) => {
        setElements(prev =>
            prev.map(el => (el.id === id ? { ...el, x: e.target.x(), y: e.target.y() } : el))
        );
    };

    const updateProperty = (prop: string, value: any) => {
        setElements(prev =>
            prev.map(el => (el.id === selectedId ? { ...el, [prop]: value } : el))
        );
    };

    const exportToPNG = () => {
        const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
        const link = document.createElement("a");
        link.download = "design.png";
        link.href = dataURL;
        link.click();
    };

    const handleTransformEnd = (id: string, attrs: any) => {
        console.log("Transform end de konva 1", id, attrs);
        setElements(prev =>
            prev.map(el =>
                el.id === id ? {
                    ...el,
                    x: attrs.x,
                    y: attrs.y,
                    width: attrs.width,
                    height: attrs.height,
                    rotation: attrs.rotation || 0
                    // Asegúrate de incluir todas las propiedades necesarias
                } : el
            )
        );
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="relative flex-1">
                <CanvasStage
                    ref={stageRef}
                    elements={elements}
                    selectedId={selectedId}
                    onElementClick={handleElementClick}
                    onDragEnd={handleDragEnd}
                    onTransformEnd={handleTransformEnd}
                    onElementDraw={(el) => setElements(prev => [...prev, el])}
                    tool={tool}
                    hasSidebar={!!selectedId}
                />
                <Toolbar
                    tool={tool}
                    onToolChange={handleToolChange}
                    onExport={exportToPNG}
                />
                <PropertiesPanel
                    selectedElement={selectedElement}
                    onPropertyChange={updateProperty}
                />
            </div>
        </div>
    );
};