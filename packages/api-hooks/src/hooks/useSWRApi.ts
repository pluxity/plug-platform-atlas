import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";
import useSWRMutation, {
  type SWRMutationConfiguration,
  type SWRMutationResponse
} from "swr/mutation";
import { useApiClient } from "../core/client";
import type { ApiRequestOptions, MutationArg } from "../types/request";

export type GetKey = string | [url: string, init?: ApiRequestOptions];

export function useSWRGet<T>(key: GetKey | null, config?: SWRConfiguration<T, any>): SWRResponse<T, any> {
  const client = useApiClient();
  return useSWR<T, any>(
    key,
    async (k: GetKey) => {
      if (Array.isArray(k)) {
        const [url, init] = k;
        return client.get<T>(url, init);
      }
      return client.get<T>(k);
    },
    config
  );
}

type BodyArg<TBody> = MutationArg<TBody> | undefined;

export function useSWRPost<TResp, TBody = unknown>(
  url: string | null,
  config?: SWRMutationConfiguration<TResp, any, string | null, BodyArg<TBody>>
): SWRMutationResponse<TResp, any, string | null, BodyArg<TBody>> {
  const client = useApiClient();
  return useSWRMutation<TResp, any, string | null, BodyArg<TBody>>(
    url,
    async (key: string | null, { arg }: { arg: BodyArg<TBody> }) => {
      if (!key) throw new Error("Mutation key is null");
      return client.post<TResp>(key, arg?.body, arg?.init);
    },
    config
  );
}

export function useSWRPut<TResp, TBody = unknown>(
  url: string | null,
  config?: SWRMutationConfiguration<TResp, any, string | null, BodyArg<TBody>>
): SWRMutationResponse<TResp, any, string | null, BodyArg<TBody>> {
  const client = useApiClient();
  return useSWRMutation<TResp, any, string | null, BodyArg<TBody>>(
    url,
    async (key: string | null, { arg }: { arg: BodyArg<TBody> }) => {
      if (!key) throw new Error("Mutation key is null");
      return client.put<TResp>(key, arg?.body, arg?.init);
    },
    config
  );
}

export function useSWRPatch<TResp, TBody = unknown>(
  url: string | null,
  config?: SWRMutationConfiguration<TResp, any, string | null, BodyArg<TBody>>
): SWRMutationResponse<TResp, any, string | null, BodyArg<TBody>> {
  const client = useApiClient();
  return useSWRMutation<TResp, any, string | null, BodyArg<TBody>>(
    url,
    async (key: string | null, { arg }: { arg: BodyArg<TBody> }) => {
      if (!key) throw new Error("Mutation key is null");
      return client.patch<TResp>(key, arg?.body, arg?.init);
    },
    config
  );
}

export function useSWRDelete<TResp>(
  url: string | null,
  config?: SWRMutationConfiguration<TResp, any, string | null, ApiRequestOptions | undefined>
): SWRMutationResponse<TResp, any, string | null, ApiRequestOptions | undefined> {
  const client = useApiClient();
  return useSWRMutation<TResp, any, string | null, ApiRequestOptions | undefined>(
    url,
    async (key: string | null, { arg }: { arg: ApiRequestOptions | undefined }) => {
      if (!key) throw new Error("Mutation key is null");
      return client.delete<TResp>(key, arg);
    },
    config
  );
}
