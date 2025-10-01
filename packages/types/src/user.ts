import { z } from 'zod'
import { RoleResponseSchema } from './role'

/**
 * User Response
 */
export const UserResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string(),
  code: z.string().optional(),
  phoneNumber: z.string().optional(),
  department: z.string().optional(),
  shouldChangePassword: z.boolean().optional(),
  roles: z.array(RoleResponseSchema).optional(),
})

export type UserResponse = z.infer<typeof UserResponseSchema>

/**
 * User with LoggedIn Status Response
 */
export const UserLoggedInResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string(),
  code: z.string().optional(),
  phoneNumber: z.string().optional(),
  department: z.string().optional(),
  roles: z.array(RoleResponseSchema).optional(),
  loggedIn: z.boolean(),
})

export type UserLoggedInResponse = z.infer<typeof UserLoggedInResponseSchema>

/**
 * User Create Request (Admin)
 */
export const UserCreateRequestSchema = z.object({
  username: z.string().min(1, '사용자명을 입력해주세요').max(20),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다').max(20),
  name: z.string().min(1, '이름을 입력해주세요').max(10),
  code: z.string().max(20).optional(),
  phoneNumber: z.string().max(20).optional(),
  department: z.string().max(50).optional(),
  roleIds: z.array(z.number()).optional(),
})

export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>

/**
 * User Update Request
 */
export const UserUpdateRequestSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  phoneNumber: z.string().optional(),
  department: z.string().optional(),
  roleIds: z.array(z.number()).optional(),
})

export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>

/**
 * User Password Update Request
 */
export const UserPasswordUpdateRequestSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
  newPassword: z.string().min(6, '새 비밀번호는 최소 6자 이상이어야 합니다'),
})

export type UserPasswordUpdateRequest = z.infer<typeof UserPasswordUpdateRequestSchema>

/**
 * User Role Update Request
 */
export const UserRoleUpdateRequestSchema = z.object({
  roleIds: z.array(z.number()),
})

export type UserRoleUpdateRequest = z.infer<typeof UserRoleUpdateRequestSchema>
