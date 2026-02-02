import { useState } from "react"
import { useNavigate, Link } from "react-router-dom" // 👈 Link eklendi
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { Lock, Mail, Loader2 } from "lucide-react"
import { authService } from "../services/authService" // 👈 Servisi import ettik

// Zod Şeması
const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
})

// Bu tipi dışarıya export edelim ki Service'de de kullanabilelim (Opsiyonel)
export type LoginInputs = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInputs) => {
    setIsLoading(true)

    try {
      // 👇 ESKİ KOD YOK, ARTIK TERTEMİZ!
      const response = await authService.login(data)

      // Başarılı
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))

      toast.success(`Hoşgeldin ${response.user.fullname}! 👋`)
      navigate("/")
      
    } catch (err: any) {
      // Servis hatayı fırlattığı için burada yakalıyoruz
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all hover:shadow-blue-500/20">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Tekrar Hoşgeldin!</h1>
          <p className="mt-2 text-slate-500">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ... INPUT ALANLARI AYNI (Değişiklik Yok) ... */}
          
          {/* Email Alanı */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                {...register("email")}
                type="email"
                placeholder="admin@test.com"
                className={`w-full rounded-lg border bg-slate-50 p-2.5 pl-10 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                  errors.email ? "border-red-500" : "border-slate-300"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Şifre Alanı */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                {...register("password")}
                type="password"
                placeholder="••••••"
                className={`w-full rounded-lg border bg-slate-50 p-2.5 pl-10 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                  errors.password ? "border-red-500" : "border-slate-300"
                }`}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Giriş Yapılıyor...
              </>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Hesabın yok mu?{" "}
          {/* 👇 İŞTE DÜZELTİLEN YER: a etiketi gitti, Link geldi */}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  )
}