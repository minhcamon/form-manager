import React from "react";
import { FormInput, Lock, Mail, Loader2 } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    handleSubmit,
  } = useLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-50/60 via-background to-background px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-zinc-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-zinc-200)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Branding */}
        <div className="flex flex-col items-center mb-8 animate-fadeIn">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-indigo-500/10 mb-4">
            <FormInput className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2 font-heading">FormManager</h1>
          <p className="text-muted-foreground text-sm">Đăng nhập vào hệ thống quản lý biểu mẫu</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground z-10">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-background text-foreground border-border placeholder-muted-foreground/50 focus-visible:ring-primary/15"
                  placeholder="name@example.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground z-10">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-background text-foreground border-border placeholder-muted-foreground/50 focus-visible:ring-primary/15"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Login button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 text-sm font-semibold rounded-xl cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <span>Đăng nhập</span>
              )}
            </Button>
          </form>

          {/* Quick Demo Info */}
          <div className="mt-8 border-t border-border pt-6 text-center">
            <span className="text-muted-foreground text-xs">
              Tài khoản mẫu: <code className="bg-muted text-foreground px-1.5 py-0.5 rounded">admin@example.com</code> / <code className="bg-muted text-foreground px-1.5 py-0.5 rounded">admin123</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
