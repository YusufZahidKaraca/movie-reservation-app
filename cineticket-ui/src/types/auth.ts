// Kullanıcı Modeli
export interface User {
  id: number;
  fullname: string;
  email: string;
  role: string;
}

// Backend'den gelen Login Cevabı
export interface AuthResponse {
  token: string;
  user: User;
}

// Hata Cevabı
export interface ErrorResponse {
  error: string;
}

export interface RegisterInputs {
  fullname: string;
  email: string;
  password: string;
}