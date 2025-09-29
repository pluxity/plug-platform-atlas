// Legacy supplemental types retained for backwards compatibility; main props live in component file.
export type InputScale = 'sm' | 'default' | 'lg' | 'xl'
export type InputVariant = 'default' | 'error' | 'success' | 'warning' | 'ghost' | 'premium'

// (Deprecated) use InputVariant above.
// export type OldInputVariant = "default" | "error" | "success" | "warning"

export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week"
  | "file"
  | "hidden"
  | "range"
  | "color"