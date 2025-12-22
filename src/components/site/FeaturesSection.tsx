import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Wrench, Truck, Award, Clock, LucideIcon } from 'lucide-react';
import { useContentStore } from '@/lib/stores/contentStore';

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  CreditCard,
  Wrench,
  Truck,
  Award,
  Clock,
};

export function FeaturesSection() {
  const { content } = useContentStore();
  const { features } = content;

  return (
    <section id="features" className="py-20 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container relative mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Por que escolher a{' '}
            <span className="gradient-text">Andinho Import?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trabalhamos com transparência e qualidade para garantir sua satisfação
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || ShieldCheck;
            const isLarge = index === 0 || index === 3;
            
            return (
              <motion.div
                key={feature.id}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group ${isLarge ? 'md:col-span-2' : ''}`}
              >
                <div className={`glass-card p-8 h-full hover-lift ${
                  isLarge ? 'bg-gradient-to-br from-primary/10 to-transparent' : ''
                }`}>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    index % 2 === 0 
                      ? 'gradient-primary shadow-glow' 
                      : 'gradient-accent shadow-accent-glow'
                  }`}>
                    <Icon className="w-7 h-7 text-foreground" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
