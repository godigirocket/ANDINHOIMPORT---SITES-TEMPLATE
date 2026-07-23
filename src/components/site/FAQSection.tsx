import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { clientConfig } from '@/config/client';

const FAQ_ITEMS = [
  { q: 'Onde fica a Andinho Import?', a: `Atendemos em ${clientConfig.company.location.city}, ${clientConfig.company.location.state}. Consulte disponibilidade e opções de entrega pelo WhatsApp.` },
  { q: 'Os aparelhos possuem garantia?', a: 'Sim. Todos os produtos novos possuem garantia de 12 meses. Seminovos possuem garantia de 90 dias.' },
  { q: 'É possível parcelar em até 18x?', a: 'Sim. Parcelamos em até 18x sem juros no cartão de crédito de qualquer banco.' },
  { q: 'Existem produtos à pronta entrega?', a: 'Sim. A maioria dos modelos está disponível para entrega imediata. Consulte disponibilidade pelo WhatsApp.' },
  { q: 'A loja trabalha com Apple?', a: 'Sim. Trabalhamos com iPhones, iPads, Apple Watch, AirPods e acessórios Apple.' },
  { q: 'A loja trabalha com Xiaomi?', a: 'Sim. Temos smartphones Xiaomi e Redmi com garantia e pronta entrega.' },
  { q: 'A loja vende smartwatches?', a: 'Sim. Apple Watch e outros smartwatches disponíveis com garantia.' },
  { q: 'Como consultar disponibilidade?', a: 'Entre em contato pelo WhatsApp. Nossa equipe responde em minutos com modelos, cores e condições disponíveis.' },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="relative py-20 md:py-28" style={{ background: 'linear-gradient(180deg, #050505 0%, #07070a 50%, #050505 100%)' }}>
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-black text-3xl md:text-4xl tracking-tight text-white mb-3">
            Perguntas <span style={{ color: '#F5B700' }}>Frequentes</span>
          </h2>
        </motion.div>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-5 rounded-xl text-left transition-all"
                style={{
                  background: openIdx === i ? 'rgba(245,183,0,0.04)' : '#0a0a0c',
                  border: `1px solid ${openIdx === i ? 'rgba(245,183,0,0.2)' : 'rgba(255,255,255,0.04)'}`,
                }}
              >
                <span className="text-sm font-semibold text-white pr-4">{item.q}</span>
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 transition-transform"
                  style={{ color: '#F5B700', transform: openIdx === i ? 'rotate(180deg)' : 'rotate(0)' }}
                />
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 pt-2 text-sm" style={{ color: '#a6a6aa' }}>
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      })}} />
    </section>
  );
}
