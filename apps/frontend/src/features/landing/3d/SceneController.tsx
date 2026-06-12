import { Suspense } from 'react';
import { ContactShadows } from '@react-three/drei';
import { NetworkGraph } from './NetworkGraph';

export const SceneController = () => {
  return (
    <>
      {/* Iluminación premium */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.8} color="#6366f1" />
      <pointLight position={[0, 0, 2]} intensity={1} color="#818cf8" />

      {/* Grafo de red industrial */}
      <Suspense fallback={null}>
        <NetworkGraph />
      </Suspense>

      <ContactShadows
        position={[0, -3.5, 0]}
        opacity={0.2}
        scale={15}
        blur={3}
        far={5}
      />
    </>
  );
};
