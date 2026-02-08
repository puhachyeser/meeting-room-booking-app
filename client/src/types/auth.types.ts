export interface AuthCredentials {
  email: string;
  password?: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface ApiError {
  status: number;
  data: {
    message: string;
    error?: string;
    statusCode?: number;
  };
}