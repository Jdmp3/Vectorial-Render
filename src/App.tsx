import './App.css';
import { SetupModal } from './components/SetupModal';
import { Canvas } from './components/Canvas';
import { CanvasProvider, useCanvas } from './contexts/CanvasContext';

function AppContent() {
  const { canvasSize } = useCanvas();

  return (
    <div className="app">
      {!canvasSize ? (
        <SetupModal />
      ) : (
        <Canvas />
      )}
    </div>
  );
}

function App() {
  return (
    <CanvasProvider>
      <AppContent />
    </CanvasProvider>
  );
}

export default App;