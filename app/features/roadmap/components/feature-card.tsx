import { type FC } from "react";
import { CheckCircle, Clock, Search, Settings, Zap } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

import type { RoadmapFeature } from "../types";

interface FeatureCardProps {
  feature: RoadmapFeature;
  className?: string;
}

const statusConfig = {
  "Stable": {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/50",
    borderColor: "border-green-200 dark:border-green-800",
    badge: "default",
  },
  "In Progress": {
    icon: Settings,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
    badge: "default",
  },
  "Planning": {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/50",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    badge: "outline",
  },
  "Research": {
    icon: Search,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
    borderColor: "border-purple-200 dark:border-purple-800",
    badge: "outline",
  },
  "Planned": {
    icon: Zap,
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-950/50",
    borderColor: "border-gray-200 dark:border-gray-800",
    badge: "outline",
  },
} as const;

const badgeConfig = {
  "New": {
    color: "bg-emerald-500 text-white",
    text: "New",
  },
  "Popular": {
    color: "bg-orange-500 text-white",
    text: "Popular",
  },
  "Community Requested": {
    color: "bg-purple-500 text-white",
    text: "Community",
  },
  "Experimental": {
    color: "bg-yellow-500 text-white",
    text: "Experimental",
  },
} as const;

export const FeatureCard: FC<FeatureCardProps> = ({ feature, className }) => {
  const statusInfo = statusConfig[feature.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-200",
        statusInfo.bgColor,
        statusInfo.borderColor,
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold mb-2 flex items-center gap-2">
              <StatusIcon className={cn("h-4 w-4", statusInfo.color)} />
              {feature.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={statusInfo.badge as any} className="text-xs">
                {feature.status}
              </Badge>
              {feature.eta && (
                <span className="text-xs text-muted-foreground">
                  ETA: {feature.eta}
                </span>
              )}
            </div>
          </div>
          {feature.badge && (
            <Badge 
              className={cn(
                "text-xs ml-2",
                badgeConfig[feature.badge].color
              )}
            >
              {badgeConfig[feature.badge].text}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
};