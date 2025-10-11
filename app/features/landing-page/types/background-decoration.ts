export type FloatingElement = {
  id: string;
  size: "sm" | "md" | "lg";
  color: "primary" | "green" | "yellow" | "purple";
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  delay: number;
};

export type BackgroundDecorationProps = {
  elements: FloatingElement[];
  className?: string;
};
