import { type CameraPreset, type LandingSection } from '../types/landing.types';

export const cameraPresets: Record<LandingSection, CameraPreset> = {
  home: {
    position: [0, 0, 5],
    rotation: [0, 0, 0],
    fov: 45,
  },
  'how-it-works': {
    position: [2, 1, 4],
    rotation: [-0.2, 0.5, 0],
    fov: 50,
  },
  companies: {
    position: [-2, -1, 6],
    rotation: [0.1, -0.3, 0],
    fov: 40,
  },
  freelancers: {
    position: [0, 2, 3],
    rotation: [-0.5, 0, 0],
    fov: 60,
  },
  auth: {
    position: [0, 0, 2], // Zoom cinematográfico profundo
    rotation: [0, 0, 0],
    fov: 35,
  },
};
