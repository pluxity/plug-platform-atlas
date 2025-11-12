import { useState, useEffect, useCallback } from 'react'
import { fetchSvg, replaceSvgColors } from '../../utils/svgIconUtils'

interface UseSvgIconOptions {
  path: string
  defaultColor?: string
  activeColor?: string
  defaultStrokeColor?: string
  activeStrokeColor?: string
}

interface UseSvgIconReturn {
  getColoredSvg: (isActive: boolean) => string | null
}

/**
 * SVG 아이콘을 로드하고 색상을 커스터마이징할 수 있는 hook
 * @param options - SVG 아이콘 옵션
 * @returns SVG 아이콘 관련 상태와 함수
 */
export const useSvgIcon = ({
  path,
  defaultColor = '#BBBFCF',
  activeColor = 'currentColor',
  defaultStrokeColor,
  activeStrokeColor,
}: UseSvgIconOptions): UseSvgIconReturn => {
  const [svgString, setSvgString] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadSvg = async () => {
      try {
        const svg = await fetchSvg(path)
        if (isMounted) {
          setSvgString(svg)
        }
      } catch (err) {
        console.error('Failed to load SVG:', err)
      }
    }

    loadSvg()

    return () => {
      isMounted = false
    }
  }, [path])

  const getColoredSvg = useCallback(
    (isActive: boolean): string | null => {
      if (!svgString) return null

      const fillColor = isActive ? activeColor : defaultColor
      const strokeColor = isActive
        ? activeStrokeColor || defaultStrokeColor
        : defaultStrokeColor

      return replaceSvgColors(svgString, fillColor, strokeColor)
    },
    [svgString, defaultColor, activeColor, defaultStrokeColor, activeStrokeColor]
  )

  return {
    getColoredSvg,
  }
}

