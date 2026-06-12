import { useRef } from 'react';
import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';

export const SplineBackground = () => {
  const spline = useRef<Application>();

  function onLoad(splineApp: Application) {
    spline.current = splineApp;
    // Intentar ajustar el zoom nativo de la aplicación Spline
    if (typeof splineApp.setZoom === 'function') {
      splineApp.setZoom(0.6); // Alejar la cámara al 60%
    }
    
    // Si la cámara principal es accesible, también podemos alejarla
    // moviendo su posición en el eje Z.
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        zIndex: 1, // Capa base
        pointerEvents: 'none', // Para que no intercepte el scroll
      }}
    >
      <Spline
        scene="https://prod.spline.design/7RqfRsPahi14GWZc/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
        onLoad={onLoad}
      />
    </div>
  );
};
