#!/usr/bin/env node
/**
 * 🚀 CLONE CLIENT — Gera um novo client.ts personalizado
 * 
 * Uso: npm run clone-client
 * 
 * Pergunta nome da loja, WhatsApp, cores, nicho
 * e gera client.ts + niche.ts prontos para deploy.
 */

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

const NICHES = {
  '1': 'electronics',
  '2': 'fashion',
  '3': 'food',
  '4': 'beauty',
  '5': 'fitness',
  '6': 'home',
  '7': 'pets',
  '8': 'automotive',
  '9': 'jewelry',
  '10': 'books',
};

const NICHE_LABELS = {
  electronics: 'Eletrônicos',
  fashion: 'Moda',
  food: 'Alimentos',
  beauty: 'Beleza',
  fitness: 'Fitness',
  home: 'Casa',
  pets: 'Pets',
  automotive: 'Automotivo',
  jewelry: 'Joias',
  books: 'Livros',
};

const COLOR_PRESETS = {
  gold: '43 96% 52%',
  purple: '262 83% 58%',
  blue: '217 91% 60%',
  green: '142 71% 45%',
  red: '0 84% 60%',
  pink: '330 81% 60%',
  orange: '25 95% 53%',
  cyan: '180 100% 50%',
};

async function main() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   🚀 CLONE CLIENT — Gerador de Loja     ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  Cria um novo site personalizado em <1m  ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('\n');

  // Nome da loja
  const storeName = await ask('📛 Nome da loja (ex: Andinho Import): ');
  if (!storeName) { console.log('❌ Nome obrigatório!'); process.exit(1); }
  
  const parts = storeName.split(' ');
  const name = parts[0].toUpperCase();
  const highlight = parts.slice(1).join(' ').toUpperCase() || '';

  // WhatsApp
  const whatsapp = await ask('📱 WhatsApp (com DDI, ex: 5551999999999): ');
  if (!whatsapp) { console.log('❌ WhatsApp obrigatório!'); process.exit(1); }

  // Email
  const email = await ask('📧 Email de contato: ');

  // Nicho
  console.log('\n🎯 Escolha o nicho:');
  Object.entries(NICHES).forEach(([key, value]) => {
    console.log(`   ${key}. ${NICHE_LABELS[value]}`);
  });
  const nicheChoice = await ask('\n   Número do nicho: ');
  const niche = NICHES[nicheChoice] || 'electronics';

  // Cor
  console.log('\n🎨 Cores disponíveis:');
  Object.entries(COLOR_PRESETS).forEach(([key, value]) => {
    console.log(`   - ${key} (${value})`);
  });
  const colorChoice = await ask('\n   Nome da cor (ou HSL customizado): ');
  const primaryColor = COLOR_PRESETS[colorChoice] || colorChoice || '43 96% 52%';

  // Logo
  const logoUrl = await ask('🖼️  URL da logo (ou Enter para padrão): ') || '';

  // Slogan
  const slogan = await ask('✨ Slogan da loja: ') || 'Qualidade e Confiança';

  // Cidade
  const city = await ask('📍 Cidade/Estado (ex: São Paulo, SP): ') || 'Brasil';

  console.log('\n⏳ Gerando configuração...\n');

  // Gerar ID
  const id = storeName.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const [cityName, stateName] = city.includes(',') 
    ? city.split(',').map(s => s.trim())
    : [city, ''];

  // Gerar client.ts
  const clientTs = generateClientTs({
    id, name, highlight, storeName, slogan,
    whatsapp, email, city: cityName, state: stateName,
    primaryColor, logoUrl, niche,
  });

  // Gerar niche.ts atualizado
  const nicheTs = generateNicheTs(niche);

  // Escrever arquivos
  const clientPath = path.join(rootDir, 'src', 'config', 'client.ts');
  const nichePath = path.join(rootDir, 'src', 'config', 'niche.ts');

  fs.writeFileSync(clientPath, clientTs, 'utf-8');
  console.log(`✅ ${clientPath}`);

  // Atualizar CURRENT_NICHE no niche.ts existente
  let nicheContent = fs.readFileSync(nichePath, 'utf-8');
  nicheContent = nicheContent.replace(
    /export const CURRENT_NICHE: NicheType = '[^']+'/,
    `export const CURRENT_NICHE: NicheType = '${niche}'`
  );
  fs.writeFileSync(nichePath, nicheContent, 'utf-8');
  console.log(`✅ ${nichePath} → Nicho: ${NICHE_LABELS[niche]}`);

  console.log('\n');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║        ✅ LOJA GERADA COM SUCESSO!       ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║  Loja: ${storeName.padEnd(32)}║`);
  console.log(`║  Nicho: ${NICHE_LABELS[niche].padEnd(31)}║`);
  console.log(`║  Cor: ${primaryColor.padEnd(33)}║`);
  console.log(`║  WhatsApp: ${whatsapp.padEnd(28)}║`);
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  Próximos passos:                        ║');
  console.log('║  1. npm run dev (testar)                 ║');
  console.log('║  2. Adicionar produtos em /admin         ║');
  console.log('║  3. Fazer deploy na Vercel               ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('\n');

  rl.close();
}

function generateClientTs({ id, name, highlight, storeName, slogan, whatsapp, email, city, state, primaryColor, logoUrl, niche }) {
  const adminEmail = `admin@${id.replace(/-/g, '')}.com`;
  
  return `export interface ClientConfig {
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
  id: '${id}',
  version: '1.0.0',
  brand: {
    colorPrimary: '${primaryColor}',
    colorBackground: '220 20% 4%',
    colorForeground: '45 20% 96%',
    fontFamily: "'Inter', sans-serif",
    logoUrl: '${logoUrl}',
    logoAlt: '${storeName}',
    heroBgImages: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1600&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&q=85&auto=format&fit=crop',
    ],
  },
  company: {
    name: '${name}',
    nameHighlight: '${highlight}',
    legalName: '${storeName} LTDA',
    slogan: '${slogan}',
    description: '${slogan}. Produtos de qualidade com entrega rápida e parcelamento facilitado.',
    location: { city: '${city}', state: '${state}', country: 'Brasil', address: '${city}, ${state}' },
    contact: {
      phone: '+55 ${whatsapp.slice(2, 4)} ${whatsapp.slice(4)}',
      whatsappNumber: '${whatsapp}',
      whatsappMessage: 'Olá! Vi o site e quero mais informações',
      email: '${email || adminEmail}',
    },
    social: { instagram: '', facebook: '', tiktok: '' },
  },
  features: { products: true, testimonials: true, installments: true, maxInstallments: 18 },
  initialContent: {
    hero: {
      badge: 'NOVIDADES DISPONÍVEIS',
      headline: '${name}',
      headlineGold: '${highlight}',
      subheadline: '${slogan}. Garantia, parcelamento em até 18x e entrega rápida.',
      ctaPrimary: 'Ver Produtos',
      ctaSecondary: 'Falar no WhatsApp',
      badges: [
        { icon: 'ShieldCheck', label: 'QUALIDADE GARANTIDA', sub: 'GARANTIDO' },
        { icon: 'Zap',         label: 'ENTREGA RÁPIDA',     sub: 'TODO BRASIL' },
        { icon: 'Award',       label: 'SATISFAÇÃO TOTAL',   sub: 'GARANTIDO' },
      ],
    },
    features: [
      { id: 'f1', title: 'Produtos de Qualidade',   description: 'Selecionados e testados rigorosamente antes da venda',          icon: 'ShieldCheck' },
      { id: 'f2', title: 'Parcelamento Facilitado', description: 'Parcele em até 18x sem juros no cartão de crédito',             icon: 'CreditCard'  },
      { id: 'f3', title: 'Suporte Especializado',   description: 'Atendimento rápido e personalizado para sua tranquilidade',     icon: 'Wrench'      },
      { id: 'f4', title: 'Entrega Rápida',          description: 'Entrega para todo Brasil com rastreamento em tempo real',        icon: 'Truck'       },
      { id: 'f5', title: 'Avaliação 5 Estrelas',    description: 'Clientes satisfeitos. Reputação construída com honestidade.',    icon: 'Star'        },
      { id: 'f6', title: 'Atendimento Rápido',      description: 'Respondemos em minutos pelo WhatsApp. Sem robôs.',              icon: 'Clock'       },
    ],
    cta: {
      headline: 'Pronto para garantir o seu?',
      subheadline: 'Atendimento rápido, preços justos e qualidade garantida',
      buttonText: 'Falar no WhatsApp',
    },
    footer: { copyright: '© ${new Date().getFullYear()} ${storeName} · Todos os direitos reservados' },
  },
  admin: { credentials: { email: '${adminEmail}', password: 'admin123', sessionDuration: 24 } },
  seo: {
    title: '${storeName} — ${slogan}',
    description: '${slogan}. Produtos de qualidade com garantia, parcelamento em até 18x e entrega rápida.',
    keywords: ['${id}', '${name.toLowerCase()}', '${slogan.toLowerCase().split(' ')[0]}'],
  },
};
`;
}

function generateNicheTs(niche) {
  return niche;
}

main().catch(console.error);
