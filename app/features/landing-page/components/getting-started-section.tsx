import { Check, Copy, Play, Terminal } from "lucide-react";
import { memo, useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { usePageContext } from "../context/page-context";

export const GettingStartedSection = memo(function GettingStartedSection() {
  const { steps } = usePageContext();
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = async (text: string, stepNumber: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(stepNumber);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <section
      className="py-24 px-4 bg-gradient-to-br from-muted/30 to-muted/10 relative"
      style={{ contentVisibility: "auto" }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />

      <div className="container mx-auto relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-primary/10 border border-green-500/20 rounded-full text-sm font-medium text-green-600 dark:text-green-400 mb-6">
            <Play className="h-4 w-4" />
            Get Started in Minutes
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            From Zero to Production
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Follow these simple steps to get your NARA application up and
            running
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <Card
                key={step.number}
                className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm group"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {step.number}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="relative">
                    <div className="bg-muted/50 border border-border rounded-lg p-4 font-mono text-sm">
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <Terminal className="h-4 w-4" />
                        <span className="text-xs">Terminal</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-foreground break-all pr-2">
                          {step.command}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                          onClick={() =>
                            copyToClipboard(step.command, step.number)
                          }
                        >
                          {copiedStep === step.number ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {step.note && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        💡 {step.note}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick completion indicator */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/10 to-primary/10 border border-green-500/20 rounded-full text-sm font-medium text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Estimated setup time: ~5 minutes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
