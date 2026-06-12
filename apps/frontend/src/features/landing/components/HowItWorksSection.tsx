import { motion } from 'framer-motion';
import { SectionContainer } from './SectionContainer';
import { Briefcase, ShieldCheck, Rocket } from 'lucide-react';

const steps = [
  {
    icon: <Briefcase className="w-6 h-6 text-blue-400" />,
    title: 'La Empresa Pública',
    description: 'Describe el reto, el presupuesto y los objetivos. Sin filtros innecesarios, directo al grano.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-violet-400" />,
    title: 'Prowork Cura',
    description: 'Nuestro sistema de IA y validación humana selecciona solo a los candidatos que realmente pueden ejecutar la idea.',
  },
  {
    icon: <Rocket className="w-6 h-6 text-indigo-400" />,
    title: 'El Talento Ejecuta',
    description: 'El freelancer seleccionado recibe luz verde. Se firma el acuerdo inteligente y comienza el desarrollo.',
  },
];

export const HowItWorksSection = () => {
  return (
    <SectionContainer id="how-it-works">
      <div className="flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 text-center md:text-left"
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-white">
            Inteligencia operativa.
          </h2>
          <p className="text-lg text-gray-400 max-w-lg mx-auto md:mx-0">
            Un pipeline diseñado para maximizar la eficiencia y eliminar el ruido del reclutamiento tradicional.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 relative">
          <div className="absolute left-[27px] top-10 bottom-10 w-px bg-gradient-to-b from-blue-500/50 via-violet-500/50 to-transparent z-0 hidden md:block"></div>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex gap-6 items-start relative z-10"
            >
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gray-900 border border-gray-800 shadow-[0_0_15px_rgba(59,130,246,0.15)] flex items-center justify-center">
                {step.icon}
              </div>
              <div className="pt-3">
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
