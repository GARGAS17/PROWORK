import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useActiveSection } from '../hooks/useActiveSection';

/* ─────────────────────────────────────────────
   SCROLL HELPER
───────────────────────────────────────────── */
const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/* ─────────────────────────────────────────────
   PANEL — INICIO
───────────────────────────────────────────── */
const HeroPanel = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.85, y: -20 }}
    transition={{ duration: 0.55, ease: 'easeOut' }}
    style={{ width: '560px', maxWidth: '92vw', pointerEvents: 'auto' }}
    className="flex flex-col items-center text-center gap-5 select-none"
  >
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 border border-gray-200 backdrop-blur-md shadow-sm">
      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
      <span className="text-sm font-semibold text-gray-800">Prowork 2.0 ya está aquí</span>
    </div>
    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 leading-[1.1]">
      Tus ideas valen más<br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">que tu CV.</span>
    </h1>
    <p className="text-gray-700 font-medium text-lg leading-relaxed max-w-md bg-white/30 px-4 py-2 rounded-xl backdrop-blur-sm">
      Pipeline industrial de contratación impulsado por IA. Empresa, talento y proyecto conectados en tiempo real.
    </p>
    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 font-semibold mt-1 bg-white/40 px-4 py-2 rounded-full backdrop-blur-sm">
      {[['bg-indigo-500', 'Empresa'], ['bg-emerald-500', 'Talento'], ['bg-amber-500', 'Proyecto'], ['bg-cyan-500', 'IA']].map(([c, l]) => (
        <span key={l} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${c}`} />{l}
        </span>
      ))}
    </div>
    <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
      <button onClick={() => scrollTo('auth')}
        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-xl shadow-indigo-600/20 transition transform hover:-translate-y-0.5">
        Comenzar ahora
      </button>
      <button onClick={() => scrollTo('how-it-works')}
        className="px-8 py-3 text-gray-800 font-bold bg-white/80 hover:bg-white border border-gray-200 rounded-full shadow-lg backdrop-blur-sm transition">
        Explorar pipeline
      </button>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   PANEL — CÓMO FUNCIONA
───────────────────────────────────────────── */
const HowItWorksPanel = () => (
  <motion.div
    initial={{ opacity: 0, x: -40, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: -40, scale: 0.9 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    style={{ width: '480px', maxWidth: '88vw', pointerEvents: 'auto' }}
    className="flex flex-col gap-5 select-none"
  >
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 w-fit shadow-sm">
      <span className="w-2 h-2 rounded-full bg-indigo-600" />
      <span className="text-xs font-bold text-indigo-800 tracking-widest uppercase">NODO · EMPRESA</span>
    </div>
    <h2 className="text-4xl font-black text-gray-900 leading-tight drop-shadow-sm">Pipeline inteligente.</h2>
    <p className="text-gray-800 font-medium text-base bg-white/40 px-3 py-1.5 rounded-lg backdrop-blur-sm w-fit">Sin emails. Sin esperas. Cada conexión es un evento real.</p>
    {[
      { color: 'bg-white/80 border-indigo-200 shadow-lg', dot: 'bg-indigo-600', title: 'La Empresa Publica', desc: 'El nodo empresa emite una señal al núcleo de IA con los requisitos del proyecto.' },
      { color: 'bg-white/80 border-cyan-200 shadow-lg', dot: 'bg-cyan-600', title: 'Prowork IA Valida', desc: 'El hub central procesa candidatos. Solo los nodos con fit ≥ 90% reciben el flujo de datos.' },
      { color: 'bg-white/80 border-emerald-200 shadow-lg', dot: 'bg-emerald-600', title: 'El Talento Ejecuta', desc: 'La conexión se establece. El nodo de proyecto se activa y el trabajo comienza.' },
    ].map((s, i) => (
      <motion.div key={i}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.3 }}
        className={`flex gap-4 p-4 rounded-xl border ${s.color} backdrop-blur-md`}
      >
        <div className={`w-2 h-2 rounded-full ${s.dot} mt-2 shrink-0`} />
        <div>
          <div className="font-bold text-gray-900 text-sm mb-1">{s.title}</div>
          <div className="text-gray-600 font-medium text-sm leading-relaxed">{s.desc}</div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

/* ─────────────────────────────────────────────
   PANEL — EMPRESAS
───────────────────────────────────────────── */
const CompaniesPanel = () => (
  <motion.div
    initial={{ opacity: 0, x: -40, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: -40, scale: 0.9 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    style={{ width: '460px', maxWidth: '88vw', pointerEvents: 'auto' }}
    className="flex flex-col gap-5 select-none"
  >
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 w-fit shadow-sm">
      <span className="w-2 h-2 rounded-full bg-indigo-600" />
      <span className="text-xs font-bold text-indigo-800 tracking-widest uppercase">CLUSTER · EMPRESA</span>
    </div>
    <h2 className="text-4xl font-black text-gray-900 drop-shadow-sm">Escala tu capacidad operativa.</h2>
    <p className="text-gray-800 font-medium bg-white/40 px-3 py-1.5 rounded-lg backdrop-blur-sm">Publica un proyecto y el pipeline conecta tu empresa con el talento ideal en minutos.</p>
    <div className="grid grid-cols-2 gap-3">
      {[['3x', 'Velocidad de contratación'], ['100%', 'Talento verificado']].map(([n, l]) => (
        <div key={l} className="p-4 rounded-2xl bg-white/80 border border-indigo-100 shadow-lg backdrop-blur-md">
          <div className="text-3xl font-black text-indigo-700 mb-0.5">{n}</div>
          <div className="text-xs font-bold text-gray-600">{l}</div>
        </div>
      ))}
    </div>
    <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full blur-2xl" />
      <div className="relative z-10">
        <div className="text-xs font-bold text-indigo-600 mb-1">SISTEMA ACTIVO</div>
        <div className="text-gray-900 font-black">Enterprise Ready</div>
        <div className="text-gray-600 font-medium text-sm mt-1">Acuerdos inteligentes · Pagos garantizados · Auditoría</div>
      </div>
    </div>
    <button onClick={() => scrollTo('auth')}
      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-xl shadow-indigo-600/30 transition w-fit">
      Publicar proyecto →
    </button>
  </motion.div>
);

/* ─────────────────────────────────────────────
   PANEL — TALENTO / FREELANCERS
───────────────────────────────────────────── */
const FreelancersPanel = () => (
  <motion.div
    initial={{ opacity: 0, x: -40, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: -40, scale: 0.9 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    style={{ width: '460px', maxWidth: '88vw', pointerEvents: 'auto' }}
    className="flex flex-col gap-5 select-none"
  >
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 w-fit shadow-sm">
      <span className="w-2 h-2 rounded-full bg-emerald-600" />
      <span className="text-xs font-bold text-emerald-800 tracking-widest uppercase">CLUSTER · TALENTO</span>
    </div>
    <h2 className="text-4xl font-black text-gray-900 drop-shadow-sm">Construye reputación<br />con código real.</h2>
    <p className="text-gray-800 font-medium leading-relaxed bg-white/40 px-3 py-1.5 rounded-lg backdrop-blur-sm">Tu nodo crece con cada proyecto completado. Más conexiones, más visibilidad.</p>
    <ul className="space-y-3">
      {['Proyectos top tier garantizados', 'Pagos en escrow — cobras siempre', 'Reputación on-chain verificable'].map(item => (
        <li key={item} className="flex items-center gap-3 bg-white/70 p-2 rounded-lg backdrop-blur-sm shadow-sm border border-white/50">
          <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-gray-800 font-bold text-sm">{item}</span>
        </li>
      ))}
    </ul>
    <button onClick={() => scrollTo('auth')}
      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-xl shadow-emerald-600/30 transition w-fit">
      Unirme a la red →
    </button>
  </motion.div>
);

/* ─────────────────────────────────────────────
   PANEL — AUTH
───────────────────────────────────────────── */
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

          <div className="flex p-1 bg-gray-800/80 rounded-lg mb-6 relative">
            <div className={`absolute inset-y-1 w-1/2 bg-gray-700 rounded-md shadow transition-transform duration-300 ${mode === 'register' ? 'translate-x-[calc(100%-4px)]' : 'translate-x-0'}`} />
            {(['login', 'register'] as const).map(m => (
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
                <div className="grid grid-cols-2 gap-2 mb-1">
                  {(['empresa', 'freelancer'] as const).map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={`py-3 rounded-xl border text-sm font-medium transition ${role === r
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
   PANELES HTML — Contenido que emerge flotando
───────────────────────────────────────────── */
export const NetworkGraph = () => {
  const { activeSection } = useActiveSection();

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="w-full h-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <div key="home" style={{ position: 'absolute', top: '50%', left: '8vw', transform: 'translateY(-50%)', pointerEvents: 'auto' }}>
              <HeroPanel />
            </div>
          )}
          {activeSection === 'how-it-works' && (
            <div key="hiw" style={{ position: 'absolute', top: '50%', left: '8vw', transform: 'translateY(-50%)', pointerEvents: 'auto' }}>
              <HowItWorksPanel />
            </div>
          )}
          {activeSection === 'companies' && (
            <div key="comp" style={{ position: 'absolute', top: '50%', left: '8vw', transform: 'translateY(-50%)', pointerEvents: 'auto' }}>
              <CompaniesPanel />
            </div>
          )}
          {activeSection === 'freelancers' && (
            <div key="free" style={{ position: 'absolute', top: '50%', left: '8vw', transform: 'translateY(-50%)', pointerEvents: 'auto' }}>
              <FreelancersPanel />
            </div>
          )}
          {activeSection === 'auth' && (
            <div key="auth" style={{ position: 'absolute', top: '50%', left: '8vw', transform: 'translateY(-50%)', pointerEvents: 'auto' }}>
              <AuthPanel />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
