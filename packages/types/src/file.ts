import { z } from 'zod'

/**
 * File Response
 */
export const FileResponseSchema = z.object({
  id: z.number(),
  url: z.string(),
  originalFileName: z.string(),
  contentType: z.string(),
  fileStatus: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
})

export type FileResponse = z.infer<typeof FileResponseSchema>
