import { useCanvas } from '../contexts/CanvasContext';
import { Element } from '../contexts/CanvasContext';

export function Canvas() {
  const { canvasSize, elements, selectedId, selectElement } = useCanvas();

  if (!canvasSize) return null;

  const { width, height } = canvasSize;

  const renderElement = (element: Element, isSelected: boolean) => {
    const commonProps = {
      key: element.id,
      fill: element.fill,
      stroke: element.stroke,
      strokeWidth: element.strokeWidth,
      ...(isSelected && { stroke: '#0066ff', strokeWidth: element.strokeWidth + 2 }),
      style: { cursor: 'pointer' },
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        selectElement(element.id);
      }
    };

    switch (element.type) {
      case 'rect':
        return (
          <rect
            {...commonProps}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            rx={element.rx}
            ry={element.ry}
          />
        );
      case 'circle':
        return (
          <circle
            {...commonProps}
            cx={element.cx}
            cy={element.cy}
            r={element.r}
          />
        );
      case 'line':
        return (
          <line
            {...commonProps}
            x1={element.x1}
            y1={element.y1}
            x2={element.x2}
            y2={element.y2}
          />
        );
      case 'text':
        return (
          <text
            {...commonProps}
            x={element.x}
            y={element.y}
            fontSize={element.fontSize}
            fontFamily={element.fontFamily}
          >
            {element.content}
          </text>
        );
      case 'image':
        return (
          <image
            {...commonProps}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            href={element.href}
          />
        );
      case 'path':
        return (
          <path
            {...commonProps}
            d={element.d}
          />
        );
      default:
        return null;
    }
  };

  const handleCanvasClick = () => {
    selectElement(null);
  };

  return (
    <div className="canvas-container">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        className="canvas-svg"
        onClick={handleCanvasClick}
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="#ffffff"
          stroke="rgb(70, 1, 70)"
          strokeWidth="1"
        />

        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="url(#grid)"
        />

        <g>
          {Object.values(elements).map(element =>
            renderElement(element, selectedId === element.id)
          )}
        </g>
      </svg>
    </div>
  );
}