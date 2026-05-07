import { useState } from 'react';
import { useCanvas } from '../contexts/CanvasContext';

const MIN_SIZE = 150;
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 980;

export function SetupModal() {
  const { setCanvasSize } = useCanvas();
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [error, setError] = useState('');

  const validate = (w: number, h: number): string => {
    if (w < MIN_SIZE) return `El ancho mínimo es ${MIN_SIZE}px`;
    if (w > MAX_WIDTH) return `El ancho máximo es ${MAX_WIDTH}px`;
    if (h < MIN_SIZE) return `El alto mínimo es ${MIN_SIZE}px`;
    if (h > MAX_HEIGHT) return `El alto máximo es ${MAX_HEIGHT}px`;
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate(width, height);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setCanvasSize({ width, height });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Configurar lienzo</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="width">Ancho (px)</label>
            <input
              type="number"
              id="width"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={MIN_SIZE}
              max={MAX_WIDTH}
            />
          </div>
          <div className="form-group">
            <label htmlFor="height">Alto (px)</label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={MIN_SIZE}
              max={MAX_HEIGHT}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary">
            Crear
          </button>
        </form>
      </div>
    </div>
  );
}