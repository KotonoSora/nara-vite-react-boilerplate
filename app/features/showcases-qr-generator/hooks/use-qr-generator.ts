import { useRef, useState } from "react";

import type { QRCodeFormat, QRCodeOptions } from "../types/type";

import {
  DEFAULT_QR_OPTIONS,
  QR_MAX_DATA_LENGTH,
} from "../constants/qr-options";
import { downloadQRCode } from "../utils/download-qr-code";

export const useQRGenerator = () => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>("");
  const [options, setOptions] = useState<QRCodeOptions>(DEFAULT_QR_OPTIONS);
  const maxLength = QR_MAX_DATA_LENGTH[options.level] || QR_MAX_DATA_LENGTH.H;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setText(value.substring(0, maxLength));
    }
  };

  const handleDownload = (format: QRCodeFormat) => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg || !text) return;

    downloadQRCode(svg, format, options.size);
  };

  const updateOptions = (newOptions: Partial<QRCodeOptions>) => {
    // Update text limit by level
    if (!!newOptions.level && newOptions.level !== options.level) {
      const maxLength =
        QR_MAX_DATA_LENGTH[newOptions.level] || QR_MAX_DATA_LENGTH.H;

      setText((prev) => prev.substring(0, maxLength));
    }

    // Update options settings
    setOptions((prev) => ({ ...prev, ...newOptions }));
  };

  return {
    qrRef,
    text,
    options,
    maxLength,
    handleTextChange,
    handleDownload,
    updateOptions,
  };
};
