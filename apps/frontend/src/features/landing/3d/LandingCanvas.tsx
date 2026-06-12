import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { SceneController } from './SceneController';
import { CameraRig } from './CameraRig';

const LandingCanvas = () => {
  return (
    // z-10: el canvas está ENCIMA del contenido de scroll
    // pointer-events-none en el wrapper, pero los Html de Drei tienen su propio manejo
    <div className="fixed inset-0 w-full h-full z-10">
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneController />
        <CameraRig />
        <Preload all />
      </Canvas>
    </div>
  );
};

export default LandingCanvas;
