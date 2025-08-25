import { Layers, Shield, Wrench, Zap } from "lucide-react";

import type { LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  zap: Zap,
  shield: Shield,
  wrench: Wrench,
  layers: Layers,
};

/**
 * Get the Lucide icon component by name.
 *
 * @param iconName The name of the icon.
 * @returns The Lucide icon component.
 */
export const getIconComponent = (iconName: string): LucideIcon => {
  return icons[iconName] || Shield; // fallback to Shield if icon not found
};
