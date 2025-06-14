import { Loader2, ArrowRight } from "lucide-react";

export default function MeLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Main loading container */}
      <div className="relative">
        {/* Gradient background decoration */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl animate-pulse" />

        {/* Glass morphism container */}
        <div className="relative backdrop-blur-md bg-white/70 dark:bg-black/30 border border-white/30 dark:border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center space-y-6">
            {/* Logo/Brand section */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-full blur-md animate-pulse" />
              <div className="relative p-4 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-white/20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* Loading spinner and text */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <div className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Mengarahkan ke dashboard Anda...
                </div>
              </div>

              {/* Progress indicator */}
              <div className="w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse transform translate-x-0" />
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-sm">
                Sedang memuat aktivitas dan booking terbaru Anda
              </p>
            </div>

            {/* Animated dots */}
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
