export type PageInformation = {
  title: string;
  description: string;
  language: string;
};

export type QRCodeFormat = "png" | "jpg";

export type QRCodeOptions = {
  size: number;
  level: "L" | "M" | "Q" | "H";
  includeMargin: boolean;
};
