export interface ClientConfig {
  id: string;
  version: string;
  brand: {
    colorPrimary: string;
    colorBackground: string;
    colorForeground: string;
    fontFamily: string;
    logoUrl: string;
    logoAlt: string;
    heroBgImages: string[];
  };
  company: {
    name: string;
    nameHighlight: string;
    legalName: string;
    slogan: string;
    description: string;
    location: { city: string; state: string; country: string; address: string };
    contact: { phone: string; whatsappNumber: string; whatsappMessage: string; email: string };
    social: { instagram: string; facebook: string; tiktok: string };
  };
  features: { products: boolean; testimonials: boolean; installments: boolean; maxInstallments: number };
  initialContent: {
    hero: {
      badge: string;
      headline: string;
      headlineGold: string;
      subheadline: string;
      ctaPrimary: string;
      ctaSecondary: string;
      badges: Array<{ icon: string; label: string; sub: string }>;
    };
    features: Array<{ id: string; title: string; description: string; icon: string }>;
    cta: { headline: string; subheadline: string; buttonText: string };
    footer: { copyright: string };
  };
  admin: { credentials: { email: string; password: string; sessionDuration: number } };
  seo: { title: string; description: string; keywords: string[] };
}

export const clientConfig: ClientConfig = {
  id: 'andinho-import',
  version: '3.0.0',
  brand: {
    colorPrimary: '0 0% 100%',
    colorBackground: '0 0% 3%',
    colorForeground: '0 0% 96%',
    fontFamily: "'Inter', sans-serif",
    // Logo real da Andinho Import — URL hospedada
    logoUrl: 'https://i.ibb.co/WCSDy8H/logo.jpg',
    logoAlt: 'Andinho Import',
    // Imagens de alta qualidade
    heroBgImages: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&q=85&auto=format&fit=crop',
    ],
  },
  company: {
    name: 'ANDINHO',
    nameHighlight: 'IMPORT',
    legalName: 'Andinho Import LTDA',
    slogan: 'Importados Originais',
    description: 'Venda de celulares Apple e Xiaomi com pronta entrega, parcelamento facilitado e assistência técnica especializada.',
    location: { city: 'Estância Velha', state: 'RS', country: 'Brasil', address: 'Estância Velha, RS' },
    contact: {
      phone: '+55 (51) 99644-5863',
      whatsappNumber: '5551996445863',
      whatsappMessage: 'Olá! Vi o site da Andinho Import e quero mais informações',
      email: 'contato@andinhoimport.com.br',
    },
    social: { instagram: 'https://www.instagram.com/andinhoimport/', facebook: '', tiktok: '' },
  },
  features: { products: true, testimonials: true, installments: true, maxInstallments: 18 },
  initialContent: {
    hero: {
      badge: 'CURADORIA CRITERIOSA',
      headline: 'ANDINHO',
      headlineGold: 'IMPORT',
      subheadline: 'Cada aparelho é revisado e testado antes de chegar até você. Procedência verificada, garantia real e parcelamento em até 18x — sem letra miúda.',
      ctaPrimary: 'Garante Agora',
      ctaSecondary: 'Explorar Catálogo',
      badges: [
        { icon: 'ShieldCheck', label: '100% TESTADOS', sub: 'Antes da venda' },
        { icon: 'Zap',         label: 'PRONTA ENTREGA', sub: 'Sem espera' },
        { icon: 'Award',       label: 'ATÉ 18X', sub: 'Sem juros' },
      ],
    },
    features: [
      { id: 'f1', title: 'Bateria e tela testadas',  description: 'Antes de anunciar, checamos saúde da bateria, tela, câmeras e botões. Se algo não passa no teste, não entra no catálogo.', icon: 'ShieldCheck' },
      { id: 'f2', title: 'Procedência verificada',   description: 'Sem risco de aparelho de origem duvidosa. Você sabe exatamente o que está levando antes de fechar negócio.',                icon: 'Wrench'      },
      { id: 'f3', title: 'Parcelamento sem pegadinha', description: 'Até 18x sem juros no cartão de qualquer banco — o valor parcelado é o mesmo da vista.',                                   icon: 'CreditCard'  },
      { id: 'f4', title: 'Entrega rastreada',        description: 'Pronta entrega para a maioria dos modelos, com envio e rastreio para todo o Brasil.',                                       icon: 'Truck'       },
      { id: 'f5', title: 'Depoimentos reais',        description: 'Avaliações verdadeiras de clientes que já compraram — veja na seção de depoimentos, sem números inflados.',                 icon: 'Star'        },
      { id: 'f6', title: 'Atendimento direto',       description: 'Respondemos em minutos pelo WhatsApp. Sem robô de atendimento — quem responde é gente que conhece o estoque.',              icon: 'Clock'       },
    ],
    cta: {
      headline: 'Quer garantir seu próximo celular com segurança?',
      subheadline: 'Atendimento rápido, preços justos e produtos originais',
      buttonText: 'Falar com a Andinho Import no WhatsApp',
    },
    footer: { copyright: '© 2025 Andinho Import · Todos os direitos reservados' },
  },
  admin: { credentials: { email: 'admin@andinhoimport.com', password: 'admin123', sessionDuration: 24 } },
  seo: {
    title: 'Andinho Import — Celulares Importados com Preço Justo',
    description: 'Compre seu iPhone ou Xiaomi com garantia, parcelamento em até 18x e entrega rápida. Produtos originais e testados.',
    keywords: ['iphone', 'xiaomi', 'celular importado', 'smartphone', 'andinho import', 'estância velha'],
  },
};
