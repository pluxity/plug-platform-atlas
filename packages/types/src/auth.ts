import { z } from 'zod'

/**
 * 로그인 요청 (세션 기반)
 */
export const SignInRequestSchema = z.object({
  username: z.string().min(1, '사용자명을 입력해주세요').max(20),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다').max(20),
})

export type SignInRequest = z.infer<typeof SignInRequestSchema>

/**
 * 회원가입 요청
 */
export const SignUpRequestSchema = z.object({
  username: z.string().min(1, '사용자명을 입력해주세요').max(20),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다').max(20),
  name: z.string().min(1, '이름을 입력해주세요').max(10),
  code: z.string().min(1, '코드를 입력해주세요').max(20),
})

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>
