import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatbotQuestion {
  id: string;
  label: string;
  emoji: string;
  response: string;
  followUpOptions?: string[];
}

export interface ChatbotConfig {
  enabled: boolean;
  welcomeMessage: string;
  productUnit: string; // 'unidade', 'kg', 'litro', 'pacote', etc
  questions: ChatbotQuestion[];
  autoResponses: {
    price: string;
    delivery: string;
    warranty: string;
    payment: string;
    promotion: string;
  };
}

interface ChatbotStore {
  config: ChatbotConfig;
  updateConfig: (config: Partial<ChatbotConfig>) => void;
  addQuestion: (question: ChatbotQuestion) => void;
  updateQuestion: (id: string, question: Partial<ChatbotQuestion>) => void;
  deleteQuestion: (id: string) => void;
  updateAutoResponse: (key: keyof ChatbotConfig['autoResponses'], value: string) => void;
}

const defaultConfig: ChatbotConfig = {
  enabled: true,
  welcomeMessage: '🔥 Olá! Bem-vindo à {COMPANY_NAME}!\n\n✨ Produtos originais com garantia\n💰 Até 18x sem juros\n🚚 Entrega rápida para todo Brasil\n\nComo posso te ajudar hoje?',
  productUnit: 'unidade',
  questions: [
    {
      id: 'q1',
      label: 'Ver produtos',
      emoji: '📱',
      response: '🔥 PRODUTOS MAIS VENDIDOS:\n\n{PRODUCT_LIST}\n\n✨ Todos ORIGINAIS com GARANTIA!\n💰 Parcelamento SEM JUROS!\n\nQual te interessa?',
      followUpOptions: ['💬 Falar no WhatsApp', 'Ver outros produtos']
    },
    {
      id: 'q2',
      label: 'Formas de pagamento',
      emoji: '💳',
      response: '💰 CONDIÇÕES ESPECIAIS:\n\n💳 Cartão: até 18x SEM JUROS\n📱 Pix: 5% de DESCONTO à vista\n💵 Boleto: 3% de desconto\n\n🔒 Pagamento 100% SEGURO\n✅ Aprovação INSTANTÂNEA\n\nQuer fazer um pedido agora?',
      followUpOptions: ['Sim, quero comprar! 🛒', 'Ver produtos', 'Tenho dúvidas']
    },
    {
      id: 'q3',
      label: 'Promoções',
      emoji: '🎁',
      response: '🔥 PROMOÇÕES IMPERDÍVEIS:\n\n⚡ FRETE GRÁTIS acima de R$ 500\n🎁 BRINDE em compras acima de R$ 1.000\n💰 5% OFF no Pix (SEMPRE!)\n🎯 Cupom PRIMEIRA10 = 10% OFF\n\n⏰ Aproveite AGORA!\nEstoque LIMITADO!\n\nQuer garantir o seu?',
      followUpOptions: ['Sim! Quero aproveitar 🔥', 'Ver produtos']
    },
    {
      id: 'q4',
      label: 'Rastrear pedido',
      emoji: '📦',
      response: '📦 Rastreamento de Pedido\n\nPara rastrear seu pedido, preciso do número do pedido ou CPF.\n\nOu posso te passar direto pro WhatsApp para consultar com nossa equipe!',
      followUpOptions: ['💬 Falar no WhatsApp', 'Ver produtos']
    },
    {
      id: 'q5',
      label: 'Falar com atendente',
      emoji: '💬',
      response: 'REDIRECT_WHATSAPP',
      followUpOptions: []
    }
  ],
  autoResponses: {
    price: '💰 PREÇOS ESPECIAIS!\n\nTemos condições INCRÍVEIS:\n\n💳 Até 18x SEM JUROS\n📱 5% OFF no Pix\n🎁 Brindes em compras acima de R$ 1.000\n\nOs valores variam por modelo!\n\nQuer que eu te passe os preços atualizados no WhatsApp?',
    delivery: '🚚 ENTREGA RÁPIDA para TODO BRASIL!\n\n⚡ 3 a 7 dias úteis\n📦 Rastreamento em tempo real\n🆓 FRETE GRÁTIS acima de R$ 500\n🎁 Embalagem premium\n\nQuer fazer seu pedido agora?',
    warranty: '✅ 100% ORIGINAL com GARANTIA!\n\n🛡️ 12 meses de garantia\n📱 Suporte técnico completo\n🔄 Troca em caso de defeito\n📄 Nota fiscal\n🔒 Produtos lacrados de fábrica\n\n❌ NÃO vendemos réplicas!\n\nQuer garantir o seu?',
    payment: '💳 PARCELAMENTO FACILITADO!\n\n✨ Até 18x SEM JUROS no cartão\n💰 Ou 5% OFF no Pix à vista\n💵 Boleto com 3% de desconto\n\n🔒 Aprovação INSTANTÂNEA!\n✅ Sem burocracia!\n\nQuer fazer seu pedido?',
    promotion: '🔥 PROMOÇÕES IMPERDÍVEIS!\n\n⚡ FRETE GRÁTIS acima de R$ 500\n🎁 BRINDE em compras acima de R$ 1.000\n💰 5% OFF no Pix (SEMPRE!)\n🎯 Cupom PRIMEIRA10 = 10% OFF\n\n⏰ APROVEITE AGORA!\nEstoque LIMITADO!\n\nQuer garantir o seu?'
  }
};

export const useChatbotStore = create<ChatbotStore>()(
  persist(
    (set) => ({
      config: defaultConfig,
      
      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig }
        })),
      
      addQuestion: (question) =>
        set((state) => ({
          config: {
            ...state.config,
            questions: [...state.config.questions, question]
          }
        })),
      
      updateQuestion: (id, updates) =>
        set((state) => ({
          config: {
            ...state.config,
            questions: state.config.questions.map(q =>
              q.id === id ? { ...q, ...updates } : q
            )
          }
        })),
      
      deleteQuestion: (id) =>
        set((state) => ({
          config: {
            ...state.config,
            questions: state.config.questions.filter(q => q.id !== id)
          }
        })),
      
      updateAutoResponse: (key, value) =>
        set((state) => ({
          config: {
            ...state.config,
            autoResponses: {
              ...state.config.autoResponses,
              [key]: value
            }
          }
        }))
    }),
    {
      name: 'chatbot-config'
    }
  )
);
