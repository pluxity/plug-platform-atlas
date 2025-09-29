import { useCallback } from "react";
import { useApiClient } from "../core/client";
import type { ApiRequestOptions } from "../types/request";
import type { UseApiResult } from "../types/useApi";

type Method = "get" | "post" | "put" | "patch" | "delete";

export function useApi(): UseApiResult {
  const client = useApiClient();

  const call = useCallback(
    async <T>(method: Method, url: string, body?: unknown) => {
      switch (method) {
        case "get":
          return client.get<T>(url);
        case "post":
          return client.post<T>(url, body);
        case "put":
          return client.put<T>(url, body);
        case "patch":
          return client.patch<T>(url, body);
        case "delete":
          return client.delete<T>(url);
      }
    },
    [client]
  );

  const get = useCallback(
    async <T>(url: string, init?: ApiRequestOptions) => client.get<T>(url, init),
    [client]
  );
  const post = useCallback(
    async <T>(url: string, json?: unknown, init?: ApiRequestOptions) => client.post<T>(url, json, init),
    [client]
  );
  const put = useCallback(
    async <T>(url: string, json?: unknown, init?: ApiRequestOptions) => client.put<T>(url, json, init),
    [client]
  );
  const patch = useCallback(
    async <T>(url: string, json?: unknown, init?: ApiRequestOptions) => client.patch<T>(url, json, init),
    [client]
  );
  const del = useCallback(
    async <T>(url: string, init?: ApiRequestOptions) => client.delete<T>(url, init),
    [client]
  );

  return { call, get, post, put, patch, del };
}
