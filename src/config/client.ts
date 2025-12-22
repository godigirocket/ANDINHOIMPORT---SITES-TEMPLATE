// Configuração central do cliente - altere apenas este arquivo para personalizar
export interface ClientConfig {
  id: string;
  version: string;
  
  company: {
    name: string;
    legalName: string;
    slogan: string;
    description: string;
    location: {
      city: string;
      state: string;
      country: string;
      address: string;
    };
    contact: {
      phone: string;
      email: string;
      whatsapp: string;
      whatsappMessage: string;
    };
    social: {
      instagram: string;
      facebook: string;
      tiktok: string;
    };
    logo: {
      url: string;
      alt: string;
    };
  };

  features: {
    products: boolean;
    socialProof: boolean;
    installments: boolean;
    maxInstallments: number;
  };

  initialContent: {
    hero: {
      badge: string;
      headline: string;
      subheadline: string;
      ctaPrimary: { text: string; icon: string };
      ctaSecondary: { text: string; icon: string };
      socialProof: string[];
    };
    features: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
    products: {
      title: string;
      emptyState: {
        title: string;
        description: string;
        cta: string;
      };
    };
    socialProof: {
      title: string;
      instagramPosts: string[];
    };
    cta: {
      headline: string;
      subheadline: string;
      buttonText: string;
    };
    footer: {
      copyright: string;
      developerNote: string;
    };
  };

  admin: {
    credentials: {
      email: string;
      password: string;
      sessionDuration: number;
    };
  };

  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const clientConfig: ClientConfig = {
  id: 'andinho-import',
  version: '1.0.0',
  
  company: {
    name: 'Andinho Import',
    legalName: 'Andinho Import LTDA',
    slogan: 'Importados com confiança e preço justo',
    description: 'Venda de celulares Apple e Xiaomi com pronta entrega, parcelamento facilitado e assistência técnica especializada',
    location: {
      city: 'Estância Velha',
      state: 'RS',
      country: 'Brasil',
      address: 'Rua Principal, 123'
    },
    contact: {
      phone: '+55 (51) 99644-5863',
      email: 'contato@andinhoimport.com.br',
      whatsapp: 'https://wa.me/5551996445863',
      whatsappMessage: 'Olá! Vi o site da Andinho Import e quero mais informações'
    },
    social: {
      instagram: 'https://www.instagram.com/andinhoimport/',
      facebook: '',
      tiktok: ''
    },
    logo: {
      url: 'https://instagram.fpoa11-2.fna.fbcdn.net/v/t51.2885-19/365172094_249113061394532_4147121282165074013_n.jpg',
      alt: 'Andinho Import Logo'
    }
  },

  features: {
    products: true,
    socialProof: true,
    installments: true,
    maxInstallments: 18
  },

  initialContent: {
    hero: {
      badge: '⚡ Importados com pronta entrega',
      headline: 'Seu iPhone Importado com Preço Justo',
      subheadline: 'Apple, Xiaomi e Smartwatches com garantia, parcelamento em até 18x e entrega rápida para toda região Sul',
      ctaPrimary: { text: 'Comprar pelo WhatsApp', icon: 'MessageCircle' },
      ctaSecondary: { text: 'Ver Produtos', icon: 'ArrowDown' },
      socialProof: [
        'Mais de 2.500 seguidores no Instagram',
        'Entrega em toda região Sul',
        'Garantia em todos os produtos'
      ]
    },
    features: [
      {
        id: 'feature-1',
        title: 'Produtos Originais',
        description: 'Trabalhamos apenas com aparelhos originais e testados rigorosamente antes da venda',
        icon: 'ShieldCheck'
      },
      {
        id: 'feature-2',
        title: 'Parcelamento Facilitado',
        description: 'Parcele em até 18x sem juros no cartão de crédito de qualquer banco',
        icon: 'CreditCard'
      },
      {
        id: 'feature-3',
        title: 'Assistência Técnica',
        description: 'Suporte especializado pós-venda e garantia estendida para sua tranquilidade',
        icon: 'Wrench'
      },
      {
        id: 'feature-4',
        title: 'Entrega Rápida',
        description: 'Pronta entrega para a maioria dos modelos com envio para todo Brasil',
        icon: 'Truck'
      }
    ],
    products: {
      title: 'Modelos Disponíveis',
      emptyState: {
        title: 'Nenhum produto cadastrado ainda',
        description: 'Comece adicionando seu primeiro produto no painel administrativo',
        cta: 'Adicionar Produto'
      }
    },
    socialProof: {
      title: 'Clientes Reais, Resultados Reais',
      instagramPosts: [
        'https://www.instagram.com/p/DObPY6cjlKo/',
        'https://www.instagram.com/p/C1pzytvPSdT/'
      ]
    },
    cta: {
      headline: 'Quer garantir seu próximo celular com segurança?',
      subheadline: 'Atendimento rápido, preços justos e produtos originais',
      buttonText: 'Falar com a Andinho Import no WhatsApp'
    },
    footer: {
      copyright: '© 2024 Andinho Import. Todos os direitos reservados.',
      developerNote: 'Template SaaS White-Label'
    }
  },

  admin: {
    credentials: {
      email: 'admin@andinhoimport.com',
      password: 'admin123',
      sessionDuration: 24
    }
  },

  seo: {
    title: 'Andinho Import - Celulares Importados com Preço Justo',
    description: 'Compre seu iPhone ou Xiaomi com garantia, parcelamento em até 18x e entrega rápida. Produtos originais e testados.',
    keywords: ['iphone', 'xiaomi', 'celular importado', 'smartphone', 'andinho import', 'estância velha']
  }
};
