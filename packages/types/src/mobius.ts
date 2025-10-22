import { z } from 'zod'

/**
 * Mobius Config Response
 */
export const MobiusConfigResponseSchema = z.object({
  id: z.number(),
  url: z.string(),
})

export type MobiusConfigResponse = z.infer<typeof MobiusConfigResponseSchema>

/**
 * Mobius Config Update Request
 */
export const MobiusConfigUpdateRequestSchema = z.object({
  url: z.string().min(1, 'Mobius URL을 입력해주세요'),
})

export type MobiusConfigUpdateRequest = z.infer<typeof MobiusConfigUpdateRequestSchema>

/**
 * Mobius Config Form Data (UI용)
 */
export interface MobiusConfigFormData {
  ipAddress: string
  port: number
  cseBaseName: string
  deviceGroup: string
}

/**
 * IPv4 주소 validation regex
 */
const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/

/**
 * Mobius Config Form Validation Schema
 */
export const MobiusConfigFormSchema = z.object({
  ipAddress: z
    .string()
    .min(1, 'IoT 플랫폼 IP 주소를 입력해주세요')
    .regex(ipv4Regex, '올바른 IPv4 주소 형식을 입력해주세요 (예: 203.253.128.181)')
    .refine(
      (ip) => {
        const parts = ip.split('.')
        return parts.every((part) => {
          const num = parseInt(part, 10)
          return num >= 0 && num <= 255
        })
      },
      { message: 'IP 주소의 각 부분은 0-255 범위여야 합니다' }
    ),
  port: z
    .number()
    .int('Port 번호는 정수여야 합니다')
    .min(1, 'Port 번호는 최소 1 이상이어야 합니다')
    .max(65535, 'Port 번호는 최대 65535까지 입력 가능합니다'),
  cseBaseName: z
    .string()
    .min(1, 'CSEBASE_NAME을 입력해주세요')
    .max(50, 'CSEBASE_NAME은 최대 50자까지 입력 가능합니다'),
  deviceGroup: z
    .string()
    .min(1, '디바이스 관리 그룹명을 입력해주세요')
    .max(50, '디바이스 관리 그룹명은 최대 50자까지 입력 가능합니다'),
})

/**
 * URL 조합: 폼 데이터 → API URL
 */
export function buildMobiusUrl(formData: MobiusConfigFormData): string {
  return `http://${formData.ipAddress}:${formData.port}/${formData.cseBaseName}/${formData.deviceGroup}`
}

/**
 * URL 파싱: API URL → 폼 데이터
 */
export function parseMobiusUrl(url: string): MobiusConfigFormData | null {
  try {
    // http://203.253.128.181:11000/Mobius/sawwave 형태를 파싱
    const urlPattern = /^https?:\/\/([^:]+):(\d+)\/([^/]+)\/(.+)$/
    const match = url.match(urlPattern)

    if (!match || !match[1] || !match[2] || !match[3] || !match[4]) return null

    return {
      ipAddress: match[1],
      port: parseInt(match[2], 10),
      cseBaseName: match[3],
      deviceGroup: match[4],
    }
  } catch {
    return null
  }
}
