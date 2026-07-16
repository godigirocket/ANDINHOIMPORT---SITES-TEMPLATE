import { useEffect } from 'react';

/**
 * Componente Tawk.to - Chat ao vivo GRATUITO
 * 
 * COMO CONFIGURAR:
 * 1. Acesse https://www.tawk.to e crie uma conta grátis
 * 2. Adicione seu site
 * 3. Copie o Property ID (ex: 5f8a9b2c3d4e5f6g7h8i9j0k)
 * 4. Cole abaixo no lugar de 'SEU_PROPERTY_ID_AQUI'
 * 5. Salve e recarregue o site
 * 
 * RECURSOS GRATUITOS:
 * - Chat ao vivo ilimitado
 * - Chatbot automático
 * - App mobile (iOS + Android)
 * - Histórico de conversas
 * - Notificações push
 * - Sem marca d'água
 * - Sem limite de mensagens
 */

interface TawkToChatProps {
  propertyId?: string; // ID do Tawk.to (ex: '5f8a9b2c3d4e5f6g7h8i9j0k')
  widgetId?: string;   // Widget ID (geralmente 'default')
}

export function TawkToChat({ 
  propertyId = 'SEU_PROPERTY_ID_AQUI', 
  widgetId = 'default' 
}: TawkToChatProps) {
  
  useEffect(() => {
    // Não carrega se não tiver Property ID configurado
    if (propertyId === 'SEU_PROPERTY_ID_AQUI') {
      console.warn('⚠️ Tawk.to não configurado. Acesse https://www.tawk.to para criar uma conta grátis.');
      return;
    }

    // Carrega o script do Tawk.to
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
      // Remove o widget do DOM
      const tawkWidget = document.getElementById('tawk-bubble-container');
      if (tawkWidget) tawkWidget.remove();
    };
  }, [propertyId, widgetId]);

  return null; // Componente invisível
}
