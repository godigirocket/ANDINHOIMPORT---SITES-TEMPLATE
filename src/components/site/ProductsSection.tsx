import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, MessageCircle, CreditCard, Star, ExternalLink, Zap } from 'lucide-react';
import { useProductStore } from '@/lib/stores/productStore';
import { useContentStore } from '@/lib/stores/contentStore';
import { clientConfig } from '@/config/client';

export function ProductsSection() {
  const { fetchProducts, getActiveProducts } = useProductStore();
  const { content } = useContentStore();
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const activeProducts = getActiveProducts();
  const whatsappUrl = content.whatsapp_link || `https://wa.me/${clientConfig.company.contact.whatsappNumber}`;
  const fmt = (p: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p);

  const handleClick = (title: string, link?: string | null) => {
    if (link) { window.open(link, '_blank'); return; }
    window.open(`${whatsappUrl}?text=${encodeURIComponent(`Olá! Tenho interesse no ${title}. Pode me passar mais informações?`)}`, '_blank');
  };

  if (!clientConfig.features.products) return null;

  return (
    <section id="products" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background único — gradiente azul-escuro diferente do hero */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(220,20%,4%) 0%, hsl(225,25%,6%) 50%, hsl(220,20%,4%) 100%)' }} />
      {/* Glow lateral esquerdo */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, hsla(43,96%,52%,0.06) 0%, transparent 70%)' }} />
      {/* Glow lateral direito */}
      <div className="absolute right-0 top-1/3 w-[400px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, hsla(200,100%,60%,0.04) 0%, transparent 70%)' }} />
      {/* Linhas horizontais decorativas */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 80px, hsla(43,96%,52%,0.03) 80px, hsla(43,96%,52%,0.03) 81px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ y: 24, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ border: '1px solid hsla(43,96%,52%,0.25)', background: 'hsla(43,96%,52%,0.06)' }}>
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-primary">Pronta Entrega</span>
          </div>
          <h2 className="font-black text-4xl md:text-6xl tracking-tight mb-4">
            <span className="gradient-text">Modelos Disponíveis</span>
          </h2>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Parcelamento facilitado · Garantia total · Entrega rápida
          </p>
        </motion.div>

        {activeProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {activeProducts.map((product, i) => (
              <motion.div key={product.id}
                initial={{ y: 32, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="group relative">
                {/* Card com borda neon */}
                <div className="relative rounded-2xl overflow-hidden transition-all duration-400 cursor-pointer"
                  style={{
                    background: 'linear-gradient(145deg, hsla(225,25%,9%,0.95) 0%, hsla(220,20%,7%,0.98) 100%)',
                    border: '1px solid hsla(43,96%,52%,0.12)',
                    boxShadow: '0 4px 24px hsla(0,0%,0%,0.4)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.border = '1px solid hsla(43,96%,52%,0.4)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px hsla(43,96%,52%,0.12), 0 0 0 1px hsla(43,96%,52%,0.15)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.border = '1px solid hsla(43,96%,52%,0.12)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px hsla(0,0%,0%,0.4)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}>

                  {/* Imagem */}
                  <div className="relative aspect-square overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,hsla(225,25%,11%,1) 0%,hsla(220,20%,8%,1) 100%)' }}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
                        {/* Placeholder premium com nome do produto */}
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{ background: 'hsla(43,96%,52%,0.1)', border: '1px solid hsla(43,96%,52%,0.2)' }}>
                          <Package className="w-8 h-8 text-primary opacity-60" />
                        </div>
                        <p className="text-xs text-center font-semibold line-clamp-2"
                          style={{ color: 'hsla(45,20%,96%,0.4)' }}>{product.title}</p>
                      </div>
                    )}
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'linear-gradient(135deg, transparent 40%, hsla(255,255%,255%,0.04) 50%, transparent 60%)' }} />
                    {/* Badge premium com emoji */}
                    {product.badge && (
                      <span className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-[11px] font-black max-w-[calc(100%-24px)] truncate"
                        style={{ background: 'linear-gradient(135deg,hsl(43,96%,52%),hsl(38,92%,44%))', color: 'hsl(220,20%,4%)', boxShadow: '0 0 14px hsla(43,96%,52%,0.6)' }}>
                        {product.badge}
                      </span>
                    )}
                    {product.featured && (
                      <div className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'hsla(43,96%,52%,0.9)', boxShadow: '0 0 10px hsla(43,96%,52%,0.6)' }}>
                        <Star className="w-3.5 h-3.5 fill-current" style={{ color: 'hsl(220,20%,4%)' }} />
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5">
                    <h3 className="font-bold text-sm mb-1 line-clamp-1 text-white group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs mb-4 line-clamp-2" style={{ color: 'hsla(45,20%,96%,0.45)' }}>
                      {product.description}
                    </p>
                    {/* Preço */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-primary">{fmt(product.price)}</span>
                        {product.old_price && (
                          <span className="text-xs line-through" style={{ color: 'hsla(45,20%,96%,0.35)' }}>
                            {fmt(product.old_price)}
                          </span>
                        )}
                      </div>
                      {clientConfig.features.installments && product.installments > 1 && (
                        <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'hsla(45,20%,96%,0.4)' }}>
                          <CreditCard className="w-3 h-3" />
                          <span>ou {product.installments}x de {fmt(product.price / product.installments)}</span>
                        </div>
                      )}
                    </div>
                    {/* CTA */}
                    <button onClick={() => handleClick(product.title, product.affiliate_link)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: 'linear-gradient(135deg, hsl(43,96%,52%), hsl(38,92%,44%))',
                        color: 'hsl(220,20%,4%)',
                        boxShadow: '0 0 16px hsla(43,96%,52%,0.3)',
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px hsla(43,96%,52%,0.55)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px hsla(43,96%,52%,0.3)')}>
                      {product.affiliate_link
                        ? <><ExternalLink className="w-3.5 h-3.5" />Ver Oferta</>
                        : <><MessageCircle className="w-3.5 h-3.5" />Consultar</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty state premium */
          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto text-center py-20 px-8 rounded-3xl"
            style={{ background: 'linear-gradient(145deg, hsla(225,25%,9%,0.8), hsla(220,20%,7%,0.9))', border: '1px solid hsla(43,96%,52%,0.15)' }}>
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'hsla(43,96%,52%,0.08)', border: '1px solid hsla(43,96%,52%,0.2)' }}>
              <Package className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Em breve novidades</h3>
            <p className="text-sm mb-8" style={{ color: 'hsla(45,20%,96%,0.5)' }}>
              Novos modelos chegando. Fale conosco para saber disponibilidade.
            </p>
            <a href={`${whatsappUrl}?text=${encodeURIComponent(clientConfig.company.contact.whatsappMessage)}`}
              target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 text-sm">
              <MessageCircle className="w-4 h-4" />
              Consultar disponibilidade
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
