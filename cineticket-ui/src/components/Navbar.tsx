import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 Hook'u kullandık
import { LogOut, Ticket, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition">
          🎬 CineTicket
        </Link>

        {/* Menü */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-blue-400 transition">Filmler</Link>
          
          {isAuthenticated ? (
            // 👇 GİRİŞ YAPMIŞ KULLANICI MENÜSÜ
            <>
              <Link to="/my-tickets" className="flex items-center gap-2 hover:text-yellow-400 transition">
                <Ticket className="w-4 h-4" /> Biletlerim
              </Link>
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                <span className="text-slate-400 flex items-center gap-2">
                    <UserIcon className="w-4 h-4"/> {user?.fullname}
                </span>
                <button 
                  onClick={logout} 
                  className="flex items-center gap-1 bg-red-600/20 text-red-400 px-3 py-1.5 rounded-full hover:bg-red-600 hover:text-white transition-all"
                >
                  <LogOut className="w-4 h-4" /> Çıkış
                </button>
              </div>
            </>
          ) : (
            // 👇 MİSAFİR MENÜSÜ
            <>
              <Link to="/login" className="hover:text-blue-400 transition">Giriş Yap</Link>
              <Link 
                to="/register" 
                className="bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}