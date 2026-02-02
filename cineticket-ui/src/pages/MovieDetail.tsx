import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type{ Movie, Showtime } from "../types/movie";
import { movieService } from "../services/movieService";
import { Calendar, Clock, ArrowLeft, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import BookingModal from "../components/BookingModal"; 

export default function MovieDetail() {
  const { id } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();

  const movie = location.state?.movie as Movie;

  // State Tanımları
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);

  useEffect(() => {
    if (!movie) {
      navigate("/");
    }
  }, [movie, navigate]);

  useEffect(() => {
    if (!id) return;

    const fetchShowtimes = async () => {
      try {
        const data = await movieService.getShowtimes(Number(id));
        setShowtimes(data);
      } catch (error) {
        toast.error("Seans bilgisi alınamadı");
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [id]);


  const handleShowtimeClick = (showtime: Showtime) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bilet almak için lütfen önce giriş yapın!");
      navigate("/login");
      return;
    }

    setSelectedShowtime(showtime); 
    setIsModalOpen(true);          
  };


  if (!movie) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="relative h-[40vh] w-full bg-slate-900 overflow-hidden">
        <img 
          src={movie.poster_url} 
          className="h-full w-full object-cover opacity-40 blur-md scale-105" 
          alt="Backdrop" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-4 py-2 text-white hover:bg-black/60 transition z-20 border border-white/10"
        >
          <ArrowLeft className="w-5 h-5" /> Geri Dön
        </button>
      </div>

      <div className="container mx-auto px-4 -mt-48 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-10">
          
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img 
              src={movie.poster_url} 
              alt={movie.title} 
              className="h-[500px] w-[340px] rounded-xl shadow-2xl object-cover border-4 border-white bg-slate-200"
            />
          </div>

          <div className="flex-1 pt-4 md:pt-48">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-600 mb-8 text-sm font-medium">
              <span className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 mr-1"/> {movie.duration_min} dk
              </span>
              <span className="bg-slate-200 px-3 py-1 rounded-full">Bilim Kurgu</span>
              <span className="bg-slate-200 px-3 py-1 rounded-full">IMDB: 8.8</span>
            </div>
            
            <div className="mb-10">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Özet</h3>
              <p className="text-slate-600 leading-relaxed text-lg max-w-3xl">
                {movie.description}
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Ticket className="w-6 h-6 text-blue-600" />
                  Seans Seçimi
                </h3>
                {!loading && (
                    <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        {showtimes.length} Seans Mevcut
                    </span>
                )}
              </div>

              {loading ? (
                <div className="flex gap-2 animate-pulse">
                  <div className="h-16 w-32 bg-slate-200 rounded-xl"></div>
                  <div className="h-16 w-32 bg-slate-200 rounded-xl"></div>
                </div>
              ) : showtimes.length === 0 ? (
                <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-100 text-orange-600">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Bu film için planlanmış seans bulunmamaktadır.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {showtimes.map((s) => {
                    const date = new Date(s.start_time);
                    const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                    const dateStr = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });

                    return (
                      <button 
                        key={s.id}
                        onClick={() => handleShowtimeClick(s)} 
                        className="group relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-slate-100 bg-white hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
                      >
                        <span className="text-xl font-black text-slate-800 group-hover:text-blue-700">
                          {timeStr}
                        </span>
                        <span className="text-xs text-slate-400 group-hover:text-blue-500 font-medium">
                          {dateStr}
                        </span>
                        {/* Fiyat Etiketi */}
                        <div className="mt-2 bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {s.price} ₺
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        showtime={selectedShowtime} 
      />

    </div>
  );
}