import { z } from 'zod';

export interface AdminGuestbookItem {
  id: string;
  nickname: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminGuestbookResponse {
  data: AdminGuestbookItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const adminGuestbookQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  search: z.string().optional().default(''),
});

export type AdminGuestbookQuery = z.infer<typeof adminGuestbookQuerySchema>;
