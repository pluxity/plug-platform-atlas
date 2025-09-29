import { ApiContext } from "./client";
import type { ApiClient, ApiProviderProps } from "../types/provider";
import type { ReactNode } from "react";

export function ApiProvider({ client, baseUrl, children }: ApiProviderProps) {
  return (
    <ApiContext.Provider value={{ client, baseUrl }}>{children}</ApiContext.Provider>
  );
}

export function makeApiProvider(createClient: (baseUrl: string) => ApiClient) {
  return function ApiProviderFactory({ baseUrl, children }: { baseUrl: string; children: ReactNode }) {
    const client = createClient(baseUrl);
    return <ApiProvider client={client} baseUrl={baseUrl}>{children}</ApiProvider>;
  };
}
