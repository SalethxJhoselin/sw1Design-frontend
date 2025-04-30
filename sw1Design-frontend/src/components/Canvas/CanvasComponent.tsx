import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import socket from '../../services/socketServices';
import { exportToAngular } from '../utils/exportToAngular';
import { CanvasStage } from './CanvasStage';
import { PropertiesPanel } from './PropertiesPanel/PropertiesPanel';
import { Toolbar } from './Toolbar';
import { Element, ToolType } from './types';

export const CanvasComponent = () => {
    const location = useLocation();
    const { elements: initialElements, isEditor: initialIsEditor } = location.state || {};

    const isEditor = initialIsEditor || false;
    const [elements, setElements] = useState<Element[]>(initialElements || []);

    const [tool, setTool] = useState<ToolType>("select");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const stageRef = useRef<any>(null);
    const [projectId, setProjectId] = useState<string | null>(null);
    const [secretKey, setSecretKey] = useState<string | null>(null);

    const selectedElement = elements.find(el => el.id === selectedId);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('projectId');
        const key = urlParams.get('key');

        if (id) {
            setProjectId(id);
            setSecretKey(key || null);
        } else {
            console.error("❌ No se proporcionó un projectId en la URL");
        }

        socket.on('move-element', ({ id, x, y }) => {
            setElements(prev => prev.map(el => el.id === id ? { ...el, x, y } : el));
        });
        // Escuchar actualizaciones
        socket.on('elements-updated', (newElements: Element[]) => {
            setElements(newElements);
        });

        return () => {
            socket.off('move-element');
            socket.off('elements-updated');
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
        if (!isEditor) {
            const element = elements.find(el => el.id === id);
            if (element) { e.target.x(element.x); e.target.y(element.y); } return;
        }
        const newX = e.target.x();
        const newY = e.target.y();
        const updatedElements = elements.map(el =>
            el.id === id ? { ...el, x: newX, y: newY } : el
        );
        setElements(updatedElements);
        socket.emit('update-elements', {
            projectId,
            secretKey,
            elements: updatedElements,
            metadata: { updatedAt: new Date().toISOString() }
        });
    };

    const updateProperty = (prop: string, value: any) => {
        if (!isEditor) return;
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
                // Emitir cambios al backend
                console.log('update-elements', {
                    projectId,
                    secretKey,
                    elements: newElements,
                    metadata: { updatedAt: new Date().toISOString() }
                })
                socket.emit('update-elements', {
                    projectId,
                    secretKey,
                    elements: newElements,
                    metadata: { updatedAt: new Date().toISOString() }
                });
                return newElements;
            });
        } else {
            const updatedElements = elements.map(el =>
                el.id === selectedId ? { ...el, [prop]: value } : el
            );
            setElements(updatedElements);
            console.log('update-elements', {
                projectId,
                secretKey,
                elements: updatedElements,
                metadata: { updatedAt: new Date().toISOString() }
            })
            socket.emit('update-elements', {
                projectId,
                secretKey,
                elements: updatedElements,
                metadata: { updatedAt: new Date().toISOString() }
            });
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
        if (!isEditor) return;
        const updatedElements = elements.map(el => {
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

            return el;
        });

        setElements(updatedElements);

        console.log('update-elements (transform)', {
            projectId,
            secretKey,
            elements: updatedElements,
            metadata: { updatedAt: new Date().toISOString() }
        });

        socket.emit('update-elements', {
            projectId,
            secretKey,
            elements: updatedElements,
            metadata: { updatedAt: new Date().toISOString() }
        });
    };


    // Cuando se dibuja un nuevo elemento
    const handleElementDraw = (el: Element) => {
        if (!isEditor) return; // Solo editores pueden modificar
        const newElements = [...elements, el];
        setElements(newElements);
        console.log('update-elements', {
            projectId,
            secretKey,
            elements: newElements,
            metadata: { updatedAt: new Date().toISOString() }
        });
        socket.emit('update-elements', {
            projectId,
            secretKey,
            elements: newElements,
            metadata: { updatedAt: new Date().toISOString() }
        });
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
                    isEditor={isEditor}
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
            <button
                className="fixed bottom-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                onClick={() => exportToAngular(elements)}
            >
                Generar Código
            </button>
        </div>
    );
};