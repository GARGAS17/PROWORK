import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { SceneController } from './SceneController';
import { CameraRig } from './CameraRig';

const LandingCanvas = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
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
