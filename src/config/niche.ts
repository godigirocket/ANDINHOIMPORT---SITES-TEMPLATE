/**
 * CONFIGURAÇÃO DE NICHO
 * 
 * ANTES de entregar pro cliente, configure o nicho aqui.
 * O sistema inteiro se adapta automaticamente:
 * - Campos de produto
 * - Tags/badges
 * - Unidades de medida
 * - Chatbot
 * - Textos do site
 */

export type NicheType = 
  | 'electronics'      // Eletrônicos (celular, notebook, etc)
  | 'fashion'          // Moda (roupas, calçados, acessórios)
  | 'food'             // Alimentos (comida, bebida, etc)
  | 'beauty'           // Beleza (cosméticos, perfumes, skincare)
  | 'fitness'          // Fitness (suplementos, roupas fitness)
  | 'home'             // Casa (decoração, móveis, utensílios)
  | 'pets'             // Pets (ração, brinquedos, acessórios)
  | 'automotive'       // Automotivo (peças, acessórios)
  | 'jewelry'          // Joias (semijoias, relógios)
  | 'books';           // Livros e papelaria

interface NicheConfig {
  type: NicheType;
  productUnit: string;
  productFields: {
    size: boolean;          // Tamanho (roupas, calçados)
    color: boolean;         // Cor (roupas, eletrônicos)
    weight: boolean;        // Peso (alimentos, suplementos)
    volume: boolean;        // Volume (bebidas, líquidos)
    flavor: boolean;        // Sabor (alimentos, suplementos)
    brand: boolean;         // Marca
    model: boolean;         // Modelo (eletrônicos)
    expiration: boolean;    // Validade (alimentos)
    ingredients: boolean;   // Ingredientes (alimentos)
    nutritionalInfo: boolean; // Info nutricional (alimentos)
  };
  badges: string[];         // Badges disponíveis
  categories: string[];     // Categorias padrão
}

// ⚙️ CONFIGURAÇÃO ATUAL DO NICHO
// Mude aqui antes de entregar pro cliente!
export const CURRENT_NICHE: NicheType = 'electronics';

