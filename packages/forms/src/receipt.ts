import type { Provider, Target } from './config';
import type { ProviderRequest } from './http';

/** What the endpoint returns after a successful submission. */
export interface Receipt {
  mode: 'dry-run' | 'live';
  brand: string;
  provider: Provider;
  environment: 'production' | 'preview' | 'development';
  target: Target;
  destination: { kind: 'list' | 'group'; ids: string[]; label: string };
  tags: string[];
  clickIds: Record<string, string>;
  attachmentUrl?: string;
  requests: ProviderRequest[];
  providerStatus?: number;
  receivedAt: string;
}
