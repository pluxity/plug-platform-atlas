import { getAssetPath } from './assetPath'

const svgSourceCache = new Map<string, string>()
const coloredSvgCache = new Map<string, string>()

export const SVG_MARKERS = {
  DISPLACEMENT: 'displacement',
  FIRE: 'fire',
  TEMPERATURE: 'temperature',
} as const

export type SvgMarkerType = typeof SVG_MARKERS[keyof typeof SVG_MARKERS]

export async function preloadAllMarkerSvgs(): Promise<void> {
  const markerNames = Object.values(SVG_MARKERS)
  const loadPromises = markerNames.map(async (name) => {
    try {
      const path = getAssetPath(`/images/icons/markers/${name}.svg`)
      const response = await fetch(path)
      if (!response.ok) return
      const svgContent = await response.text()
      svgSourceCache.set(name, svgContent)
    } catch (error) {
      // Silent fail
    }
  })

  await Promise.all(loadPromises)
}

export function createColoredSvgDataUrl(svgName: string, color: string): string {
  const cacheKey = `${svgName}:${color}`
  const cached = coloredSvgCache.get(cacheKey)
  if (cached) return cached

  const svgContent = svgSourceCache.get(svgName)
  if (!svgContent) return ''

  const coloredSvg = svgContent.replace(
    /<circle([^>]*?)fill=["'][^"']*["']/gi,
    `<circle$1fill="${color}"`
  )

  const encodedSvg = encodeURIComponent(coloredSvg)
  const dataUrl = `data:image/svg+xml,${encodedSvg}`
  coloredSvgCache.set(cacheKey, dataUrl)

  return dataUrl
}

export function getCacheStats() {
  return {
    loadedSvgs: svgSourceCache.size,
    cachedColoredSvgs: coloredSvgCache.size,
    svgNames: Array.from(svgSourceCache.keys()),
  }
}

export function clearSvgCache() {
  svgSourceCache.clear()
  coloredSvgCache.clear()
}
