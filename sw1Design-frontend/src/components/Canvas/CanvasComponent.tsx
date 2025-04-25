import { useEffect, useRef, useState } from 'react';
import socket from '../../services/socketServices';
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

    useEffect(() => {
        socket.on('receive-element', (data: Element) => {
            setElements(prev => [...prev, data]);
        });

        socket.on('move-element', ({ id, x, y }) => {
            setElements(prev => prev.map(el => el.id === id ? { ...el, x, y } : el));
        });

        socket.on('update-element', ({ id, prop, value }) => {
            console.log("recibi de update", { id, prop, value });
            if (prop === 'bulk-update') {
                setElements(prev => prev.map(el => el.id === id ? { ...el, ...value } : el));
            } else {
                setElements(prev => prev.map(el => el.id === id ? { ...el, [prop]: value } : el));
            }
        });

        return () => {
            socket.off('receive-element');  // Limpiar al desmontar
            socket.off('move-element');
            socket.off('update-element');
        };
    }, []);

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
        const newX = e.target.x();
        const newY = e.target.y();
        setElements(prev =>
            prev.map(el => (el.id === id ? { ...el, x: newX, y: newY } : el))
        );
        socket.emit('move-element', { id, x: newX, y: newY });
    };

    const updateProperty = (prop: string, value: any) => {
        if (prop === "layer") {
            setElements(prev => {
                const currentIndex = prev.findIndex(el => el.id === selectedId);
                if (currentIndex === -1) return prev;

                const newElements = [...prev];
                const [movedElement] = newElements.splice(currentIndex, 1);

                switch (value) {
                    case "front":
                        newElements.push(movedElement);
                        break;
                    case "back":
                        newElements.unshift(movedElement);
                        break;
                    case "up":
                        newElements.splice(Math.min(currentIndex + 1, newElements.length), 0, movedElement);
                        break;
                    case "down":
                        newElements.splice(Math.max(currentIndex - 1, 0), 0, movedElement);
                        break;
                }

                return newElements;
            });
        } else {
            setElements(prev =>
                prev.map(el => (el.id === selectedId ? { ...el, [prop]: value } : el))
            );
            socket.emit('update-element', { id: selectedId, prop, value });
        }
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
            prev.map(el => {
                if (el.id !== id) return el;

                if (el.type === "rect") {
                    return {
                        ...el,
                        x: attrs.x,
                        y: attrs.y,
                        width: attrs.width,
                        height: attrs.height,
                        rotation: attrs.rotation || 0
                    };
                }

                if (el.type === "circle") {
                    return {
                        ...el,
                        x: attrs.x,
                        y: attrs.y,
                        radius: attrs.radius
                    };
                }

                if (el.type === "text") {
                    return {
                        ...el,
                        x: attrs.x,
                        y: attrs.y,
                        width: attrs.width,
                        height: attrs.height,
                        fontSize: attrs.fontSize,
                        rotation: attrs.rotation || 0
                    };
                }
                if (el.type === "line") {
                    return {
                        ...el,
                        x: attrs.x,
                        y: attrs.y,
                        points: attrs.points || el.points,
                        rotation: attrs.rotation || 0
                    };
                }
                return el;  // Para otros tipos que aún no manejamos
            })
        );
        console.log('update-element', { id, prop: 'bulk-update', value: attrs });
        socket.emit('update-element', { id, prop: 'bulk-update', value: attrs });
    };

    // Cuando se dibuja un nuevo elemento
    const handleElementDraw = (el: Element) => {
        setElements(prev => [...prev, el]);
        socket.emit('new-element', el);   // 🔴 Emitimos al servidor
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
                    onElementDraw={handleElementDraw}
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