import { Clock, Code, Heart, Shield } from "lucide-react";
import { memo } from "react";

import { useI18n } from "~/lib/i18n";

export const BuiltForDevelopersSection = memo(
  function BuiltForDevelopersSection() {
    const { t } = useI18n();

    return (
      <section
        className="py-16 px-4 bg-gradient-to-br from-muted/40 to-muted/20 relative overflow-hidden"
        style={{ contentVisibility: "auto" }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-primary/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-xl" />

        <div className="container mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-primary/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-600 dark:text-purple-400 mb-6 motion-safe:animate-pulse">
              <Code className="h-4 w-4" />
              {t("landing.builtForDevelopers.badge")}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t("landing.builtForDevelopers.title")}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card/60 backdrop-blur-sm border-2 border-primary/40 rounded-2xl p-8 shadow-xl relative overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 motion-safe:animate-pulse" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
                <div className="space-y-3 group">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-3 motion-safe:group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-transparent bg-gradient-to-br from-primary to-primary/80 bg-clip-text">
                    {t("landing.builtForDevelopers.stats.setupTime.value")}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {t("landing.builtForDevelopers.stats.setupTime.label")}
                  </div>
                  <div className="text-xs text-muted-foreground/80">
                    {t(
                      "landing.builtForDevelopers.stats.setupTime.description",
                    )}
                  </div>
                </div>

                <div className="space-y-3 group">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl flex items-center justify-center mb-3 motion-safe:group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-4xl font-bold text-transparent bg-gradient-to-br from-green-600 to-green-500 bg-clip-text">
                    {t("landing.builtForDevelopers.stats.typeSafe.value")}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {t("landing.builtForDevelopers.stats.typeSafe.label")}
                  </div>
                  <div className="text-xs text-muted-foreground/80">
                    {t("landing.builtForDevelopers.stats.typeSafe.description")}
                  </div>
                </div>

                <div className="space-y-3 group">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center mb-3 motion-safe:group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-transparent bg-gradient-to-br from-blue-600 to-blue-500 bg-clip-text">
                    {t(
                      "landing.builtForDevelopers.stats.configHeadaches.value",
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {t(
                      "landing.builtForDevelopers.stats.configHeadaches.label",
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground/80">
                    {t(
                      "landing.builtForDevelopers.stats.configHeadaches.description",
                    )}
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full motion-safe:animate-ping" />
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-500/30 rounded-full motion-safe:animate-ping delay-1000" />
            </div>
          </div>
        </div>
      </section>
    );
  },
);
