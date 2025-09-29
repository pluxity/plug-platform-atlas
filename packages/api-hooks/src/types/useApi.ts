import type { ApiRequestOptions } from "./request";

export type UseApiCall = <T>(method: "get" | "post" | "put" | "patch" | "delete", url: string, body?: unknown) => Promise<T>;

export interface UseApiResult {
	call: UseApiCall;
	get: <T>(url: string, init?: ApiRequestOptions) => Promise<T>;
	post: <T>(url: string, json?: unknown, init?: ApiRequestOptions) => Promise<T>;
	put: <T>(url: string, json?: unknown, init?: ApiRequestOptions) => Promise<T>;
	patch: <T>(url: string, json?: unknown, init?: ApiRequestOptions) => Promise<T>;
	del: <T>(url: string, init?: ApiRequestOptions) => Promise<T>;
}
