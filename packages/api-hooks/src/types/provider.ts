import type { ApiRequestOptions } from "./request";

export type ApiClient = {
  get: <T>(url: string, init?: ApiRequestOptions) => Promise<T>;
  post: <T>(url: string, json?: unknown, init?: ApiRequestOptions) => Promise<T>;
  put: <T>(url: string, json?: unknown, init?: ApiRequestOptions) => Promise<T>;
  patch: <T>(url: string, json?: unknown, init?: ApiRequestOptions) => Promise<T>;
  delete: <T>(url: string, init?: ApiRequestOptions) => Promise<T>;
};

export interface ApiProviderValue {
  client: ApiClient;
  baseUrl?: string;
}

export interface ApiProviderProps extends ApiProviderValue {
  children: React.ReactNode;
}
