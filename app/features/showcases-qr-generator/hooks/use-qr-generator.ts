import { useRef, useState } from "react";

import type { QRCodeFormat, QRCodeOptions } from "../types/type";

import { DEFAULT_QR_OPTIONS, MAX_QR_LENGTH } from "../constants/qr-options";
import { downloadQRCode } from "../utils/download-qr-code";

export const useQRGenerator = () => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>("");
  const [options, setOptions] = useState<QRCodeOptions>(DEFAULT_QR_OPTIONS);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_QR_LENGTH) {
      setText(value);
    }
  };

  const handleDownload = (format: QRCodeFormat) => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg || !text) return;

    downloadQRCode(svg, format, options.size);
  };

  const updateOptions = (newOptions: Partial<QRCodeOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOptions }));
  };

  return {
    qrRef,
    text,
    options,
    handleTextChange,
    handleDownload,
    updateOptions,
  };
};
