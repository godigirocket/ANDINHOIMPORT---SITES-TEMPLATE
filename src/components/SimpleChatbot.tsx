import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clientConfig } from '@/config/client';
import { useChatbotStore } from '@/lib/stores/chatbotStore';
import { useProductStore } from '@/lib/stores/productStore';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  options?: string[];
}

/**
 * CHATBOT AUTOMÁTICO SIMPLES
 * 
 * Responde automaticamente perguntas comuns
 * Coleta nome, email e telefone
 * Envia lead direto pro WhatsApp
 * 
 * SEM CONFIGURAÇÃO EXTERNA!
 */

export function SimpleChatbot() {
  const { config } = useChatbotStore();
  const { products } = useProductStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [step, setStep] = useState<'greeting' | 'name' | 'email' | 'phone' | 'question' | 'done'>('greeting');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string, options?: string[]) => {
    const msg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      options
    };
    setMessages(prev => [...prev, msg]);
  };

  const addUserMessage = (text: string) => {
    const msg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, msg]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicia conversa quando abre
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = config.welcomeMessage
        .replace('{COMPANY_NAME}', `${clientConfig.company.name} ${clientConfig.company.nameHighlight}`);
      
      const initialOptions = config.questions.map(q => `${q.emoji} ${q.label}`);
      
      addBotMessage(welcomeMsg, initialOptions);
    }
  }, [isOpen]);

  // Não renderiza se desabilitado
  if (!config.enabled) return null;

  const handleOptionClick = (option: string) => {
    addUserMessage(option);
    
    setTimeout(() => {
      switch (option) {
        case '📱 Ver produtos':
          addBotMessage(
            '🔥 PRODUTOS MAIS VENDIDOS:\n\n📱 iPhone 15 Pro Max - Lançamento!\n⌚ Apple Watch Ultra 2 - Novidade\n🎧 AirPods Pro 2 - Som perfeito\n📱 Xiaomi 14 Ultra - Câmera top\n💻 MacBook Pro M3 - Performance\n\n✨ Todos ORIGINAIS com GARANTIA!\n💰 Parcelamento SEM JUROS!\n\nQual te interessa?',
            ['iPhone 15', 'Apple Watch', 'AirPods', 'Xiaomi', 'MacBook', '💬 Falar no WhatsApp']
          );
          break;
        
        case '💳 Formas de pagamento':
          addBotMessage(
            '💰 CONDIÇÕES ESPECIAIS:\n\n💳 Cartão: até 18x SEM JUROS\n📱 Pix: 5% de DESCONTO à vista\n💵 Boleto: 3% de desconto\n\n🔒 Pagamento 100% SEGURO\n✅ Aprovação INSTANTÂNEA\n\nQuer fazer um pedido agora?',
            ['Sim, quero comprar! 🛒', 'Ver produtos', 'Tenho dúvidas']
          );
          break;
        
        case '🎁 Promoções':
          addBotMessage(
            '🔥 PROMOÇÕES IMPERDÍVEIS:\n\n⚡ FRETE GRÁTIS acima de R$ 500\n🎁 BRINDE em compras acima de R$ 1.000\n💰 5% OFF no Pix (SEMPRE!)\n🎯 Cupom PRIMEIRA10 = 10% OFF\n\n⏰ Aproveite AGORA!\nEstoque LIMITADO!\n\nQuer garantir o seu?',
            ['Sim! Quero aproveitar 🔥', 'Ver produtos', 'Qual o melhor iPhone?']
          );
          break;
        
        case '📦 Rastrear pedido':
          addBotMessage(
            '📦 Rastreamento de Pedido\n\nPara rastrear seu pedido, preciso do número do pedido ou CPF.\n\nOu posso te passar direto pro WhatsApp para consultar com nossa equipe!',
            ['💬 Falar no WhatsApp', 'Ver produtos']
          );
          break;
        
        case '💬 Falar com atendente':
        case '💬 Falar no WhatsApp':
          if (!userName) {
            setStep('name');
            addBotMessage('Perfeito! Vou te conectar com um atendente AGORA! 🚀\n\nQual é o seu nome?');
          } else {
            sendToWhatsApp();
          }
          break;

        case 'iPhone 15':
        case 'Apple Watch':
        case 'AirPods':
        case 'Xiaomi':
        case 'MacBook':
          addBotMessage(
            `🔥 EXCELENTE ESCOLHA!\n\n${option} é um dos nossos MAIS VENDIDOS!\n\n✅ Produto ORIGINAL\n✅ Garantia de 12 meses\n✅ Nota fiscal\n✅ Entrega rápida\n\n💰 Parcelamos em até 18x SEM JUROS!\n📱 Ou 5% OFF no Pix!\n\nQuer que eu te passe pro WhatsApp para ver os modelos disponíveis e FECHAR NEGÓCIO?`,
            ['SIM! Quero comprar agora! 🛒', 'Ver preços', 'Ver outros produtos']
          );
          break;

        case 'SIM! Quero comprar agora! 🛒':
        case 'Sim! Quero aproveitar 🔥':
        case 'Sim, quero comprar! 🛒':
          if (!userName) {
            setStep('name');
            addBotMessage('🎉 PERFEITO! Você está a 1 passo de garantir o seu!\n\nQual é o seu nome?');
          } else {
            sendToWhatsApp();
          }
          break;

        case 'Ver preços':
          addBotMessage(
            '💰 PREÇOS ESPECIAIS:\n\nOs valores variam de acordo com modelo e cor!\n\n🔥 MAS TEMOS CONDIÇÕES INCRÍVEIS:\n• Até 18x sem juros\n• 5% OFF no Pix\n• Frete grátis acima de R$ 500\n\nQuer que eu te passe os valores atualizados no WhatsApp?',
            ['Sim, quero! 💬', 'Ver produtos']
          );
          break;

        case 'Sim, quero! 💬':
          if (!userName) {
            setStep('name');
            addBotMessage('Ótimo! Qual é o seu nome?');
          } else {
            sendToWhatsApp();
          }
          break;

        case 'Qual o melhor iPhone?':
          addBotMessage(
            '📱 IPHONES MAIS VENDIDOS:\n\n🔥 iPhone 15 Pro Max\n→ Melhor câmera, tela maior\n→ Ideal para fotos/vídeos\n\n⚡ iPhone 15 Pro\n→ Chip A17 Pro, super rápido\n→ Melhor custo-benefício PRO\n\n💎 iPhone 15\n→ Lançamento, preço acessível\n→ Perfeito para o dia a dia\n\nTODOS com garantia e parcelamento!\n\nQual combina mais com você?',
            ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', '💬 Falar no WhatsApp']
          );
          break;

        case 'iPhone 15 Pro Max':
        case 'iPhone 15 Pro':
          addBotMessage(
            `🎯 ESCOLHA PERFEITA!\n\n${option} é SENSACIONAL!\n\n🔥 CONDIÇÕES ESPECIAIS:\n💳 18x sem juros\n📱 5% OFF no Pix\n🎁 Capinha + película de BRINDE\n\n⏰ ÚLTIMAS UNIDADES!\n\nVou te passar pro WhatsApp para GARANTIR O SEU agora!`,
            ['QUERO! Me passa pro WhatsApp 🚀', 'Ver outros produtos']
          );
          break;

        case 'QUERO! Me passa pro WhatsApp 🚀':
          if (!userName) {
            setStep('name');
            addBotMessage('🎉 SHOW! Qual é o seu nome?');
          } else {
            sendToWhatsApp();
          }
          break;

        case 'Tenho dúvidas':
          addBotMessage(
            '😊 Sem problemas! Estou aqui para ajudar!\n\nQual sua dúvida?',
            [
              'É original?',
              'Tem garantia?',
              'Quanto tempo entrega?',
              'Posso parcelar?',
              '💬 Falar no WhatsApp'
            ]
          );
          break;

        case 'É original?':
          addBotMessage(
            '✅ SIM! 100% ORIGINAL!\n\n🔒 Todos os produtos são:\n• Importados oficialmente\n• Com nota fiscal\n• Garantia do fabricante\n• Lacrados de fábrica\n\n❌ NÃO vendemos réplicas!\n\nPode confiar! 😊\n\nQuer fazer seu pedido?',
            ['Sim! Quero comprar 🛒', 'Ver produtos', '💬 Falar no WhatsApp']
          );
          break;

        case 'Tem garantia?':
          addBotMessage(
            '✅ GARANTIA COMPLETA!\n\n🛡️ 12 meses de garantia\n📱 Suporte técnico\n🔄 Troca em caso de defeito\n📄 Nota fiscal\n\nVocê está 100% PROTEGIDO!\n\nQuer garantir o seu agora?',
            ['Sim! Quero comprar 🛒', 'Ver produtos', '💬 Falar no WhatsApp']
          );
          break;

        case 'Quanto tempo entrega?':
          addBotMessage(
            '🚚 ENTREGA RÁPIDA!\n\n⚡ 3 a 7 dias úteis\n📦 Rastreamento em tempo real\n🎁 Embalagem segura\n🆓 FRETE GRÁTIS acima de R$ 500\n\nEntregamos para TODO BRASIL!\n\nQuer fazer seu pedido?',
            ['Sim! Quero comprar 🛒', 'Ver produtos', '💬 Falar no WhatsApp']
          );
          break;

        case 'Posso parcelar?':
          addBotMessage(
            '💳 CLARO! Parcelamento FACILITADO!\n\n✨ Até 18x SEM JUROS no cartão\n💰 Ou 5% OFF no Pix à vista\n\n🔒 Aprovação instantânea\n✅ Sem burocracia\n\nQuer fazer seu pedido agora?',
            ['Sim! Quero comprar 🛒', 'Ver produtos', '💬 Falar no WhatsApp']
          );
          break;

        case 'Ver outros produtos':
        case 'Ver produtos':
          addBotMessage(
            '🔥 CATÁLOGO COMPLETO:\n\n📱 Smartphones (iPhone, Xiaomi, Samsung)\n⌚ Smartwatches (Apple Watch, Galaxy Watch)\n🎧 Fones (AirPods, Galaxy Buds)\n💻 Notebooks (MacBook, Dell, Lenovo)\n📷 Câmeras e acessórios\n\nTODOS com garantia e parcelamento!\n\nO que você procura?',
            ['iPhone', 'Xiaomi', 'Apple Watch', 'AirPods', '💬 Falar no WhatsApp']
          );
          break;

        default:
          addBotMessage(
            '😊 Entendi! Vou te conectar com um atendente humano agora!\n\nEle vai te ajudar com TUDO! 🚀',
            ['💬 Ir pro WhatsApp']
          );
      }
    }, 800);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    addUserMessage(input);
    const userInput = input.toLowerCase();
    setInput('');

    setTimeout(() => {
      // Coleta de dados
      if (step === 'name') {
        setUserName(input);
        setStep('phone');
        addBotMessage(`Prazer, ${input}! 😊\n\nQual é o seu WhatsApp?`);
        return;
      }

      if (step === 'phone') {
        setUserPhone(input);
        setStep('done');
        addBotMessage(
          `Perfeito! Vou te passar pro WhatsApp agora. ✅\n\nEm instantes você será atendido!`
        );
        setTimeout(() => sendToWhatsApp(), 2000);
        return;
      }

      // Respostas automáticas
      if (userInput.includes('preço') || userInput.includes('quanto custa') || userInput.includes('valor')) {
        addBotMessage(
          '💰 PREÇOS ESPECIAIS!\n\nTemos condições INCRÍVEIS:\n\n💳 Até 18x SEM JUROS\n📱 5% OFF no Pix\n🎁 Brindes em compras acima de R$ 1.000\n\nOs valores variam por modelo!\n\nQuer que eu te passe os preços atualizados no WhatsApp?',
          ['Sim! Quero ver preços 💬', 'Ver produtos']
        );
      } else if (userInput.includes('entrega') || userInput.includes('frete') || userInput.includes('prazo')) {
        addBotMessage(
          '🚚 ENTREGA RÁPIDA para TODO BRASIL!\n\n⚡ 3 a 7 dias úteis\n📦 Rastreamento em tempo real\n🆓 FRETE GRÁTIS acima de R$ 500\n🎁 Embalagem premium\n\nQuer fazer seu pedido agora?',
          ['Sim! Quero comprar 🛒', 'Ver produtos', '💬 Falar no WhatsApp']
        );
      } else if (userInput.includes('garantia') || userInput.includes('original') || userInput.includes('verdadeiro')) {
        addBotMessage(
          '✅ 100% ORIGINAL com GARANTIA!\n\n🛡️ 12 meses de garantia\n📱 Suporte técnico completo\n🔄 Troca em caso de defeito\n📄 Nota fiscal\n🔒 Produtos lacrados de fábrica\n\n❌ NÃO vendemos réplicas!\n\nQuer garantir o seu?',
          ['Sim! Quero comprar 🛒', 'Ver produtos', '💬 Falar no WhatsApp']
        );
      } else if (userInput.includes('parcelamento') || userInput.includes('parcela') || userInput.includes('cartão')) {
        addBotMessage(
          '💳 PARCELAMENTO FACILITADO!\n\n✨ Até 18x SEM JUROS no cartão\n💰 Ou 5% OFF no Pix à vista\n💵 Boleto com 3% de desconto\n\n🔒 Aprovação INSTANTÂNEA!\n✅ Sem burocracia!\n\nQuer fazer seu pedido?',
          ['Sim! Quero comprar 🛒', 'Ver produtos', '💬 Falar no WhatsApp']
        );
      } else if (userInput.includes('iphone') || userInput.includes('apple')) {
        addBotMessage(
          '📱 IPHONES DISPONÍVEIS:\n\n🔥 iPhone 15 Pro Max - TOP!\n⚡ iPhone 15 Pro - Potente\n💎 iPhone 15 - Lançamento\n📱 iPhone 14 Pro - Custo-benefício\n\nTODOS originais com garantia!\n\n💰 Até 18x sem juros\n📱 5% OFF no Pix\n\nQual te interessa?',
          ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', '💬 Falar no WhatsApp']
        );
      } else if (userInput.includes('xiaomi') || userInput.includes('redmi')) {
        addBotMessage(
          '📱 XIAOMI - MELHOR CUSTO-BENEFÍCIO!\n\n🔥 Xiaomi 14 Ultra - Câmera TOP\n⚡ Xiaomi 13T Pro - Performance\n💎 Redmi Note 13 Pro - Barato\n\nTODOS originais com garantia!\n\n💰 Parcelamento facilitado\n📱 Entrega rápida\n\nQuer saber mais?',
          ['Sim! Me passa detalhes 💬', 'Ver outros produtos']
        );
      } else if (userInput.includes('watch') || userInput.includes('relógio') || userInput.includes('relogio')) {
        addBotMessage(
          '⌚ SMARTWATCHES DISPONÍVEIS:\n\n🔥 Apple Watch Ultra 2 - Premium\n⚡ Apple Watch Series 9 - Completo\n💎 Galaxy Watch 6 - Android\n\nTODOS originais com garantia!\n\n💰 Até 18x sem juros\n\nQual combina com você?',
          ['Apple Watch', 'Galaxy Watch', 'Ver produtos', '💬 Falar no WhatsApp']
        );
      } else if (userInput.includes('airpods') || userInput.includes('fone') || userInput.includes('headphone')) {
        addBotMessage(
          '🎧 FONES PREMIUM:\n\n🔥 AirPods Pro 2 - Cancelamento de ruído\n⚡ AirPods 3 - Som espacial\n💎 Galaxy Buds 2 Pro - Android\n\nTODOS originais com garantia!\n\n💰 Parcelamento facilitado\n\nQual você prefere?',
          ['AirPods Pro 2', 'AirPods 3', 'Ver produtos', '💬 Falar no WhatsApp']
        );
      } else if (userInput.includes('promoção') || userInput.includes('desconto') || userInput.includes('oferta')) {
        addBotMessage(
          '🔥 PROMOÇÕES IMPERDÍVEIS!\n\n⚡ FRETE GRÁTIS acima de R$ 500\n🎁 BRINDE em compras acima de R$ 1.000\n💰 5% OFF no Pix (SEMPRE!)\n🎯 Cupom PRIMEIRA10 = 10% OFF\n\n⏰ APROVEITE AGORA!\nEstoque LIMITADO!\n\nQuer garantir o seu?',
          ['SIM! Quero aproveitar 🔥', 'Ver produtos']
        );
      } else if (userInput.includes('comprar') || userInput.includes('quero') || userInput.includes('pedido')) {
        addBotMessage(
          '🎉 PERFEITO! Você está fazendo uma ÓTIMA escolha!\n\n✅ Produto original\n✅ Garantia de 12 meses\n✅ Entrega rápida\n✅ Parcelamento facilitado\n\nVou te passar pro WhatsApp para FECHAR NEGÓCIO agora! 🚀',
          ['Vamos lá! 💬']
        );
      } else {
        addBotMessage(
          '😊 Hmm, não entendi muito bem...\n\nMas posso te ajudar com:\n\n📱 Ver produtos\n💰 Preços e condições\n🚚 Entrega e frete\n✅ Garantia\n\nOu te passo direto pro WhatsApp! 💬',
          ['Ver produtos', '💬 Ir pro WhatsApp']
        );
      }
    }, 800);
  };

  const sendToWhatsApp = () => {
    const message = `🔥 *LEAD QUENTE DO SITE!*\n\n` +
      `👤 Nome: ${userName || 'Não informado'}\n` +
      `📱 Telefone: ${userPhone || 'Não informado'}\n\n` +
      `💬 Mensagem:\n"Olá! Vim pelo chatbot do site e estou interessado(a) em fazer uma compra. Pode me passar mais informações sobre os produtos e condições de pagamento?"\n\n` +
      `⏰ Atender AGORA! Cliente pronto para comprar! 🚀`;
    
    const whatsappUrl = `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    addBotMessage('✅ Abrindo WhatsApp...\n\n🎉 Você será atendido em instantes!\n\n💰 Prepare-se para CONDIÇÕES ESPECIAIS!\n\nObrigado! 😊');
  };

  return (
    <>
      {/* Botão flutuante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center group"
            style={{ 
              background: 'linear-gradient(135deg, hsl(43,96%,52%), hsl(38,92%,44%))',
              boxShadow: '0 0 30px hsla(43,96%,52%,0.5)'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[380px] h-[85vh] sm:h-[600px] max-h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ 
              background: 'hsl(220,20%,7%)',
              border: '1px solid hsla(43,96%,52%,0.2)'
            }}
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between"
              style={{ 
                background: 'linear-gradient(135deg, hsl(43,96%,52%), hsl(38,92%,44%))',
                borderBottom: '1px solid hsla(0,0%,0%,0.1)'
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="font-bold text-black text-sm">Atendimento</p>
                  <p className="text-xs text-black/70">Online agora</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-black/10 transition-colors">
                  <Minimize2 className="w-4 h-4 text-black" />
                </button>
                <button onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-black/10 transition-colors">
                  <X className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-primary text-black'
                      : 'bg-surface text-white'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    {msg.options && (
                      <div className="mt-3 space-y-2">
                        {msg.options.map(opt => (
                          <button key={opt}
                            onClick={() => handleOptionClick(opt)}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                            style={{
                              background: 'hsla(43,96%,52%,0.1)',
                              border: '1px solid hsla(43,96%,52%,0.3)',
                              color: 'hsl(43,96%,52%)'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'hsla(43,96%,52%,0.2)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'hsla(43,96%,52%,0.1)')}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border/30 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-4 py-2.5 rounded-xl disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg, hsl(43,96%,52%), hsl(38,92%,44%))' }}
                >
                  <Send className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
