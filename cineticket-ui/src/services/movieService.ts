import type{ Movie, Showtime } from "../types/movie";

const API_URL = "http://localhost:8080/api"; // Auth değil, API rotası

export const movieService = {
  // Tüm filmleri getir
  async getAllMovies(): Promise<Movie[]> {
    const response = await fetch(`${API_URL}/movies`);
    
    if (!response.ok) {
      throw new Error("Filmler yüklenirken hata oluştu");
    }

    return response.json();
  },

  // 👇 YENİ: Filme ait seansları getir
  async getShowtimes(movieId: number): Promise<Showtime[]> {
    const response = await fetch(`${API_URL}/movies/${movieId}/showtimes`);
    
    if (!response.ok) {
      throw new Error("Seanslar yüklenemedi");
    }

    return response.json();
  }
};