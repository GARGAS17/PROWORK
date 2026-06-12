import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';
import { useActiveSection } from '../hooks/useActiveSection';

/* ─────────────────────────────────────────────
   PRIMITIVOS 3D
───────────────────────────────────────────── */

interface NodeProps {
  position: [number, number, number];
  color: string;
  size?: number;
  pulseSpeed?: number;
}

const Node = ({ position, color, size = 0.18, pulseSpeed = 1 }: NodeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const t = state.clock.elapsedTime * pulseSpeed;
      const pulse = Math.sin(t) * 0.08 + 1;
      glowRef.current.scale.setScalar(pulse * 1.8);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(t) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.3} roughness={0.2} />
      </mesh>
    </group>
  );
};

interface ConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  opacity?: number;
}

const Connection = ({ start, end, color = '#6366f1', opacity = 0.35 }: ConnectionProps) => {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <line>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial color={color} transparent opacity={opacity} linewidth={1} />
    </line>
  );
};

interface TravelingParticleProps {
  start: [number, number, number];
  end: [number, number, number];
  speed?: number;
  color?: string;
  delay?: number;
}

const TravelingParticle = ({ start, end, speed = 0.4, color = '#a5b4fc', delay = 0 }: TravelingParticleProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);

  useFrame((state) => {
    if (meshRef.current) {
      const t = ((state.clock.elapsedTime * speed + delay) % 1);
      meshRef.current.position.lerpVectors(startVec, endVec, t);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
        t < 0.1 || t > 0.9 ? Math.min(t, 1 - t) * 10 : 1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color={color} transparent />
    </mesh>
  );
};

/* ─────────────────────────────────────────────
   PANELES HTML — Contenido que emerge de los nodos
───────────────────────────────────────────── */

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const HeroPanel = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.85, y: -20 }}
    transition={{ duration: 0.55, ease: 'easeOut' }}
    style={{ width: '560px', maxWidth: '92vw', pointerEvents: 'auto' }}
    className="flex flex-col items-center text-center gap-5 select-none"
  >
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 backdrop-blur-sm">
      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
      <span className="text-sm font-medium text-indigo-300">Prowork 2.0 ya está aquí</span>
    </div>
    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
      Tus ideas valen más<br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">que tu CV.</span>
    </h1>
    <p className="text-gray-400 text-lg leading-relaxed max-w-md">
      Pipeline industrial de contratación impulsado por IA. Empresa, talento y proyecto conectados en tiempo real.
    </p>
    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mt-1">
      {[['bg-indigo-400','Empresa'],['bg-emerald-400','Talento'],['bg-amber-400','Proyecto'],['bg-cyan-400','IA']].map(([c,l]) => (
        <span key={l} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${c}`} />{l}
        </span>
      ))}
    </div>
    <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
      <button onClick={() => scrollTo('auth')}
        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5">
        Comenzar ahora
      </button>
      <button onClick={() => scrollTo('how-it-works')}
        className="px-8 py-3 text-gray-300 border border-white/20 hover:bg-white/10 rounded-full transition">
        Explorar pipeline
      </button>
    </div>
  </motion.div>
);

const HowItWorksPanel = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85, x: -30 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.85, x: 30 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    style={{ width: '520px', maxWidth: '92vw', pointerEvents: 'auto' }}
    className="flex flex-col gap-5 select-none"
  >
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 w-fit">
      <span className="w-2 h-2 rounded-full bg-indigo-400" />
      <span className="text-xs font-mono text-indigo-300 tracking-widest uppercase">NODO · EMPRESA</span>
    </div>
    <h2 className="text-4xl font-bold text-white leading-tight">Pipeline inteligente.</h2>
    <p className="text-gray-400 text-base">Sin emails. Sin esperas. Cada conexión del grafo es un evento real del proceso de contratación.</p>
    {[
      { color: 'bg-indigo-500/20 border-indigo-500/30', dot: 'bg-indigo-400', title: 'La Empresa Publica', desc: 'El nodo empresa emite una señal al núcleo de IA con los requisitos del proyecto.' },
      { color: 'bg-cyan-500/20 border-cyan-500/30', dot: 'bg-cyan-400', title: 'Prowork IA Valida', desc: 'El hub central procesa candidatos. Solo los nodos con fit ≥ 90% reciben el flujo de datos.' },
      { color: 'bg-emerald-500/20 border-emerald-500/30', dot: 'bg-emerald-400', title: 'El Talento Ejecuta', desc: 'La conexión se establece. El nodo de proyecto se activa y el trabajo comienza.' },
    ].map((s, i) => (
      <motion.div key={i}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.3 }}
        className={`flex gap-4 p-4 rounded-xl border ${s.color} backdrop-blur-sm`}
      >
        <div className={`w-2 h-2 rounded-full ${s.dot} mt-2 shrink-0`} />
        <div>
          <div className="font-bold text-white text-sm mb-1">{s.title}</div>
          <div className="text-gray-400 text-sm leading-relaxed">{s.desc}</div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

const CompaniesPanel = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.85, y: -30 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    style={{ width: '480px', maxWidth: '92vw', pointerEvents: 'auto' }}
    className="flex flex-col gap-5 select-none"
  >
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 w-fit">
      <span className="w-2 h-2 rounded-full bg-indigo-400" />
      <span className="text-xs font-mono text-indigo-300 tracking-widest uppercase">CLUSTER · EMPRESA</span>
    </div>
    <h2 className="text-4xl font-bold text-white">Escala tu capacidad operativa.</h2>
    <p className="text-gray-400">Publica un proyecto y el grafo conecta tu empresa con el nodo de talento ideal en minutos, no semanas.</p>
    <div className="grid grid-cols-2 gap-3">
      {[['3x','Velocidad de contratación'],['100%','Talento verificado']].map(([n,l]) => (
        <div key={l} className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <div className="text-3xl font-bold text-white mb-0.5">{n}</div>
          <div className="text-xs text-gray-400">{l}</div>
        </div>
      ))}
    </div>
    <div className="p-4 rounded-2xl bg-gray-900/80 border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/15 rounded-full blur-2xl" />
      <div className="relative z-10">
        <div className="text-xs font-mono text-indigo-400 mb-1">SISTEMA ACTIVO</div>
        <div className="text-white font-bold">Enterprise Ready</div>
        <div className="text-gray-500 text-sm mt-1">Acuerdos inteligentes · Pagos garantizados · Auditoría</div>
      </div>
    </div>
    <button onClick={() => scrollTo('auth')}
      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full shadow-xl shadow-indigo-600/30 transition w-fit">
      Publicar proyecto →
    </button>
  </motion.div>
);

const FreelancersPanel = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85, x: 30 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.85, x: -30 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    style={{ width: '480px', maxWidth: '92vw', pointerEvents: 'auto' }}
    className="flex flex-col gap-5 select-none"
  >
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 w-fit">
      <span className="w-2 h-2 rounded-full bg-emerald-400" />
      <span className="text-xs font-mono text-emerald-300 tracking-widest uppercase">CLUSTER · TALENTO</span>
    </div>
    <h2 className="text-4xl font-bold text-white">Construye reputación<br />con código real.</h2>
    <p className="text-gray-400 leading-relaxed">Tu nodo crece con cada proyecto completado. Más conexiones, más visibilidad, proyectos de mayor impacto.</p>
    <ul className="space-y-3">
      {['Proyectos top tier garantizados','Pagos en escrow — cobras siempre','Reputación on-chain verificable'].map(item => (
        <li key={item} className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-gray-200 font-medium text-sm">{item}</span>
        </li>
      ))}
    </ul>
    <button onClick={() => scrollTo('auth')}
      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-full shadow-xl shadow-emerald-600/30 transition w-fit">
      Unirme a la red →
    </button>
  </motion.div>
);

const AuthPanel = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'empresa' | 'freelancer' | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ width: '420px', maxWidth: '92vw', pointerEvents: 'auto' }}
      className="select-none"
    >
      <div className="bg-gray-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/60 rounded-3xl p-7 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Acceso a Prowork</h2>
            <p className="text-sm text-gray-500">Únete a la red de talento y empresas de élite.</p>
          </div>

          {/* Toggle */}
          <div className="flex p-1 bg-gray-800/80 rounded-lg mb-6 relative">
            <div className={`absolute inset-y-1 w-1/2 bg-gray-700 rounded-md shadow transition-transform duration-300 ${mode === 'register' ? 'translate-x-[calc(100%-4px)]' : 'translate-x-0'}`} />
            {(['login','register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${mode === m ? 'text-white' : 'text-gray-500'}`}>
                {m === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form key="login"
                initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                onSubmit={e => e.preventDefault()}
                className="flex flex-col gap-3"
              >
                <input type="email" placeholder="Correo electrónico" autoComplete="email"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition" />
                <input type="password" placeholder="Contraseña" autoComplete="current-password"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition" />
                <button type="submit" className="w-full mt-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm shadow-lg transition">
                  Entrar al sistema
                </button>
              </motion.form>
            ) : (
              <motion.form key="register"
                initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                onSubmit={e => e.preventDefault()}
                className="flex flex-col gap-3"
              >
                {/* Role selector */}
                <div className="grid grid-cols-2 gap-2 mb-1">
                  {(['empresa','freelancer'] as const).map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={`py-3 rounded-xl border text-sm font-medium transition ${
                        role === r
                          ? r === 'empresa' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                          : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-400'
                      }`}>
                      {r === 'empresa' ? '🏢 Empresa' : '💻 Freelancer'}
                    </button>
                  ))}
                </div>
                <input type="text" placeholder="Nombre completo"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition" />
                <input type="email" placeholder="Correo electrónico" autoComplete="email"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition" />
                <input type="password" placeholder="Contraseña" autoComplete="new-password"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition" />
                <button type="submit" disabled={!role}
                  className="w-full mt-1 py-3 bg-indigo-600 disabled:bg-gray-700 disabled:text-gray-500 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm shadow-lg transition">
                  Crear cuenta
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   GRAFO PRINCIPAL
───────────────────────────────────────────── */
export const NetworkGraph = () => {
  const { activeSection } = useActiveSection();

  const nodes = useMemo(() => ({
    hub:       [0, 0, 0] as [number, number, number],
    company1:  [-2.5, 1.5, -0.5] as [number, number, number],
    company2:  [-3.0, -0.5, 0.2] as [number, number, number],
    company3:  [-2.0, -1.8, -0.3] as [number, number, number],
    talent1:   [2.5, 1.8, 0.3] as [number, number, number],
    talent2:   [3.2, 0.2, -0.4] as [number, number, number],
    talent3:   [2.8, -1.5, 0.2] as [number, number, number],
    talent4:   [1.8, -2.2, -0.5] as [number, number, number],
    project1:  [0.5, -2.8, 0.5] as [number, number, number],
    project2:  [-1.2, -2.5, -0.2] as [number, number, number],
    validate1: [0, 2.5, 0.4] as [number, number, number],
    validate2: [1.2, 2.0, -0.3] as [number, number, number],
  }), []);

  const connections: [keyof typeof nodes, keyof typeof nodes, string, number][] = [
    ['hub', 'company1', '#6366f1', 0.5], ['hub', 'company2', '#6366f1', 0.4], ['hub', 'company3', '#6366f1', 0.3],
    ['hub', 'talent1', '#22c55e', 0.5], ['hub', 'talent2', '#22c55e', 0.5], ['hub', 'talent3', '#22c55e', 0.4], ['hub', 'talent4', '#22c55e', 0.3],
    ['hub', 'project1', '#f59e0b', 0.5], ['hub', 'project2', '#f59e0b', 0.4],
    ['hub', 'validate1', '#06b6d4', 0.5], ['hub', 'validate2', '#06b6d4', 0.4],
    ['company1', 'talent1', '#a5b4fc', 0.2], ['company2', 'talent3', '#a5b4fc', 0.2],
    ['company3', 'project1', '#fde68a', 0.2], ['validate1', 'talent1', '#67e8f9', 0.2],
  ];

  const travelRoutes: [keyof typeof nodes, keyof typeof nodes, string, number, number][] = [
    ['company1', 'hub', '#a5b4fc', 0.5, 0.0], ['hub', 'talent1', '#4ade80', 0.6, 0.2],
    ['talent2', 'hub', '#4ade80', 0.5, 0.5], ['hub', 'validate1', '#67e8f9', 0.7, 0.7],
    ['company2', 'hub', '#a5b4fc', 0.4, 0.3], ['hub', 'project1', '#fbbf24', 0.5, 0.9],
    ['talent3', 'hub', '#4ade80', 0.6, 0.1], ['hub', 'company3', '#a5b4fc', 0.5, 0.6],
  ];

  return (
    <group>
      {/* Conexiones */}
      {connections.map(([from, to, color, opacity], i) => (
        <Connection key={i} start={nodes[from]} end={nodes[to]} color={color} opacity={opacity} />
      ))}

      {/* Partículas en tránsito */}
      {travelRoutes.map(([from, to, color, speed, delay], i) => (
        <TravelingParticle key={i} start={nodes[from]} end={nodes[to]} color={color} speed={speed} delay={delay} />
      ))}

      {/* ── HUB CENTRAL: Hero y Auth ── */}
      <group position={nodes.hub}>
        <Node position={[0, 0, 0]} color="#6366f1" size={0.35} pulseSpeed={1.5} />
        <Html center zIndexRange={[200, 0]} style={{ pointerEvents: 'auto' }}>
          <AnimatePresence mode="wait">
            {activeSection === 'home' && <HeroPanel key="hero" />}
            {activeSection === 'auth' && <AuthPanel key="auth" />}
          </AnimatePresence>
        </Html>
      </group>

      {/* ── EMPRESA 1: How It Works ── */}
      <group position={nodes.company1}>
        <Node position={[0, 0, 0]} color="#818cf8" size={0.22} pulseSpeed={0.8} />
        <Html center zIndexRange={[200, 0]} style={{ pointerEvents: 'auto' }}>
          <AnimatePresence mode="wait">
            {activeSection === 'how-it-works' && <HowItWorksPanel key="hiw" />}
          </AnimatePresence>
        </Html>
      </group>

      {/* ── EMPRESA 2: Companies ── */}
      <group position={nodes.company2}>
        <Node position={[0, 0, 0]} color="#818cf8" size={0.18} pulseSpeed={1.1} />
        <Html center zIndexRange={[200, 0]} style={{ pointerEvents: 'auto' }}>
          <AnimatePresence mode="wait">
            {activeSection === 'companies' && <CompaniesPanel key="companies" />}
          </AnimatePresence>
        </Html>
      </group>

      {/* ── TALENT 1: Freelancers ── */}
      <group position={nodes.talent1}>
        <Node position={[0, 0, 0]} color="#4ade80" size={0.22} pulseSpeed={1.2} />
        <Html center zIndexRange={[200, 0]} style={{ pointerEvents: 'auto' }}>
          <AnimatePresence mode="wait">
            {activeSection === 'freelancers' && <FreelancersPanel key="freelancers" />}
          </AnimatePresence>
        </Html>
      </group>

      {/* Resto de nodos (decorativos) */}
      <Node position={nodes.company3} color="#818cf8" size={0.16} pulseSpeed={0.9} />
      <Node position={nodes.talent2} color="#4ade80" size={0.18} pulseSpeed={0.7} />
      <Node position={nodes.talent3} color="#4ade80" size={0.20} pulseSpeed={1.0} />
      <Node position={nodes.talent4} color="#4ade80" size={0.14} pulseSpeed={1.3} />
      <Node position={nodes.project1} color="#fbbf24" size={0.20} pulseSpeed={0.9} />
      <Node position={nodes.project2} color="#fbbf24" size={0.16} pulseSpeed={1.1} />
      <Node position={nodes.validate1} color="#22d3ee" size={0.18} pulseSpeed={1.4} />
      <Node position={nodes.validate2} color="#22d3ee" size={0.15} pulseSpeed={1.0} />
    </group>
  );
};