// 📋 CONFIGURAÇÕES POR NICHO
export const NICHE_CONFIGS: Record<NicheType, NicheConfig> = {
  electronics: {
    type: 'electronics',
    productUnit: 'unidade',
    productFields: {
      size: false,
      color: true,
      weight: false,
      volume: false,
      flavor: false,
      brand: true,
      model: true,
      expiration: false,
      ingredients: false,
      nutritionalInfo: false,
    },
    badges: [
      'Lançamento',
      'Mais Vendido',
      'Promoção',
      'Frete Grátis',
      'Garantia Estendida',
      'Original',
      '5G',
      'Alta Performance',
    ],
    categories: [
      'Smartphones',
      'Notebooks',
      'Tablets',
      'Smartwatches',
      'Fones de Ouvido',
      'Acessórios',
    ],
  },

  fashion: {
    type: 'fashion',
    productUnit: 'peça',
    productFields: {
      size: true,
      color: true,
      weight: false,
      volume: false,
      flavor: false,
      brand: true,
      model: false,
      expiration: false,
      ingredients: false,
      nutritionalInfo: false,
    },
    badges: [
      'Nova Coleção',
      'Mais Vendido',
      'Promoção',
      'Frete Grátis',
      'Exclusivo',
      'Tendência',
      'Edição Limitada',
    ],
    categories: [
      'Vestidos',
      'Blusas',
      'Calças',
      'Saias',
      'Jaquetas',
      'Acessórios',
    ],
  },

  food: {
    type: 'food',
    productUnit: 'unidade',
    productFields: {
      size: false,
      color: false,
      weight: true,
      volume: true,
      flavor: true,
      brand: true,
      model: false,
      expiration: true,
      ingredients: true,
      nutritionalInfo: true,
    },
    badges: [
      'Orgânico',
      'Sem Glúten',
      'Vegano',
      'Zero Açúcar',
      'Importado',
      'Artesanal',
      'Promoção',
      'Frete Grátis',
    ],
    categories: [
      'Bebidas',
      'Snacks',
      'Doces',
      'Massas',
      'Molhos',
      'Temperos',
    ],
  },

  beauty: {
    type: 'beauty',
    productUnit: 'unidade',
    productFields: {
      size: false,
      color: true,
      weight: false,
      volume: true,
      flavor: false,
      brand: true,
      model: false,
      expiration: true,
      ingredients: true,
      nutritionalInfo: false,
    },
    badges: [
      'Lançamento',
      'Mais Vendido',
      'Cruelty Free',
      'Vegano',
      'Dermatologicamente Testado',
      'Importado',
      'Promoção',
    ],
    categories: [
      'Maquiagem',
      'Skincare',
      'Perfumes',
      'Cabelos',
      'Unhas',
      'Corpo',
    ],
  },

  fitness: {
    type: 'fitness',
    productUnit: 'unidade',
    productFields: {
      size: true,
      color: true,
      weight: true,
      volume: false,
      flavor: true,
      brand: true,
      model: false,
      expiration: true,
      ingredients: true,
      nutritionalInfo: true,
    },
    badges: [
      'Importado',
      'Mais Vendido',
      'Zero Açúcar',
      'Vegano',
      'Certificado',
      'Promoção',
      'Frete Grátis',
    ],
    categories: [
      'Whey Protein',
      'Creatina',
      'Pré-Treino',
      'Aminoácidos',
      'Vitaminas',
      'Acessórios',
    ],
  },

  home: {
    type: 'home',
    productUnit: 'unidade',
    productFields: {
      size: true,
      color: true,
      weight: false,
      volume: false,
      flavor: false,
      brand: true,
      model: false,
      expiration: false,
      ingredients: false,
      nutritionalInfo: false,
    },
    badges: [
      'Lançamento',
      'Mais Vendido',
      'Promoção',
      'Frete Grátis',
      'Exclusivo',
      'Artesanal',
    ],
    categories: [
      'Decoração',
      'Móveis',
      'Cozinha',
      'Banheiro',
      'Quarto',
      'Sala',
    ],
  },

  pets: {
    type: 'pets',
    productUnit: 'unidade',
    productFields: {
      size: true,
      color: true,
      weight: true,
      volume: false,
      flavor: true,
      brand: true,
      model: false,
      expiration: true,
      ingredients: true,
      nutritionalInfo: false,
    },
    badges: [
      'Premium',
      'Mais Vendido',
      'Natural',
      'Grain Free',
      'Promoção',
      'Frete Grátis',
    ],
    categories: [
      'Ração',
      'Petiscos',
      'Brinquedos',
      'Acessórios',
      'Higiene',
      'Saúde',
    ],
  },

  automotive: {
    type: 'automotive',
    productUnit: 'unidade',
    productFields: {
      size: false,
      color: true,
      weight: false,
      volume: false,
      flavor: false,
      brand: true,
      model: true,
      expiration: false,
      ingredients: false,
      nutritionalInfo: false,
    },
    badges: [
      'Original',
      'Mais Vendido',
      'Promoção',
      'Frete Grátis',
      'Garantia Estendida',
      'Importado',
    ],
    categories: [
      'Peças',
      'Acessórios',
      'Som',
      'Iluminação',
      'Pneus',
      'Ferramentas',
    ],
  },

  jewelry: {
    type: 'jewelry',
    productUnit: 'unidade',
    productFields: {
      size: true,
      color: true,
      weight: false,
      volume: false,
      flavor: false,
      brand: true,
      model: false,
      expiration: false,
      ingredients: false,
      nutritionalInfo: false,
    },
    badges: [
      'Lançamento',
      'Mais Vendido',
      'Banhado a Ouro',
      'Prata 925',
      'Exclusivo',
      'Promoção',
    ],
    categories: [
      'Colares',
      'Brincos',
      'Anéis',
      'Pulseiras',
      'Relógios',
      'Conjuntos',
    ],
  },

  books: {
    type: 'books',
    productUnit: 'unidade',
    productFields: {
      size: false,
      color: false,
      weight: false,
      volume: false,
      flavor: false,
      brand: false,
      model: false,
      expiration: false,
      ingredients: false,
      nutritionalInfo: false,
    },
    badges: [
      'Lançamento',
      'Mais Vendido',
      'Best Seller',
      'Promoção',
      'Frete Grátis',
      'Capa Dura',
    ],
    categories: [
      'Ficção',
      'Não-Ficção',
      'Autoajuda',
      'Negócios',
      'Infantil',
      'Didáticos',
    ],
  },
};

// 🎯 Função para pegar a configuração atual
export function getNicheConfig(): NicheConfig {
  return NICHE_CONFIGS[CURRENT_NICHE];
}
