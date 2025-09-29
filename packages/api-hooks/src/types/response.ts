export interface DataResponseBody<T> {
  data: T;
  status: number;
  message?: string;
  timestamp?: string;
}
