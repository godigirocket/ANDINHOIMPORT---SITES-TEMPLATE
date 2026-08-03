import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, MessageCircle, Send, X } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { clientConfig } from '@/config/client';
import { useChatbotStore } from '@/lib/stores/chatbotStore';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
}

const quickReplies = [
  { label: 'iPhone', text: 'Quero ver iPhones disponiveis' },
  { label: 'Xiaomi', text: 'Quero ver Xiaomi disponiveis' },
  { label: 'Pagamento', text: 'Quais sao as formas de pagamento?' },
  { label: 'WhatsApp', text: 'Falar no WhatsApp', whatsapp: true },
];

export function SimpleChatbot() {
  const { config } = useChatbotStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Oi. Me diga o que voce procura e eu te levo direto ao atendimento certo.',
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isOpen]);

  if (!config.enabled) return null;

  const waUrl = (text: string) =>
    `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;

  const openWhatsApp = (text = clientConfig.company.contact.whatsappMessage) => {
    window.open(waUrl(text), '_blank', 'noopener,noreferrer');
  };

  const addUser = (text: string) => {
    setMessages(prev => [...prev, { id: `${Date.now()}-u`, sender: 'user', text }]);
  };

  const addBot = (text: string) => {
    window.setTimeout(() => {
      setMessages(prev => [...prev, { id: `${Date.now()}-b`, sender: 'bot', text }]);
    }, 260);
  };

  const answer = (text: string) => {
    const normalized = text.toLowerCase();
    addUser(text);

    if (normalized.includes('iphone')) {
      addBot('Temos modelos iPhone novos, com nota fiscal, garantia e parcelamento em ate 18x. Posso te passar as opcoes no WhatsApp.');
      return;
    }

    if (normalized.includes('xiaomi')) {
      addBot('Xiaomi novo e original, com consulta de estoque por modelo e cor. Chamo voce no WhatsApp para confirmar disponibilidade.');
      return;
    }

    if (normalized.includes('pagamento') || normalized.includes('parcela') || normalized.includes('cartao')) {
      addBot('Cartao em ate 18x sem juros e Pix com condicao especial. O valor final depende do modelo disponivel.');
      return;
    }

    if (normalized.includes('whatsapp')) {
      openWhatsApp('Ola! Vim pelo site da Andinho Import e quero consultar o estoque.');
      addBot('Abrindo o WhatsApp para voce falar direto com a equipe.');
      return;
    }

    addBot('Perfeito. Para te responder com preco e estoque atualizado, o melhor caminho e falar direto no WhatsApp.');
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    answer(text);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full shadow-2xl sm:bottom-5 sm:right-5 sm:h-11 sm:w-11"
            style={{
              background: 'linear-gradient(135deg, hsl(43,96%,52%), hsl(38,92%,45%))',
              boxShadow: '0 14px 34px rgba(245,183,0,0.28)',
            }}
            aria-label="Abrir atendimento"
          >
            <MessageCircle className="h-4 w-4 text-black" />
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-1 ring-black" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-4 right-3 z-50 flex h-[min(440px,calc(100svh-104px))] w-[min(312px,calc(100vw-24px))] flex-col overflow-hidden rounded-xl shadow-2xl sm:bottom-5 sm:right-5"
            style={{
              background: 'rgba(14,14,17,0.96)',
              border: '1px solid rgba(245,183,0,0.16)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-3">
              <div className="flex items-center gap-2.5">
                <BrandLogo size={30} />
                <div>
                  <p className="text-sm font-black text-white">Andinho Import</p>
                  <p className="text-[11px] font-medium text-white/46">Atendimento humano</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Fechar atendimento"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-2.5 overflow-y-auto px-3.5 py-3">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[82%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed"
                    style={
                      message.sender === 'user'
                        ? { background: 'hsl(43,96%,52%)', color: '#08080a' }
                        : { background: 'rgba(255,255,255,0.055)', color: 'rgba(255,255,255,0.82)', border: '1px solid rgba(255,255,255,0.06)' }
                    }
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="mb-2 grid grid-cols-2 gap-1.5">
                {quickReplies.map(reply => (
                  <button
                    key={reply.label}
                    onClick={() => reply.whatsapp ? openWhatsApp('Ola! Vim pelo site da Andinho Import e quero consultar o estoque.') : answer(reply.text)}
                    className="flex items-center justify-between rounded-lg border border-white/10 px-2.5 py-2 text-left text-[11px] font-bold text-white/76 transition-colors hover:border-primary/40 hover:text-white"
                  >
                    {reply.label}
                    <ChevronRight className="h-3.5 w-3.5 text-primary" />
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Digite aqui..."
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-primary/45"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="rounded-lg px-3 transition-opacity disabled:opacity-40"
                  style={{ background: 'hsl(43,96%,52%)' }}
                  aria-label="Enviar mensagem"
                >
                  <Send className="h-4 w-4 text-black" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
