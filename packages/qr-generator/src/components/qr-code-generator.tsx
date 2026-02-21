import { useQRGenerator } from "../hooks/use-qr-generator";
import { QRDownloadButtons } from "./qr-download-buttons";
import { QREmptyState } from "./qr-empty-state";
import { QRInputSection } from "./qr-input-section";
import { QROptionsSection } from "./qr-options-section";
import { QRPreviewSection } from "./qr-preview-section";

export function QRCodeGenerator({
  isProd,
  trackingId,
}: {
  isProd: boolean;
  trackingId: string | undefined;
}) {
  const {
    qrRef,
    text,
    options,
    maxLength,
    handleTextChange,
    handleDownload,
    updateOptions,
  } = useQRGenerator({
    isProd,
    trackingId,
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="space-y-4 p-6 bg-card rounded-lg border">
        <QRInputSection
          text={text}
          maxLength={maxLength}
          onTextChange={handleTextChange}
        />
        <QROptionsSection options={options} onUpdateOptions={updateOptions} />
      </div>

      {text ? (
        <>
          <QRPreviewSection qrRef={qrRef} text={text} options={options} />
          <div className="p-6 bg-card rounded-lg border">
            <QRDownloadButtons onDownload={handleDownload} />
          </div>
        </>
      ) : (
        <QREmptyState />
      )}
    </div>
  );
}
