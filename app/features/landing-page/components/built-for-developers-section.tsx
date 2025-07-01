import { Code } from "lucide-react";
import { memo } from "react";

export const BuiltForDevelopersSection = memo(
  function BuiltForDevelopersSection() {
    return (
      <section
        className="py-16 px-4 bg-muted/30 relative"
        style={{ contentVisibility: "auto" }}
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-primary/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-600 dark:text-purple-400 mb-6">
              <Code className="h-4 w-4" />
              Built for Developers Who Ship
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need, Nothing You Don't
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card border-2 border-primary/60 rounded-xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">5min</div>
                  <div className="text-sm text-muted-foreground">
                    Setup time
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-700">100%</div>
                  <div className="text-sm text-muted-foreground">Type-safe</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-500">0</div>
                  <div className="text-sm text-muted-foreground">
                    Config headaches
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
);
