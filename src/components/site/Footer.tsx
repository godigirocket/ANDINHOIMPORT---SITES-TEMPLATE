import { motion } from 'framer-motion';
import { Instagram, MessageCircle, MapPin, Mail, Phone } from 'lucide-react';
import { clientConfig } from '@/config/client';

export function Footer() {
  const { company, initialContent } = clientConfig;
  const { footer } = initialContent;

  return (
    <footer className="bg-surface/50 border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={company.logo.url}
                alt={company.logo.alt}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/50"
              />
              <div>
                <span className="font-bold text-xl">{company.name}</span>
                <span className="block text-sm text-muted-foreground">{company.slogan}</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              {company.description}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href={company.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={company.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center hover:bg-accent/20 hover:text-accent transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a href="#hero" className="hover:text-foreground transition-colors">Início</a>
              </li>
              <li>
                <a href="#products" className="hover:text-foreground transition-colors">Produtos</a>
              </li>
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">Diferenciais</a>
              </li>
              <li>
                <a href="#cta" className="hover:text-foreground transition-colors">Contato</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{company.location.city}, {company.location.state}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>{company.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>{company.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
        >
          <p>{footer.copyright}</p>
          <p>{footer.developerNote}</p>
        </motion.div>
      </div>
    </footer>
  );
}
