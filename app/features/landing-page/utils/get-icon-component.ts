import { Layers, Shield, Wrench, Zap } from "lucide-react";

import type { LucideIcon } from "lucide-react";

export const getIconComponent = (iconName: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    zap: Zap,
    shield: Shield,
    wrench: Wrench,
    layers: Layers,
  };

  return icons[iconName] || Shield; // fallback to Shield if icon not found
};
