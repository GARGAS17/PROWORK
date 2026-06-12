import { type CameraPreset, type LandingSection } from '../types/landing.types';

// Cámara alineada exactamente con la posición X,Y de cada nodo clave
// para que el nodo quede centrado en pantalla cuando se hace zoom
export const cameraPresets: Record<LandingSection, CameraPreset> = {
  home: {
    position: [0, 0, 2.8],         // Alineado con hub [0,0,0]
    rotation: [0, 0, 0],
    fov: 50,
  },
  'how-it-works': {
    position: [-2.5, 1.5, 2.2],    // Alineado con company1 [-2.5, 1.5, -0.5]
    rotation: [0, 0, 0],
    fov: 50,
  },
  companies: {
    position: [-3.0, -0.5, 2.2],   // Alineado con company2 [-3.0, -0.5, 0.2]
    rotation: [0, 0, 0],
    fov: 50,
  },
  freelancers: {
    position: [2.5, 1.8, 2.2],     // Alineado con talent1 [2.5, 1.8, 0.3]
    rotation: [0, 0, 0],
    fov: 50,
  },
  auth: {
    position: [0, 0, 3.5],         // Zoom out sobre el hub para el formulario
    rotation: [0, 0, 0],
    fov: 50,
  },
};
