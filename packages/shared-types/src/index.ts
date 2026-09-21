export interface UserProfileDto {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPPORT';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: number;
}
