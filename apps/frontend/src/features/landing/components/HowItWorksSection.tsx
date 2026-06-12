import { motion } from 'framer-motion';
import { SectionContainer } from './SectionContainer';
import { Briefcase, ShieldCheck, Rocket } from 'lucide-react';

const steps = [
  {
    icon: <Briefcase className="w-6 h-6 text-indigo-400" />,
    color: 'indigo',
    title: 'La Empresa Publica',
    description: 'Describe el reto, el presupuesto y los objetivos. El nodo empresa se activa en el grafo y emite una señal al núcleo de IA.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
    color: 'cyan',
    title: 'Prowork IA Valida',
    description: 'El núcleo central procesa candidatos en tiempo real. Solo los nodos de talento con fit ≥ 90% reciben el flujo de datos del proyecto.',
  },
  {
    icon: <Rocket className="w-6 h-6 text-emerald-400" />,
    color: 'emerald',
    title: 'El Talento Ejecuta',
    description: 'La conexión empresa-talento se establece. El nodo de proyecto se activa en ámbar y el trabajo comienza con acuerdos inteligentes.',
  },
];

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-500/10 border-indigo-500/30',
  cyan:   'bg-cyan-500/10 border-cyan-500/30',
  emerald:'bg-emerald-500/10 border-emerald-500/30',
};

export const HowItWorksSection = () => {
  return (
    <SectionContainer id="how-it-works">
      <div className="flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-3"
        >
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Pipeline inteligente.
          </h2>
          <p className="text-lg text-gray-400 max-w-lg">
            Cada conexión en el grafo representa un evento real del proceso. Sin emails, sin esperas, sin ruido.
          </p>
        </motion.div>

        <div className="flex flex-col gap-5">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`flex gap-5 items-start p-5 rounded-2xl border ${colorMap[step.color]} backdrop-blur-sm`}
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-900 border border-white/10 flex items-center justify-center">
                {step.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
