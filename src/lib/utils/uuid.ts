/**
 * Gera um UUID v4 com fallback para navegadores sem crypto.randomUUID
 * (necessário quando rodando em HTTP ao invés de HTTPS)
 */
export function generateUUID(): string {
  // Tenta usar a API nativa se disponível
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback: gera UUID v4 manualmente
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
