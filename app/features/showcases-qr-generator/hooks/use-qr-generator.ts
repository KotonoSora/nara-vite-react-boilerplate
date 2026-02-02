import { trackCustomEvents } from "@kotonosora/google-analytics";
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

    trackCustomEvents({
      isProd: import.meta.env.PROD,
      trackingId: import.meta.env.VITE_GOOGLE_ANALYTIC_TRACKING_ID,
      event: {
        event_category: "QR Generator",
        event_label: "QR Code Downloaded",
        event_action: "download",
        event_value_format: format,
        event_value_text: text.substring(0, 100),
        event_value_text_length: text.length,
        event_value_size: options.size,
        event_value_level: options.level,
        event_value_margin_size: options.marginSize,
      },
    });

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
