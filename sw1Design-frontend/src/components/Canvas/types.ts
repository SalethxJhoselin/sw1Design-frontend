export type ToolType = "select" | "rect" | "circle" | "text" | "line";

export interface Element {
    id: string;
    type: ToolType;
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    fill: string;
    points?: number[];
    stroke?: string; //usa valor predefinido
    strokeWidth?: number;
    dash?: number[]; //permite aplicar estilos piunteados o guiones
    opacity?: number; //controla la transparencia
    cornerRadius?: number; //aplica bordes redondeados
    rotation?: number;
    innerRadius?: number; // star, arc
    outerRadius?: number; // star, arc
    angle?: number; // arc
    sides?: number; // polygon
    
    // Propiedades específicas de texto
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontStyle?: string; // 'normal', 'bold', 'italic', 'underline' o combinaciones
    align?: 'left' | 'center' | 'right' | 'justify';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    lineHeight?: number;
    letterSpacing?: number;
    padding?: number;

    // Propiedades de sombra
    shadowEnabled?: boolean;
    shadowColor?: string;
    shadowOffset?: number; // Para compatibilidad hacia atrás
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    shadowBlur?: number;
    shadowOpacity?: number;
    shadowForStrokeEnabled?: boolean;
}

export interface CanvasProps {
    elements: Element[];
    selectedId: string | null;
    onElementClick: (e: any, id: string) => void;
    onDragEnd: (e: any, id: string) => void;
    onTransformEnd: (id: string, attrs: any) => void;
    tool: ToolType;
}

export interface PropertiesPanelProps {
    selectedElement: Element | undefined;
    onPropertyChange: (prop: string, value: any) => void;
}

export interface ToolbarProps {
    tool: ToolType;
    onToolChange: (tool: ToolType) => void;
    onExport: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export interface ElementProps {
    element: Element;
    isSelected: boolean;
    onClick: (e: any, id: string) => void;
    onDragEnd: (e: any, id: string) => void;
    onTransformEnd: (id: string, attrs: any) => void;
    draggable: boolean;
}