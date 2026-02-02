export interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  duration_min: number;
  // Backend'den gelen diğer alanlar (created_at vs.) şimdilik lazım değil
}

export interface Showtime {
  id: number;
  movie_id: number;
  start_time: string; // Backend'den tarih string gelir (ISO 8601)
  price: number;
}