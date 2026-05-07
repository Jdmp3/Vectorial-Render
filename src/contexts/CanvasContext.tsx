import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

export type ElementType = 'rect' | 'circle' | 'line' | 'text' | 'image' | 'path';

export interface BaseElement {
  id: string;
  type: ElementType;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface RectElement extends BaseElement {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  ry?: number;
}

export interface CircleElement extends BaseElement {
  type: 'circle';
  cx: number;
  cy: number;
  r: number;
}

export interface LineElement extends BaseElement {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  x: number;
  y: number;
  content: string;
  fontSize: number;
  fontFamily: string;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  href: string;
}

export interface PathElement extends BaseElement {
  type: 'path';
  d: string;
}

export type Element = RectElement | CircleElement | LineElement | TextElement | ImageElement | PathElement;

export interface CanvasSize {
  width: number;
  height: number;
}

interface CanvasContextValue {
  canvasSize: CanvasSize | null;
  elements: Record<string, Element>;
  selectedId: string | null;
  setCanvasSize: (size: CanvasSize) => void;
  addElement: (element: Element) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  clearElements: () => void;
  getSelectedElement: () => Element | null;
  getElementById: (id: string) => Element | undefined;
}

const CanvasContext = createContext<CanvasContextValue | undefined>(undefined);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [canvasSize, setCanvasSizeState] = useState<CanvasSize | null>(null);
  const [elements, setElements] = useState<Record<string, Element>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const setCanvasSize = useCallback((size: CanvasSize) => {
    setCanvasSizeState(size);
  }, []);

  const addElement = useCallback((element: Element) => {
    setElements(prev => ({
      ...prev,
      [element.id]: element
    }));
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<Element>) => {
    setElements(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], ...updates } as Element
      };
    });
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    if (selectedId === id) {
      setSelectedId(null);
    }
  }, [selectedId]);

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const clearElements = useCallback(() => {
    setElements({});
    setSelectedId(null);
  }, []);

  const getSelectedElement = useCallback(() => {
    return selectedId ? elements[selectedId] ?? null : null;
  }, [selectedId, elements]);

  const getElementById = useCallback((id: string) => {
    return elements[id];
  }, [elements]);

  const value = useMemo(() => ({
    canvasSize,
    elements,
    selectedId,
    setCanvasSize,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    clearElements,
    getSelectedElement,
    getElementById
  }), [
    canvasSize,
    elements,
    selectedId,
    setCanvasSize,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    clearElements,
    getSelectedElement,
    getElementById
  ]);

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
}