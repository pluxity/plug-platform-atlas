/**
 * Get asset path with base path prefix
 * @param path - Asset path starting with /
 * @returns Full asset path with base path prefix
 */
export function getAssetPath(path: string): string {
  const basePath = import.meta.env.VITE_BASE_PATH || '/'

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  // If basePath is /, return path as is
  if (basePath === '/') {
    return normalizedPath
  }

  // Remove trailing slash from basePath and combine
  const normalizedBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
  return `${normalizedBasePath}${normalizedPath}`
}
