import type { AuthResponse, ErrorResponse, RegisterInputs } from "../types/auth";

const API_URL = "http://localhost:8080/auth";

export const authService = {
  // Login Fonksiyonu
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      // Backend'den gelen hatayı fırlat
      const errorData = data as ErrorResponse;
      throw new Error(errorData.error || "Bir hata oluştu");
    }

    return data as AuthResponse;
  },

  async register(data: RegisterInputs) {
    const response = await fetch(`${API_URL}/register`, { // Backend rotana göre /auth/register olabilir kontrol et!
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // Backend'den hata dönerse yakala
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Kayıt işlemi başarısız");
    }

    return response.json();
  }
};