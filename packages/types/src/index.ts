export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string | number } };

export type Shortlink = {
  id: number;
  userId: string;
  url: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
};
