import { Layers, Shield, Wrench, Zap } from "lucide-react";

import type { LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  zap: Zap,
  shield: Shield,
  wrench: Wrench,
  layers: Layers,
};

export const getIconComponent = (iconName: string): LucideIcon => {
  return icons[iconName] || Shield; // fallback to Shield if icon not found
};
