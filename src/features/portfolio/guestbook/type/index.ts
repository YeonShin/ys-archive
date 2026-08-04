export interface GuestbookMessage {
  id: string;
  nickname: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuestbookResponse {
  data: GuestbookMessage[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateGuestbookDto {
  id: string;
  nickname: string;
  password: string;
  content: string;
  isPublic: boolean;
}

export interface DeleteGuestbookDto {
  id: string;
  password: string;
}

export interface EditGuestbookDto {
  id: string;
  content: string;
  password: string;
  isPublic: boolean;
}
