import { QRCodeOptions } from "./format-type";

export type QROptionsSectionProps = {
  options: QRCodeOptions;
  onUpdateOptions: (newOptions: Partial<QRCodeOptions>) => void;
};
