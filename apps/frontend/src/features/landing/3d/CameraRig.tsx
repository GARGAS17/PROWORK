import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useActiveSection } from '../hooks/useActiveSection';
import { cameraPresets } from '../constants/cameraPresets';
import * as THREE from 'three';

export const CameraRig = () => {
  const { activeSection } = useActiveSection();
  const vec = useRef(new THREE.Vector3());
  const euler = useRef(new THREE.Euler());
  const targetQuat = useRef(new THREE.Quaternion());

  useFrame((state, delta) => {
    const preset = cameraPresets[activeSection];
    const lerpSpeed = 2.0;

    // Movimiento suave de la cámara hacia el preset
    vec.current.set(...preset.position);
    state.camera.position.lerp(vec.current, delta * lerpSpeed);

    euler.current.set(...preset.rotation);
    targetQuat.current.setFromEuler(euler.current);
    state.camera.quaternion.slerp(targetQuat.current, delta * lerpSpeed);

    // Parallax muy sutil (reducido al mínimo para no interferir con los paneles)
    const mouseX = state.pointer.x * 0.08;
    const mouseY = state.pointer.y * 0.08;
    state.camera.position.x += (preset.position[0] + mouseX - state.camera.position.x) * delta * 0.5;
    state.camera.position.y += (preset.position[1] - mouseY - state.camera.position.y) * delta * 0.5;
  });

  return null;
};
