import type { QRCodeFormat } from "../types/type";

/**
 * Downloads a QR code as an image file (PNG or JPG)
 */
export const downloadQRCode = (
  svg: SVGElement,
  format: QRCodeFormat,
  size: number,
): void => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const svgData = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  const svgBlob = new Blob([svgData], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    canvas.width = size;
    canvas.height = size;

    // For JPG, fill white background
    if (format === "jpg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `qrcode.${format}`;
        link.href = downloadUrl;
        link.click();
        URL.revokeObjectURL(downloadUrl);
      },
      format === "jpg" ? "image/jpeg" : "image/png",
      1.0,
    );
  };

  img.src = url;
};
