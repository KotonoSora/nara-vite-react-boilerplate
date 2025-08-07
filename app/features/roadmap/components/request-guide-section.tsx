import { type FC } from "react";
import { 
  Search, 
  FileText, 
  MessageSquare, 
  Users, 
  Copy,
  ExternalLink,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { useI18n } from "~/lib/i18n";

import type { RequestGuide } from "../types";

interface RequestGuideProps {
  guide: RequestGuide;
}

export const RequestGuideSection: FC<RequestGuideProps> = ({ guide }) => {
  const { t } = useI18n();

  const stepIcons = [Search, FileText, MessageSquare, Users];

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(guide.template.content);
    // You could add a toast notification here
  };

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("roadmap.sections.requestGuide.title")}
          </h2>
          <p className="text-xl text-primary font-medium mb-4">
            {t("roadmap.sections.requestGuide.subtitle")}
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("roadmap.sections.requestGuide.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Steps */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">How to Request a Feature</h3>
            {Object.entries(guide.steps).map(([key, step], index) => {
              const Icon = stepIcons[index];
              return (
                <div key={key} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">
                      {step.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* CTA Button */}
            <div className="pt-6">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <a
                  href="https://github.com/KotonoSora/nara-vite-react-boilerplate/issues/new/choose"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  {t("roadmap.cta.createIssue")}
                </a>
              </Button>
            </div>
          </div>

          {/* Template and Guidelines */}
          <div className="space-y-8">
            {/* Template */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  {guide.template.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {guide.template.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 relative">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {guide.template.content}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyTemplate}
                    className="absolute top-2 right-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  {guide.guidelines.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(guide.guidelines.items).map(([key, item]) => (
                    <div key={key} className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};