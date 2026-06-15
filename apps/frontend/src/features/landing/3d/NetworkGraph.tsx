import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useActiveSection } from '../hooks/useActiveSection';
import { Sparkles, ArrowRight, Server, ShieldCheck, Zap, Briefcase, Building2, TerminalSquare, CheckCircle2 } from 'lucide-react';

/* ─────────────────────────────────────────────
   FLYWEIGHT CONFIGURATIONS (Intrinsic State)
   Shared memory references to prevent GC overhead
───────────────────────────────────────────── */
const FW_ANIM = {
  panelSpring: {
    initial: { opacity: 0, scale: 0.95, y: 15 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -15 },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  },
  panelSlide: {
    initial: { opacity: 0, x: -40, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -40, scale: 0.95 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
  authSpring: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -20 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
  hoverButton: {
    whileHover: { scale: 1.03, y: -2 },
    whileTap: { scale: 0.97 }
  },
  itemSlideUp: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  }
};

const FW_DATA = {
  heroTags: [
    { color: 'text-indigo-600', label: 'Empresa', icon: Building2 },
    { color: 'text-emerald-600', label: 'Talento', icon: TerminalSquare },
    { color: 'text-amber-500', label: 'Proyecto', icon: Briefcase },
    { color: 'text-cyan-600', label: 'IA', icon: Zap }
  ],
  pipelineNodes: [
    { color: 'from-indigo-500/10 to-transparent border-indigo-200', icon: Building2, iconColor: 'text-indigo-600', bg: 'bg-indigo-100', title: 'La Empresa Publica', desc: 'El nodo empresa emite una señal al núcleo de IA con los requisitos del proyecto.' },
    { color: 'from-cyan-500/10 to-transparent border-cyan-200', icon: Zap, iconColor: 'text-cyan-600', bg: 'bg-cyan-100', title: 'Prowork IA Valida', desc: 'El hub central procesa candidatos. Solo los nodos con fit ≥ 90% reciben el flujo de datos.' },
    { color: 'from-emerald-500/10 to-transparent border-emerald-200', icon: TerminalSquare, iconColor: 'text-emerald-600', bg: 'bg-emerald-100', title: 'El Talento Ejecuta', desc: 'La conexión se establece. El nodo de proyecto se activa y el trabajo comienza.' },
  ],
  companyMetrics: [
    { val: '3x', label: 'Velocidad de contratación' },
    { val: '100%', label: 'Talento verificado' }
  ],
  freelanceBenefits: [
    'Proyectos top tier de startups YC',
    'Pagos en escrow — cobras siempre',
    'Reputación on-chain verificable'
  ]
};

/* ─────────────────────────────────────────────
   FLYWEIGHT COMPONENT (Structural Sharing)
───────────────────────────────────────────── */
const PipelineNode = ({ s, i }: { s: any; i: number }) => (
  <motion.div
    initial={FW_ANIM.itemSlideUp.initial}
    animate={FW_ANIM.itemSlideUp.animate}
    transition={{ delay: i * 0.15 + 0.2 }}
    whileHover={{ x: 5, scale: 1.02 }}
    className={`flex gap-5 p-5 rounded-2xl bg-gradient-to-r bg-white/70 ${s.color} border backdrop-blur-xl shadow-xl shadow-black/5 cursor-default`}
  >
    <div className={`w-12 h-12 rounded-xl ${s.bg} border border-white/60 shadow-inner flex items-center justify-center shrink-0`}>
      <s.icon className={`w-6 h-6 ${s.iconColor}`} />
    </div>
    <div>
      <div className="font-bold text-gray-900 text-lg mb-1">{s.title}</div>
      <div className="text-gray-700 font-medium text-sm leading-relaxed">{s.desc}</div>
    </div>
  </motion.div>
);

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
    {...FW_ANIM.panelSpring}
    style={{ width: '600px', maxWidth: '92vw', pointerEvents: 'auto' }}
    className="flex flex-col items-start gap-6 select-none relative"
  >
    {/* Glow background */}
    <div className="absolute -inset-20 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 border border-white/50 backdrop-blur-xl shadow-sm text-sm font-semibold text-gray-800"
    >
      <Sparkles className="w-4 h-4 text-indigo-600" />
      <span>Prowork 2.0 ya está aquí</span>
    </motion.div>

    <h1 className="text-6xl md:text-7xl font-black tracking-tight text-gray-900 leading-[1.05] drop-shadow-sm">
      Tus ideas valen<br />
      más <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">que tu CV.</span>
    </h1>

    <p className="text-gray-800 font-medium text-xl leading-relaxed max-w-lg bg-white/40 px-6 py-4 rounded-2xl border border-white/30 backdrop-blur-xl shadow-lg shadow-black/5">
      Pipeline industrial de contratación impulsado por IA. Empresa, talento y proyecto conectados en tiempo real.
    </p>

    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-800 font-bold mt-2">
      {FW_DATA.heroTags.map(({color, label, icon: Icon}) => (
        <span key={label} className="flex items-center gap-1.5 bg-white/50 px-4 py-2 rounded-xl backdrop-blur-md border border-white/40 shadow-sm">
          <Icon className={`w-4 h-4 ${color}`} />{label}
        </span>
      ))}
    </div>

    <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
      <motion.button 
        {...FW_ANIM.hoverButton}
        onClick={() => scrollTo('auth')}
        className="flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl shadow-2xl shadow-gray-900/20 transition-all border border-gray-700"
      >
        Comenzar ahora <ArrowRight className="w-5 h-5" />
      </motion.button>
      <motion.button 
        {...FW_ANIM.hoverButton}
        onClick={() => scrollTo('how-it-works')}
        className="px-8 py-4 text-gray-900 font-bold bg-white/60 hover:bg-white/80 border border-white/60 rounded-2xl shadow-xl shadow-black/5 backdrop-blur-xl transition-all"
      >
        Explorar pipeline
      </motion.button>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   PANEL — CÓMO FUNCIONA
───────────────────────────────────────────── */
const HowItWorksPanel = () => (
  <motion.div
    {...FW_ANIM.panelSlide}
    style={{ width: '500px', maxWidth: '88vw', pointerEvents: 'auto' }}
    className="flex flex-col gap-6 select-none relative"
  >
    <div className="absolute -inset-32 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200/50 backdrop-blur-md w-fit shadow-sm">
      <Server className="w-3.5 h-3.5 text-indigo-700" />
      <span className="text-xs font-bold text-indigo-800 tracking-widest uppercase">NODO · PIPELINE</span>
    </div>

    <h2 className="text-5xl font-black text-gray-900 leading-tight drop-shadow-sm">Pipeline<br/>Inteligente.</h2>
    <p className="text-gray-800 font-medium text-lg bg-white/50 border border-white/40 px-5 py-3 rounded-xl backdrop-blur-xl w-fit shadow-lg shadow-black/5">Sin emails. Sin esperas. Cada conexión es un evento real.</p>
    
    <div className="flex flex-col gap-4 mt-2">
      {FW_DATA.pipelineNodes.map((s, i) => (
        <PipelineNode key={s.title} s={s} i={i} />
      ))}
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   PANEL — EMPRESAS
───────────────────────────────────────────── */
const CompaniesPanel = () => (
  <motion.div
    {...FW_ANIM.panelSlide}
    style={{ width: '480px', maxWidth: '88vw', pointerEvents: 'auto' }}
    className="flex flex-col gap-6 select-none relative"
  >
    <div className="absolute -inset-32 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200/50 backdrop-blur-md w-fit shadow-sm">
      <Building2 className="w-3.5 h-3.5 text-indigo-700" />
      <span className="text-xs font-bold text-indigo-800 tracking-widest uppercase">CLUSTER · EMPRESA</span>
    </div>
    
    <h2 className="text-5xl font-black text-gray-900 drop-shadow-sm leading-tight">Escala tu<br/>capacidad<br/>operativa.</h2>
    <p className="text-gray-800 font-medium text-lg bg-white/50 border border-white/40 px-5 py-3 rounded-xl backdrop-blur-xl shadow-lg shadow-black/5">Publica un proyecto y el pipeline conecta tu empresa con el talento ideal en minutos.</p>
    
    <div className="grid grid-cols-2 gap-4 mt-2">
      {FW_DATA.companyMetrics.map(({val, label}) => (
        <motion.div whileHover={{ y: -5 }} key={label} className="p-6 rounded-3xl bg-white/70 border border-white/60 shadow-xl shadow-black/5 backdrop-blur-xl flex flex-col justify-center items-center text-center">
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 mb-2">{val}</div>
          <div className="text-sm font-bold text-gray-700 leading-tight">{label}</div>
        </motion.div>
      ))}
    </div>
    
    <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl relative overflow-hidden mt-2">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
      <div className="relative z-10 flex items-start gap-4">
        <ShieldCheck className="w-8 h-8 text-indigo-400 shrink-0" />
        <div>
          <div className="text-xs font-bold text-indigo-400 mb-1 tracking-wider uppercase">SISTEMA ACTIVO</div>
          <div className="text-white font-black text-xl">Enterprise Ready</div>
          <div className="text-gray-400 font-medium text-sm mt-1">Acuerdos inteligentes · Pagos en Escrow · Auditoría 24/7</div>
        </div>
      </div>
    </motion.div>

    <motion.button 
      {...FW_ANIM.hoverButton}
      onClick={() => scrollTo('auth')}
      className="mt-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all w-fit flex items-center gap-2"
    >
      Publicar proyecto <ArrowRight className="w-5 h-5" />
    </motion.button>
  </motion.div>
);

/* ─────────────────────────────────────────────
   PANEL — TALENTO / FREELANCERS
───────────────────────────────────────────── */
const FreelancersPanel = () => (
  <motion.div
    {...FW_ANIM.panelSlide}
    style={{ width: '480px', maxWidth: '88vw', pointerEvents: 'auto' }}
    className="flex flex-col gap-6 select-none relative"
  >
    <div className="absolute -inset-32 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/50 backdrop-blur-md w-fit shadow-sm">
      <TerminalSquare className="w-3.5 h-3.5 text-emerald-700" />
      <span className="text-xs font-bold text-emerald-800 tracking-widest uppercase">CLUSTER · TALENTO</span>
    </div>
    
    <h2 className="text-5xl font-black text-gray-900 drop-shadow-sm leading-tight">Construye<br/>reputación<br/>con código real.</h2>
    <p className="text-gray-800 font-medium text-lg leading-relaxed bg-white/50 border border-white/40 px-5 py-3 rounded-xl backdrop-blur-xl shadow-lg shadow-black/5">
      Tu nodo crece con cada proyecto completado. Más conexiones, más visibilidad.
    </p>
    
    <ul className="space-y-4 mt-2">
      {FW_DATA.freelanceBenefits.map((item, i) => (
        <motion.li 
          key={item} 
          initial={FW_ANIM.itemSlideUp.initial} 
          animate={FW_ANIM.itemSlideUp.animate} 
          transition={{ delay: i * 0.1 + 0.2 }}
          className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl backdrop-blur-xl shadow-lg shadow-black/5 border border-white/60"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 shadow-inner">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-gray-900 font-bold text-base">{item}</span>
        </motion.li>
      ))}
    </ul>
    
    <motion.button 
      {...FW_ANIM.hoverButton}
      onClick={() => scrollTo('auth')}
      className="mt-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-2xl shadow-emerald-600/30 transition-all w-fit flex items-center gap-2"
    >
      Unirme a la red <ArrowRight className="w-5 h-5" />
    </motion.button>
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
      {...FW_ANIM.authSpring}
      style={{ width: '440px', maxWidth: '92vw', pointerEvents: 'auto' }}
      className="select-none relative"
    >
      {/* Premium Glow Behind the Auth Box */}
      <div className="absolute -inset-10 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="bg-gray-900/80 backdrop-blur-3xl border border-white/20 shadow-2xl shadow-black/80 rounded-[2rem] p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Acceso a Prowork</h2>
            <p className="text-base text-gray-400">Únete a la red de talento y empresas de élite.</p>
          </div>

          <div className="flex p-1.5 bg-gray-950/50 border border-white/10 rounded-2xl mb-8 relative shadow-inner">
            <div className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-gray-800 border border-white/10 rounded-xl shadow-lg transition-transform duration-300 ease-out ${mode === 'register' ? 'translate-x-[calc(100%+6px)]' : 'translate-x-0'}`} />
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${mode === m ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                {m === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form key="login"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onSubmit={e => e.preventDefault()}
                className="flex flex-col gap-4"
              >
                <input type="email" placeholder="Correo electrónico" autoComplete="email"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-950/50 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-base transition-all shadow-inner" />
                <input type="password" placeholder="Contraseña" autoComplete="current-password"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-950/50 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-base transition-all shadow-inner" />
                <motion.button {...FW_ANIM.hoverButton} type="submit" 
                  className="w-full mt-2 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-base shadow-xl shadow-indigo-600/20 transition-colors">
                  Entrar al sistema
                </motion.button>
              </motion.form>
            ) : (
              <motion.form key="register"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onSubmit={e => e.preventDefault()}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-3 mb-2">
                  {(['empresa', 'freelancer'] as const).map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={`py-4 rounded-2xl border text-sm font-bold transition-all flex flex-col items-center gap-2 ${role === r
                          ? r === 'empresa' ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-inner' : 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-inner'
                          : 'border-white/10 bg-gray-950/30 text-gray-500 hover:border-white/30 hover:text-gray-300'
                        }`}>
                      {r === 'empresa' ? <Building2 className="w-5 h-5"/> : <TerminalSquare className="w-5 h-5"/>}
                      {r === 'empresa' ? 'Empresa' : 'Freelancer'}
                    </button>
                  ))}
                </div>
                <input type="text" placeholder="Nombre completo"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-950/50 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none text-base transition-all shadow-inner" />
                <input type="email" placeholder="Correo electrónico" autoComplete="email"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-950/50 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none text-base transition-all shadow-inner" />
                <input type="password" placeholder="Contraseña" autoComplete="new-password"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-950/50 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none text-base transition-all shadow-inner" />
                <motion.button {...FW_ANIM.hoverButton} type="submit" disabled={!role}
                  className="w-full mt-2 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold text-base shadow-xl shadow-indigo-600/20 transition-all">
                  Crear cuenta
                </motion.button>
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
