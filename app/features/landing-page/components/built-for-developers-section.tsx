import { Clock, Code, Heart, Shield } from "lucide-react";

import { useI18n } from "~/lib/i18n/hooks/common";

export function BuiltForDevelopersSection() {
  const { t } = useI18n();

  return (
    <section className="py-12 px-4 sm:py-20 sm:px-8 lg:py-24 bg-gradient-to-br from-muted/50 via-muted/30 to-muted/40 relative overflow-hidden content-visibility-auto">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:40px_40px] sm:bg-[size:60px_60px]" />
      <div className="absolute top-10 right-10 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500/8 to-primary/8 rounded-full blur-2xl" />
      <div className="absolute bottom-10 left-10 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-primary/8 to-blue-500/8 rounded-full blur-2xl" />
      <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-green-500/6 to-primary/6 rounded-full blur-xl" />
      <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-blue-500/6 to-purple-500/6 rounded-full blur-xl" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-purple-500/15 to-primary/15 border border-purple-500/30 rounded-full text-xs sm:text-sm lg:text-base font-semibold text-purple-600 dark:text-purple-400 mb-6 sm:mb-8 shadow-lg backdrop-blur-sm text-center leading-tight max-w-[90%] sm:max-w-[80%] lg:max-w-none">
            <Code className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0 mt-0.5" />
            <span className="break-words hyphens-auto px-1">
              {t("landing.builtForDevelopers.badge")}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent leading-tight max-w-4xl mx-auto">
            {t("landing.builtForDevelopers.title")}
          </h2>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="bg-card/80 backdrop-blur-lg border border-primary/40 rounded-3xl py-6 px-2 sm:py-10 sm:px-4 lg:py-16 lg:px-8 shadow-2xl relative overflow-hidden">
            {/* Card Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/6 via-purple-500/4 to-blue-500/6" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/4 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.08),transparent_50%)]" />

            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-10 text-center relative z-10">
              {/* Setup Time Stat */}
              <div className="space-y-2 sm:space-y-3 lg:space-y-5 group p-1.5 sm:p-3 lg:p-6 rounded-xl sm:rounded-2xl">
                <div className="mx-auto rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center mb-1 sm:mb-2 lg:mb-4 shadow-lg ring-2 w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-primary/40 to-primary/15 ring-primary/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl sm:rounded-2xl lg:rounded-3xl" />
                  <Clock className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-primary drop-shadow-lg relative z-10" />
                </div>
                <div className="font-bold text-transparent bg-clip-text leading-tight tracking-tight text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl bg-gradient-to-br from-primary via-primary/90 to-primary/70">
                  {t("landing.builtForDevelopers.stats.setupTime.value")}
                </div>
                <div className="text-xs xs:text-sm sm:text-base lg:text-lg text-muted-foreground font-semibold leading-tight px-1">
                  {t("landing.builtForDevelopers.stats.setupTime.label")}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-muted-foreground/90 leading-relaxed px-1 sm:px-2 lg:px-3 line-clamp-3">
                  {t("landing.builtForDevelopers.stats.setupTime.description")}
                </div>
              </div>

              {/* Type Safe Stat */}
              <div className="space-y-2 sm:space-y-3 lg:space-y-5 group p-1.5 sm:p-3 lg:p-6 rounded-xl sm:rounded-2xl">
                <div className="mx-auto rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center mb-1 sm:mb-2 lg:mb-4 shadow-lg ring-2 w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-green-500/40 to-green-500/15 ring-green-500/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl sm:rounded-2xl lg:rounded-3xl" />
                  <Shield className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-green-600 drop-shadow-lg relative z-10" />
                </div>
                <div className="font-bold text-transparent bg-clip-text leading-tight tracking-tight text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl bg-gradient-to-br from-green-600 via-green-500 to-green-400">
                  {t("landing.builtForDevelopers.stats.typeSafe.value")}
                </div>
                <div className="text-xs xs:text-sm sm:text-base lg:text-lg text-muted-foreground font-semibold leading-tight px-1">
                  {t("landing.builtForDevelopers.stats.typeSafe.label")}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-muted-foreground/90 leading-relaxed px-1 sm:px-2 lg:px-3 line-clamp-3">
                  {t("landing.builtForDevelopers.stats.typeSafe.description")}
                </div>
              </div>

              {/* Config Headaches Stat */}
              <div className="space-y-2 sm:space-y-3 lg:space-y-5 group p-1.5 sm:p-3 lg:p-6 rounded-xl sm:rounded-2xl">
                <div className="mx-auto rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center mb-1 sm:mb-2 lg:mb-4 shadow-lg ring-2 w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-blue-500/40 to-blue-500/15 ring-blue-500/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl sm:rounded-2xl lg:rounded-3xl" />
                  <Heart className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-blue-600 drop-shadow-lg relative z-10" />
                </div>
                <div className="font-bold text-transparent bg-clip-text leading-tight tracking-tight text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
                  {t("landing.builtForDevelopers.stats.configHeadaches.value")}
                </div>
                <div className="text-xs xs:text-sm sm:text-base lg:text-lg text-muted-foreground font-semibold leading-tight px-1">
                  {t("landing.builtForDevelopers.stats.configHeadaches.label")}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-muted-foreground/90 leading-relaxed px-1 sm:px-2 lg:px-3 line-clamp-3">
                  {t(
                    "landing.builtForDevelopers.stats.configHeadaches.description",
                  )}
                </div>
              </div>
            </div>

            {/* Floating Orbs - Fixed positioning and z-index */}
            <div className="absolute top-4 left-1/3 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl z-[1]" />
            <div className="absolute bottom-4 right-1/3 w-4 h-4 sm:w-6 sm:h-6 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full blur-xl z-[1]" />
            <div className="absolute top-1/4 right-1/5 w-3 h-3 sm:w-5 sm:h-5 lg:w-8 lg:h-8 bg-gradient-to-r from-green-500/15 to-primary/15 rounded-full blur-lg z-[1]" />
            <div className="absolute bottom-1/4 left-1/5 w-2 h-2 sm:w-4 sm:h-4 lg:w-6 lg:h-6 bg-gradient-to-r from-purple-500/15 to-blue-500/15 rounded-full blur-lg z-[1]" />

            {/* Decorative Elements - Static floating sparkles */}
            <div className="absolute top-8 right-8 w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full blur-sm z-[1]" />
            <div className="absolute top-12 right-16 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-gradient-to-r from-blue-400/40 to-primary/40 rounded-full blur-[2px] z-[1]" />
            <div className="absolute bottom-8 left-8 w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 bg-gradient-to-r from-green-500/25 to-blue-500/25 rounded-full blur-sm z-[1]" />
            <div className="absolute bottom-12 left-16 w-2 h-2 sm:w-3 sm:h-3 lg:w-5 lg:h-5 bg-gradient-to-r from-purple-400/35 to-green-400/35 rounded-full blur-[3px] z-[1]" />
            <div className="absolute top-20 right-1/4 w-1 h-1 sm:w-2 sm:h-2 lg:w-3 lg:h-3 bg-primary/50 rounded-full z-[1]" />
            <div className="absolute bottom-20 left-1/4 w-1 h-1 sm:w-2 sm:h-2 lg:w-3 lg:h-3 bg-purple-500/50 rounded-full z-[1]" />
          </div>
        </div>
      </div>
    </section>
  );
}
