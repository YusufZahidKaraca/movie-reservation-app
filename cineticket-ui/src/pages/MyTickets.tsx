import { useEffect, useState } from "react";
import { ticketService} from "../services/ticketService";
import type{ TicketDetail } from "../types/ticket";
import { Calendar, Clock, MapPin, Ticket as TicketIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function MyTickets() {
  const [tickets, setTickets] = useState<TicketDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getMyTickets();
        setTickets(data);
      } catch (error) {
        toast.error("Biletlerin yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <TicketIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Biletlerim</h1>
            <p className="text-slate-500">Satın aldığınız tüm biletler burada</p>
          </div>
        </div>

        {/* Eğer bilet yoksa */}
        {tickets.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <TicketIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700">Henüz biletin yok</h3>
            <p className="text-slate-500 mb-6">Vizyondaki filmlere göz atıp hemen yerini ayırtabilirsin.</p>
            <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
              Filmleri Keşfet 🎬
            </Link>
          </div>
        )}

        {/* Bilet Listesi */}
        <div className="grid gap-6">
          {tickets.map((ticket) => {
            const date = new Date(ticket.start_time);
            
            return (
              <div key={ticket.id} className="group flex flex-col md:flex-row bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100">
                
                {/* Sol: Film Posteri (Mobil için üstte, masaüstü için solda) */}
                <div className="w-full md:w-48 h-48 md:h-auto relative bg-slate-200">
                  <img 
                    src={ticket.poster_url} 
                    alt={ticket.movie_title} 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                </div>

                {/* Orta: Bilgiler */}
                <div className="flex-1 p-6 flex flex-col justify-center relative">
                  {/* Tırtıklı Çizgi Efekti (Süs) */}
                  <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full"></div>
                  
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{ticket.movie_title}</h2>
                  
                  <div className="flex flex-wrap gap-4 text-slate-600 text-sm mb-4">
                    <div className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      Salon 1
                    </div>
                  </div>
                </div>

                {/* Sağ: Koltuk ve QR */}
                <div className="w-full md:w-48 bg-slate-50 border-t md:border-t-0 md:border-l border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center relative">
                  {/* Tırtıklı Çizgi Efekti (Sağ taraf için) */}
                  <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full"></div>
                  
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Koltuk No</span>
                  <span className="text-4xl font-black text-blue-600 mb-2">{ticket.seat_number}</span>
                  
                  <div className="w-full h-px bg-slate-200 my-3"></div>
                  
                  <div className="opacity-50">
                    {/* Fake QR Code */}
                    <div className="w-16 h-16 bg-slate-800 mx-auto rounded mb-1 grid grid-cols-4 gap-0.5 p-1">
                        {/* Rastgele QR görünümü için kutucuklar */}
                        {[...Array(16)].map((_,i) => <div key={i} className={`bg-white rounded-[1px] ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-20'}`}></div>)}
                    </div>
                    <span className="text-[10px] text-slate-400">#{ticket.id}4829</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}