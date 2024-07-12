import { URL } from 'url';

export function normalizeDomain(domain: string): string {
  try {
    const url = new URL(domain.includes('://') ? domain : `http://${domain}`);
    return url.hostname;
  } catch (error) {
    return domain;
  }
}
