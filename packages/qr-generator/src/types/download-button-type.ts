import { QRCodeFormat } from "./format-type";

export type QRDownloadButtonsProps = {
  onDownload: (format: QRCodeFormat) => void;
};
