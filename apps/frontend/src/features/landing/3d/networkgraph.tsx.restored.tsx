"import { useMemo, useState } from 'react';
import { Html } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { useActiveSection } from '../hooks/useActiveSection';

/* ─────────────────────────────────────────────
   PANELES HTML — Contenido que emerge flotando
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
      {[['bg-indigo-400','Empresa'],['bg-emerald-400','Talento'],['bg-amber-400','Proyecto'],['bg-cyan-400','IA']].map(([c,l]) 
<truncated 14694 bytes>