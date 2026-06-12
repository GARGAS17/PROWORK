import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';
import { useActiveSection } from '../hooks/useActiveSection';

/**
 * ZOOM PRESETS — La cámara (toda la escena CSS) se traslada para centrar
 * exactamente el área de la fábrica que corresponde a cada sección.
 *
 * Estrategia: La fábrica panea hacia el LADO OPUESTO del texto para
 * que ambos compartan pantalla sin solaparse.
 *
 *   home        → General centered — texto al centro
 *   how-it-works→ Panel UI izq     — texto a la DERECHA, fábrica a la IZQUIERDA
 *   companies   → Cubo arriba      — texto a la IZQUIERDA, fábrica a la DERECHA
 *   freelancers → Monitor abajo-izq — texto a la DERECHA, fábrica a la IZQUIERDA
 *   auth        → Vista general
 */
const ZOOM_PRESETS: Record<string, { scale: number; x: string; y: string }> = {
  //  ① Inicio — fábrica centrada completa
  'home':         { scale: 0.70, x: '0vw',   y: '-5vh'  },

  //  ② Cómo funciona — Panel UI (izquierda) → mover fábrica a la IZQUIERDA de pantalla, texto a la DERECHA
  'how-it-works': { scale: 1.20, x: '-25vw', y: '5vh'   },

  //  ③ Empresas — Cubo azul / cinta superior → mover fábrica a la DERECHA, texto a la IZQUIERDA
  'companies':    { scale: 1.20, x: '20vw',  y: '30vh'  },

  //  ④ Talento — Monitor PC (abajo-izq) → mover fábrica a la IZQUIERDA, texto a la DERECHA
  'freelancers':  { scale: 1.20, x: '-10vw', y: '-25vh' },

  //  ⑤ Auth — vista general
  'auth':         { scale: 0.70, x: '0vw',   y: '-5vh'  },
};

export const SplineBackground = () => {
  const { activeSection } = useActiveSection();
  const preset = ZOOM_PRESETS[activeSection] ?? ZOOM_PRESETS['home'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        animate={{
          scale: preset.scale,
          x: preset.x,
          y: preset.y,
        }}
        transition={{ type: 'spring', stiffness: 40, damping: 18, mass: 1 }}
        style={{
          position: 'absolute',
          width: '300vw',
          height: '300vh',
          left: '-100vw',
          top: '-100vh',
          transformOrigin: 'center center',
        }}
      >
        <Spline
          scene="https://prod.spline.design/7RqfRsPahi14GWZc/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </motion.div>
    </div>
  );
};
