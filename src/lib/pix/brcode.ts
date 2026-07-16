/**
 * Gerador de BR Code Pix (EMV) com CRC16-CCITT válido.
 * Implementa o padrão oficial do Banco Central do Brasil.
 * Referência: https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II_ManualdePadroesparaIniciacaodoPix.pdf
 */

interface PixPayloadParams {
  /** Chave Pix (CPF, CNPJ, email, telefone ou aleatória) */
  pixKey: string;
  /** Nome do recebedor (máx 25 caracteres) */
  merchantName: string;
  /** Cidade do recebedor (máx 15 caracteres) */
  merchantCity: string;
  /** Valor da transação em reais */
  amount: number;
  /** ID da transação (máx 25 caracteres alfanuméricos) */
  txId: string;
  /** Descrição/info adicional (opcional) */
  description?: string;
}

/**
 * Calcula CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF).
 * Implementação oficial usada pelo padrão Pix do BCB.
 */
function crc16(payload: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Formata um campo TLV (Tag-Length-Value).
 * Tag = 2 dígitos, Length = 2 dígitos, Value = string
 */
function tlv(tag: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${tag}${length}${value}`;
}

/**
 * Sanitiza string removendo acentos e caracteres especiais.
 * Pix só aceita caracteres ASCII básicos.
 */
function sanitize(str: string, maxLength: number): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^A-Za-z0-9\s]/g, '')   // só ascii alfanumérico
    .trim()
    .slice(0, maxLength)
    .toUpperCase();
}

/**
 * Sanitiza txId — só letras e números, máx 25 chars.
 */
function sanitizeTxId(txId: string): string {
  return txId.replace(/[^A-Za-z0-9]/g, '').slice(0, 25) || '***';
}

/**
 * Gera o payload completo do BR Code Pix com CRC16 válido.
 * Esse payload pode ser usado tanto como "Copia e Cola" quanto convertido em QR Code.
 */
export function generatePixPayload(params: PixPayloadParams): string {
  const { pixKey, merchantName, merchantCity, amount, txId, description } = params;

  const cleanName = sanitize(merchantName, 25);
  const cleanCity = sanitize(merchantCity, 15);
  const cleanTxId = sanitizeTxId(txId);
  const amountStr = amount.toFixed(2);

  // Merchant Account Information (tag 26)
  const gui = tlv('00', 'BR.GOV.BCB.PIX');
  const key = tlv('01', pixKey);
  const desc = description ? tlv('02', sanitize(description, 50)) : '';
  const merchantAccount = tlv('26', gui + key + desc);

  // Additional Data Field (tag 62) — txId
  const additionalData = tlv('62', tlv('05', cleanTxId));

  // Payload completo (sem CRC ainda)
  const payload =
    tlv('00', '01') +              // Payload Format Indicator
    tlv('01', '12') +              // Point of Initiation Method (12 = QR estático único)
    merchantAccount +              // Merchant Account Info
    tlv('52', '0000') +            // Merchant Category Code
    tlv('53', '986') +             // Currency (986 = BRL)
    tlv('54', amountStr) +         // Transaction Amount
    tlv('58', 'BR') +              // Country Code
    tlv('59', cleanName) +         // Merchant Name
    tlv('60', cleanCity) +         // Merchant City
    additionalData +               // Additional Data
    '6304';                        // CRC tag + length (valor calculado depois)

  // Calcula CRC16 sobre o payload completo (incluindo "6304")
  const crc = crc16(payload);

  return payload + crc;
}

/**
 * Valida se a chave Pix tem formato aceitável.
 */
export function validatePixKey(key: string, type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'): boolean {
  if (!key) return false;
  switch (type) {
    case 'cpf':
      return /^\d{11}$/.test(key.replace(/\D/g, ''));
    case 'cnpj':
      return /^\d{14}$/.test(key.replace(/\D/g, ''));
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key);
    case 'phone':
      return /^\+?\d{10,14}$/.test(key.replace(/\D/g, ''));
    case 'random':
      return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(key);
    default:
      return false;
  }
}

/**
 * Formata a chave Pix para o padrão exigido pelo BR Code.
 */
export function formatPixKeyForPayload(key: string, type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'): string {
  switch (type) {
    case 'cpf':
    case 'cnpj':
      return key.replace(/\D/g, '');
    case 'phone': {
      const digits = key.replace(/\D/g, '');
      // Adiciona +55 se não tiver código do país
      return digits.startsWith('55') ? `+${digits}` : `+55${digits}`;
    }
    case 'email':
    case 'random':
      return key.toLowerCase().trim();
    default:
      return key;
  }
}
