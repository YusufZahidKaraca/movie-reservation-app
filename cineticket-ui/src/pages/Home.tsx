import { useEffect, useState } from "react";
import { movieService } from "../services/movieService";
import type{ Movie } from "../types/movie";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import MovieCard from "../components/MovieCard"; // 👈 Yeni component import edildi

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getAllMovies();
        setMovies(data);
      } catch (error) {
        toast.error("Filmler yüklenemedi!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 border-l-4 border-blue-600 pl-3">
          Vizyondaki Filmler
        </h1>
        <span className="text-sm text-slate-500">{movies.length} film gösteriliyor</span>
      </div>

      {/* 👇 Yeni ve Daha Sıkı Grid Yapısı */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        
        {movies.map((movie) => (
          // Artık tüm HTML burada değil, sadece Component'i çağırıyoruz.
          <MovieCard key={movie.id} movie={movie} />
        ))}
        
      </div>

      {movies.length === 0 && (
        <div className="text-center text-slate-400 py-20 bg-slate-50 rounded-xl">
            <p className="text-lg">🎬 Henüz vizyonda film yok.</p>
        </div>
      )}
    </div>
  );
}