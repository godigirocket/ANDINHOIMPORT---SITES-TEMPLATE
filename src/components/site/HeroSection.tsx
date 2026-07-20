import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronDown, Shield, CreditCard, Package, Truck } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';

export function HeroSection() {
  const { content } = useContentStore();

  const whatsappUrl = content.whatsapp_link || `https://wa.me/${clientConfig.company.contact.whatsappNumber}`;
  const msg = encodeURIComponent(clientConfig.company.contact.whatsappMessage);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: '#050505' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(245,183,0,0.05) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full py-24 md:py-0">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-screen">
          
          {/* Texto */}
          <div className="order-2 lg:order-1">
            <motion.p
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: '#F5B700' }}
            >
              Tecnologia, procedência e confiança
            </motion.p>

            <motion.h1
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-black tracking-tight mb-5 leading-[0.9]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              <span className="text-white block">Seu próximo</span>
              <span style={{ color: '#F5B700' }} className="block">smartphone</span>
              <span className="text-white block">está aqui.</span>
            </motion.h1>

            <motion.p
              initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base max-w-md mb-8 leading-relaxed"
              style={{ color: '#a6a6aa' }}
            >
              Apple, Xiaomi, smartwatches e acessórios com garantia, 
              parcelamento e atendimento direto em {clientConfig.company.location.city}.
            </motion.p>

            <motion.div
              initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 rounded-full text-sm font-bold transition-all"
                style={{ background: 'linear-gradient(135deg, #F5B700, #d4a000)', color: '#050505', boxShadow: '0 8px 24px rgba(245,183,0,0.25)' }}
              >
                Ver Produtos
              </button>
              <a href={`${whatsappUrl}?text=${msg}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold"
                style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#f7f7f7' }}
              >
                <MessageCircle className="w-4 h-4" /> Chamar no WhatsApp
              </a>
            </motion.div>

            <motion.div
              initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: CreditCard, label: 'Até 18x' },
                { icon: Shield, label: 'Garantia' },
                { icon: Package, label: 'Original' },
                { icon: Truck, label: 'Pronta entrega' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" style={{ color: '#F5B700' }} />
                  <span className="text-[11px] font-medium" style={{ color: '#888' }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Imagem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 flex items-center justify-center"
          >
            <img
              src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-black-titanium-select?wid=800&hei=800&fmt=jpeg&qlt=90"
              alt="Smartphone premium — Andinho Import"
              className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
              loading="eager"
            />
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.3)' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
