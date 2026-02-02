import { Link } from "react-router-dom";
import type{ Movie } from "../types/movie";
import { Clock, Ticket } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      to={`/movie/${movie.id}`}
      state={{ movie }} 
      className="group relative block overflow-hidden rounded-xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-200">
        <img
          src={movie.poster_url}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/300x450?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="p-4">
        <h3
          className="mb-1 text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors"
          title={movie.title}
        >
          {movie.title}
        </h3>

        <p className="mb-3 text-xs text-slate-500 line-clamp-2 h-8 leading-relaxed">
          {movie.description}
        </p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
          <div className="flex items-center text-slate-500 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 mr-1 text-blue-500" />
            {movie.duration_min} dk
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            <Ticket className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}