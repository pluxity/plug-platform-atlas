export type JsonBody = unknown;

// Minimal, client-agnostic options shape. Client packages can widen via declaration merging if needed.
export interface ApiRequestOptionsBase {
	headers?: Record<string, string>;
}

// Default exported options used across hooks and ApiClient surface
export type ApiRequestOptions = ApiRequestOptionsBase & Record<string, unknown>;

export type MutationArg<TBody = unknown> = { body?: TBody; init?: ApiRequestOptions };
