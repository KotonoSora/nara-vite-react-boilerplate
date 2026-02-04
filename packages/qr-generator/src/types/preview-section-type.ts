import { type RefObject } from "react";

import { QRCodeOptions } from "./format-type";

export type QRPreviewSectionProps = {
  qrRef: RefObject<HTMLDivElement | null>;
  text: string;
  options: QRCodeOptions;
};
