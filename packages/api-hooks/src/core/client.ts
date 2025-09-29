import { createContext, useContext } from "react";
import type { ApiClient, ApiProviderValue } from "../types/provider";

export const ApiContext = createContext<ApiProviderValue | null>(null);

export function useApiClient(): ApiClient {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("ApiContext not found. Wrap with <ApiProvider />");
  return ctx.client;
}

export function useApiBaseUrl(): string | undefined {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("ApiContext not found. Wrap with <ApiProvider />");
  return ctx.baseUrl;
}
