export type PageInformation = {
  title: string;
  description: string;
};

export type QRCodeFormat = "png" | "jpg";

export type QRCodeOptions = {
  size: number;
  level: "L" | "M" | "Q" | "H";
  marginSize: number;
};
