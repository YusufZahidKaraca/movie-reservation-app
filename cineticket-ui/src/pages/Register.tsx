import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Lock, Mail, User, Loader2 } from "lucide-react";
import { authService} from "../services/authService";
import type{ RegisterInputs } from "../types/auth";

// 1. Zod Şeması: Kurallar
const registerSchema = z.object({
  fullname: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInputs) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      toast.success("Kayıt başarılı! Şimdi giriş yapabilirsin. 🎉");
      navigate("/login"); // Kayıt bitince Login'e at
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Aramıza Katıl! 🚀</h1>
          <p className="mt-2 text-slate-500">Sinema dünyasına adım atın</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Ad Soyad */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Ad Soyad</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                {...register("fullname")}
                type="text"
                placeholder="Ad Soyad"
                className={`w-full rounded-lg border bg-slate-50 p-2.5 pl-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                  errors.fullname ? "border-red-500" : "border-slate-300"
                }`}
              />
            </div>
            {errors.fullname && <p className="mt-1 text-xs text-red-500">{errors.fullname.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                {...register("email")}
                type="email"
                placeholder="ornek@email.com"
                className={`w-full rounded-lg border bg-slate-50 p-2.5 pl-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                  errors.email ? "border-red-500" : "border-slate-300"
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Şifre */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                {...register("password")}
                type="password"
                placeholder="••••••"
                className={`w-full rounded-lg border bg-slate-50 p-2.5 pl-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                  errors.password ? "border-red-500" : "border-slate-300"
                }`}
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Kayıt Ol"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Zaten hesabın var mı?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}