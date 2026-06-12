import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useActiveSection } from '../hooks/useActiveSection';
import { cameraPresets } from '../constants/cameraPresets';
import * as THREE from 'three';

export const CameraRig = () => {
  const { activeSection } = useActiveSection();
  const vec = useRef(new THREE.Vector3());
  const euler = useRef(new THREE.Euler());
  const quat = useRef(new THREE.Quaternion());
  const targetQuat = useRef(new THREE.Quaternion());

  useFrame((state, delta) => {
    const preset = cameraPresets[activeSection];
    
    vec.current.set(...preset.position);
    state.camera.position.lerp(vec.current, delta * 2.5);
    
    euler.current.set(...preset.rotation);
    targetQuat.current.setFromEuler(euler.current);
    
    quat.current.copy(state.camera.quaternion);
    quat.current.slerp(targetQuat.current, delta * 2.5);
    state.camera.quaternion.copy(quat.current);
    
    const mouseX = (state.pointer.x * Math.PI) / 20;
    const mouseY = (state.pointer.y * Math.PI) / 20;
    
    state.camera.position.x += (mouseX - state.camera.position.x) * delta * 0.5;
    state.camera.position.y += (-mouseY - state.camera.position.y) * delta * 0.5;
  });

  return null;
};
