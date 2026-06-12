export type LandingSection = 'home' | 'how-it-works' | 'companies' | 'freelancers' | 'auth';

export type AuthMode = 'login' | 'register';

export interface CameraPreset {
  position: [number, number, number];
  rotation: [number, number, number];
  fov: number;
}
