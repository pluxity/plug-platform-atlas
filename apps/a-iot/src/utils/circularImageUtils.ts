interface CircularImageOptions {
  size?: number
  borderWidth?: number
  borderColor?: string
  fallbackBgColor?: string
}

const DEFAULT_OPTIONS: Required<CircularImageOptions> = {
  size: 48,
  borderWidth: 3,
  borderColor: '#FFFFFF',
  fallbackBgColor: '#E5E7EB',
}

const imageCache = new Map<string, string>()

export async function createCircularImageDataUrl(
  imageUrl: string,
  options?: CircularImageOptions
): Promise<string> {
  const { size, borderWidth, borderColor, fallbackBgColor } = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  const cacheKey = `${imageUrl}-${size}-${borderWidth}-${borderColor}`
  const cached = imageCache.get(cacheKey)
  if (cached) return cached

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      resolve(createFallbackCircle(size, borderWidth, borderColor, fallbackBgColor))
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const center = size / 2
      const outerRadius = size / 2
      const innerRadius = outerRadius - borderWidth

      ctx.beginPath()
      ctx.arc(center, center, outerRadius, 0, Math.PI * 2)
      ctx.fillStyle = borderColor
      ctx.fill()

      ctx.beginPath()
      ctx.arc(center, center, innerRadius, 0, Math.PI * 2)
      ctx.clip()

      const imgAspect = img.width / img.height
      const innerDiameter = innerRadius * 2
      let drawWidth: number, drawHeight: number, drawX: number, drawY: number

      if (imgAspect > 1) {
        drawHeight = innerDiameter
        drawWidth = drawHeight * imgAspect
        drawX = center - drawWidth / 2
        drawY = center - innerRadius
      } else {
        drawWidth = innerDiameter
        drawHeight = drawWidth / imgAspect
        drawX = center - innerRadius
        drawY = center - drawHeight / 2
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

      const dataUrl = canvas.toDataURL('image/png')
      imageCache.set(cacheKey, dataUrl)
      resolve(dataUrl)
    }

    img.onerror = () => {
      resolve(createFallbackCircle(size, borderWidth, borderColor, fallbackBgColor))
    }

    img.src = imageUrl
  })
}

function createFallbackCircle(
  size: number,
  borderWidth: number,
  borderColor: string,
  bgColor: string
): string {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  if (!ctx) return ''

  const center = size / 2
  const outerRadius = size / 2
  const innerRadius = outerRadius - borderWidth

  ctx.beginPath()
  ctx.arc(center, center, outerRadius, 0, Math.PI * 2)
  ctx.fillStyle = borderColor
  ctx.fill()

  ctx.beginPath()
  ctx.arc(center, center, innerRadius, 0, Math.PI * 2)
  ctx.fillStyle = bgColor
  ctx.fill()

  return canvas.toDataURL('image/png')
}
