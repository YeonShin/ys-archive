export interface GuestbookMessage {
  id: string;
  nickname: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuestbookDto {
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
