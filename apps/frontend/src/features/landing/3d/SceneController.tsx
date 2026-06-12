import { Environment, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import { FloatingCore } from './FloatingCore';
import { ParticleSystem } from './ParticleSystem';

export const SceneController = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#4f46e5" />
      
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
      
      <FloatingCore />
      <ParticleSystem />
      
      <ContactShadows 
        position={[0, -3, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={2} 
        far={4.5} 
      />
    </>
  );
};
