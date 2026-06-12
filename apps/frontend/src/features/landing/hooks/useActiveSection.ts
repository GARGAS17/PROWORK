import { useContext } from 'react';
import { LandingSectionContext } from '../context/LandingSectionContext';

export const useActiveSection = () => {
  const context = useContext(LandingSectionContext);
  if (!context) {
    throw new Error('useActiveSection debe ser usado dentro de un LandingSectionProvider');
  }
  return context;
};
