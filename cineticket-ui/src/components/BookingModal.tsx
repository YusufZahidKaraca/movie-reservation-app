import { useState, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";
import type{ Showtime } from "../types/movie";
import { ticketService } from "../services/ticketService";
import toast from "react-hot-toast";

interface BookingModalProps {
  isOpen: boolean;           // Pencere açık mı?
  onClose: () => void;       // Kapatma fonksiyonu
  showtime: Showtime | null; // Seçilen seans bilgisi
}

export default function BookingModal({ isOpen, onClose, showtime }: BookingModalProps) {
  // --- State Tanımları ---
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null); // Kullanıcının seçtiği koltuk
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);          // Backend'den gelen DOLU koltuklar
  const [loading, setLoading] = useState(false);                         // Satın alma işlemi sürüyor mu?
  const [fetchingSeats, setFetchingSeats] = useState(false);             // Koltuklar yükleniyor mu?

  // --- useEffect: Modal Açılınca Dolu Koltukları Çek ---
  useEffect(() => {
    // Sadece modal açıksa ve seans seçiliyse çalış
    if (isOpen && showtime) {
      const fetchSeats = async () => {
        setFetchingSeats(true);
        setSelectedSeat(null); // Yeni seans açıldığı için seçimi sıfırla
        setBookedSeats([]);    // Listeyi temizle
        
        try {
          // Servis üzerinden Backend'e sor: "Hangi koltuklar dolu?"
          const seats = await ticketService.getBookedSeats(showtime.id);
          setBookedSeats(seats);
        } catch (error) {
          console.error("Koltuk bilgisi çekilemedi:", error);
          // Hata olsa bile kullanıcıyı engellemiyoruz, sadece kırmızı koltukları göremez.
          // Satın almaya çalışınca zaten backend "Dolu" hatası verir.
        } finally {
          setFetchingSeats(false);
        }
      };
      
      fetchSeats();
    }
  }, [isOpen, showtime]); // isOpen veya showtime değişirse tekrar çalış

  // Eğer modal kapalıysa hiçbir şey çizme
  if (!isOpen || !showtime) return null;

  // --- Satın Alma Fonksiyonu ---
  const handleBuy = async () => {
    if (!selectedSeat) {
      toast.error("Lütfen bir koltuk seçin!");
      return;
    }

    setLoading(true);
    try {
      await ticketService.buyTicket(showtime.id, selectedSeat);
      toast.success("Bilet başarıyla alındı! İyi seyirler 🍿");
      onClose(); // İşlem bitince modalı kapat
    } catch (error: any) {
      toast.error(error.message); // Örn: "Bu koltuk maalesef dolu"
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Arka Plan (Karanlık Perde)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* 2. Modal Kutusu */}
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* --- Başlık Kısmı --- */}
        <div className="flex items-center justify-between border-b p-4 bg-slate-50 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Koltuk Seçimi</h3>
            <div className="text-sm text-slate-500 flex gap-2">
               <span>Saat: {new Date(showtime.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
               <span className="text-slate-300">|</span>
               <span>Fiyat: <span className="font-bold text-blue-600">{showtime.price} ₺</span></span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-full p-2 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* --- İçerik (Scroll edilebilir alan) --- */}
        <div className="overflow-y-auto p-6">
            
            {/* Perde Görseli */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-3/4 h-2 bg-slate-300 rounded-full shadow-[0_15px_15px_-5px_rgba(0,0,0,0.2)] mb-3"></div>
                <p className="text-[10px] tracking-widest text-slate-400 font-semibold">SAHNE / PERDE</p>
            </div>

            {/* Renk Açıklamaları (Legend) */}
            <div className="flex justify-center gap-6 mb-6 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-slate-200 rounded border border-slate-300"></span> Boş
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-600 rounded shadow-sm"></span> Seçili
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-500 rounded opacity-50"></span> Dolu
                </div>
            </div>

            {/* --- Koltuk Izgarası --- */}
            {fetchingSeats ? (
                // Yükleniyor Animasyonu
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500"/> 
                    <span className="text-sm">Koltuk durumu kontrol ediliyor...</span>
                </div>
            ) : (
                // Izgara
                <div className="grid grid-cols-10 gap-2 sm:gap-3 justify-items-center">
                    {Array.from({ length: 50 }, (_, i) => i + 1).map((seatNum) => {
                        
                        // Koltuk Durum Kontrolü
                        const isBooked = bookedSeats.includes(seatNum);
                        const isSelected = selectedSeat === seatNum;

                        return (
                            <button
                                key={seatNum}
                                disabled={isBooked} // Doluysa tıklanamaz
                                onClick={() => setSelectedSeat(seatNum)}
                                className={`
                                    relative h-8 w-8 sm:h-9 sm:w-9 rounded-t-lg text-[10px] sm:text-xs font-bold transition-all duration-200 border-b-2
                                    ${isBooked 
                                        ? "bg-red-500 border-red-700 text-white opacity-40 cursor-not-allowed" // 🔴 Dolu
                                        : isSelected
                                            ? "bg-blue-600 border-blue-800 text-white shadow-lg scale-110 z-10 -translate-y-1" // 🔵 Seçili
                                            : "bg-slate-100 border-slate-300 text-slate-500 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600" // ⚪ Boş
                                    }
                                `}
                            >
                                {seatNum}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

        {/* --- Alt Butonlar --- */}
        <div className="border-t p-4 flex justify-end gap-3 bg-slate-50 shrink-0">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Vazgeç
          </button>
          
          <button
            onClick={handleBuy}
            disabled={loading || !selectedSeat}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {selectedSeat ? `Satın Al (${showtime.price} ₺)` : "Koltuk Seç"}
          </button>
        </div>

      </div>
    </div>
  );
}