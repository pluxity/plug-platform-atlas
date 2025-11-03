import { z } from 'zod'

/**
 * Permission Response
 */
export const PermissionResponseSchema = z.object({
  resourceType: z.string(),
  resourceIds: z.array(z.string()),
})

export type PermissionResponse = z.infer<typeof PermissionResponseSchema>

/**
 * Permission Group Response
 */
export const PermissionGroupResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  permissions: z.array(PermissionResponseSchema),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
})

export type PermissionGroupResponse = z.infer<typeof PermissionGroupResponseSchema>

/**
 * Permission Group Create Request
 */
export const PermissionGroupCreateRequestSchema = z.object({
  name: z.string().min(1, '권한 그룹 이름을 입력해주세요'),
  description: z.string().optional(),
  permissions: z.array(PermissionResponseSchema),
})

export type PermissionGroupCreateRequest = z.infer<typeof PermissionGroupCreateRequestSchema>

/**
 * Permission Group Update Request
 */
export const PermissionGroupUpdateRequestSchema = z.object({
  name: z.string().min(1, '권한 그룹 이름을 입력해주세요'),
  description: z.string().optional(),
  permissions: z.array(PermissionResponseSchema),
})

export type PermissionGroupUpdateRequest = z.infer<typeof PermissionGroupUpdateRequestSchema>

/**
 * Role Response
 */
export const RoleResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  permissions: z.array(PermissionGroupResponseSchema),
})

export type RoleResponse = z.infer<typeof RoleResponseSchema>

/**
 * Role Create Request
 */
export const RoleCreateRequestSchema = z.object({
  name: z.string().min(1, '역할 이름을 입력해주세요'),
  description: z.string().optional(),
  permissionGroupIds: z.array(z.number()),
})

export type RoleCreateRequest = z.infer<typeof RoleCreateRequestSchema>

/**
 * Role Update Request
 */
export const RoleUpdateRequestSchema = z.object({
  name: z.string().min(1, '역할 이름을 입력해주세요'),
  description: z.string().optional(),
  permissionGroupIds: z.array(z.number()),
})

export type RoleUpdateRequest = z.infer<typeof RoleUpdateRequestSchema>

/**
 * Resource Type Response
 */
export const ResourceTypeResponseSchema = z.object({
  name: z.string(),
  key: z.string(),
  endpoint: z.string(),
})

export type ResourceTypeResponse = z.infer<typeof ResourceTypeResponseSchema>
