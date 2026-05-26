import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'iks-super-secret-key-2026-change-me-32chars';

export interface DomainPayload {
  domain: string;
  timestamp: number;
  type: 'domain_verification';
}

// Создание JWT для домена
export function createDomainToken(domain: string): string {
  const payload: DomainPayload = {
    domain,
    timestamp: Date.now(),
    type: 'domain_verification',
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

// Проверка JWT токена домена
export function verifyDomainToken(token: string): DomainPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DomainPayload;
    if (decoded.type === 'domain_verification') {
      return decoded;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Проверка соответствия домена
export function isDomainValid(tokenDomain: string, actualDomain: string): boolean {
  // Нормализуем домены (убираем http://, https://, www.)
  const normalize = (domain: string) => {
    return domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');
  };
  
  return normalize(tokenDomain) === normalize(actualDomain);
}