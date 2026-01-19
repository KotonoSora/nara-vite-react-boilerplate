import { useTranslation } from "@kotonosora/i18n-react";
import { Check, Copy, Play, Terminal } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router";

import type { LandingPageContextType, Step } from "../types/type";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function GettingStartedSection() {
  const t = useTranslation();
  const { steps } = useLoaderData<LandingPageContextType>();
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = async (step: Step) => {
    try {
      const { command: text, number: stepNumber } = step;
      await navigator.clipboard.writeText(text);
      setCopiedStep(stepNumber);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleCopyClick = (step: Step) => {
    return () => copyToClipboard(step);
  };

  return (
    <section className="py-24 px-4 bg-linear-to-br from-muted/30 to-muted/10 relative content-visibility-auto">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[40px_40px]" />

      <div className="container mx-auto relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500/10 to-primary/10 border border-green-500/20 rounded-full text-sm font-medium text-green-600 dark:text-green-400 mb-6">
            <Play className="h-4 w-4" />
            {t("landing.gettingStarted.badge")}
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight sm:leading-snug md:leading-normal">
            {t("landing.gettingStarted.title")}
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("landing.gettingStarted.description")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(steps) &&
              steps.map((step) => (
                <Card
                  key={step.number}
                  className="border-2 border-primary/20 bg-linear-to-br from-background/80 to-background/60 backdrop-blur-sm"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
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
                          <code
                            className="text-foreground break-word pr-2 whitespace-pre-line"
                            dangerouslySetInnerHTML={{
                              __html: step.command,
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 cursor-pointer"
                            aria-label={
                              copiedStep === step.number
                                ? t("landing.gettingStarted.copied")
                                : t("landing.gettingStarted.copyCommand")
                            }
                            onClick={handleCopyClick(step)}
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
                          <span role="img" aria-label="Tip">
                            💡
                          </span>{" "}
                          {step.note}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Quick completion indicator */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500/10 to-primary/10 border border-green-500/20 rounded-full text-sm font-medium text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {t("landing.gettingStarted.setupTime")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
