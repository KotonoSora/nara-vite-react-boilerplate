import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@kotonosora/ui/components/ui/card";

import type { FeatureCardProps } from "../types/type";

import { getIconComponent } from "../utils/get-icon-component";

export function FeatureCard({ config }: FeatureCardProps) {
  const { icon: iconName, title, description, colors } = config;
  const Icon = getIconComponent(iconName);

  return (
    <Card
      className={`border-2 border-primary/20 bg-linear-to-br from-background via-background ${colors.background} relative overflow-hidden`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br from-${colors.primary}/5 to-transparent`}
      />
      <CardHeader className="pb-4 relative">
        <div
          className={`w-12 h-12 bg-linear-to-br from-${colors.primary}/20 to-${colors.secondary}/20 rounded-lg flex items-center justify-center mb-4`}
        >
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <CardTitle className={`text-xl ${colors.hover}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
