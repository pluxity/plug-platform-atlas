export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export type ApiHeaders = Record<string, string>;
export type ApiQuery = Record<string, string | number | boolean | null | undefined>;

// For SWR GET keys: either just a URL or a tuple including init options
export type ApiKey = string | [url: string, init?: unknown];
