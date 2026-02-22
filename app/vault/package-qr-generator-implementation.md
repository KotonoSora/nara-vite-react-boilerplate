---
title: "Package @kotonosora/qr-generator Implementation"
description: "QR code generation, rendering, and customization functionality"
date: "2026-02-22"
published: true
author: "Development Team"
tags: ["qr-code", "qr-generator", "barcode", "encoding"]
---

# @kotonosora/qr-generator Implementation

## Overview

`@kotonosora/qr-generator` provides QR code generation and rendering capabilities with customization options for colors, sizes, and error correction levels.

## Package Information

- **Name**: `@kotonosora/qr-generator`
- **Version**: 0.0.1
- **Type**: React component library
- **Location**: `packages/qr-generator/`
- **Dependencies**:
  - `@kotonosora/ui` (workspace) - UI components
  - `@kotonosora/i18n-react` (workspace) - Translations
  - `@kotonosora/google-analytics` (workspace) - Analytics
  - `react`, `react-dom` (19.2.4)
  - `lucide-react` (0.563.0) - Icons
  - `qrcode.react` (4.2.0) - QR code rendering

## Component Structure

```
packages/qr-generator/
├── src/
│   ├── components/
│   │   ├── QRCode.tsx              # Basic QR code component
│   │   ├── QRGenerator.tsx         # Interactive generator
│   │   ├── QRScanner.tsx           # QR code scanner
│   │   └── QRSettings.tsx          # Configuration panel
│   │
│   ├── hooks/
│   │   ├── useQRCode.ts            # QR code generation
│   │   ├── useQRScanner.ts         # Scanning functionality
│   │   └── useQRDownload.ts        # Export/download
│   │
│   ├── utils/
│   │   ├── generateQR.ts           # QR generation logic
│   │   ├── validateData.ts         # Input validation
│   │   └── formatQRData.ts         # Data formatting
│   │
│   ├── types/
│   │   └── qr.types.ts             # Type definitions
│   │
│   ├── styles/
│   │   └── custom.css              # QR-specific styles
│   │
│   └── index.ts
│
└── package.json
```

## Core Components

### QRCode

Basic QR code component:

```typescript
import { QRCode } from '@kotonosora/qr-generator'

export function SimpleQR() {
  return (
    <QRCode
      value="https://example.com"
      size={256}
      level="H"                    // Error correction level
      includeMargin={true}
      fgColor="#000000"
      bgColor="#FFFFFF"
    />
  )
}
```

**Props:**

- `value` - Data to encode (string/URL)
- `size` - Pixel size (integer)
- `level` - Error correction ('L', 'M', 'Q', 'H')
- `includeMargin` - Add quiet zone
- `fgColor` - Foreground (dark) color
- `bgColor` - Background (light) color
- `imageSettings` - Embed image in center

### QRGenerator

Interactive QR code generator with live preview:

```typescript
import { QRGenerator } from '@kotonosora/qr-generator'

export function GeneratorPage() {
  return (
    <QRGenerator
      onCodeGenerated={(qrCode) => {
        console.log('QR Code:', qrCode)
      }}
      presets={[
        { name: 'Website URL', prefix: 'https://' },
        { name: 'Phone Number', prefix: 'tel:' },
        { name: 'Email', prefix: 'mailto:' },
        { name: 'WiFi', prefix: 'WIFI:' }
      ]}
      allowDownload={true}
    />
  )
}
```

**Features:**

- Real-time preview
- Multiple input formats
- Color customization
- Size adjustment
- Download options

### QRScanner

QR code scanning component (requires camera):

```typescript
import { QRScanner } from '@kotonosora/qr-generator'
import { useState } from 'react'

export function ScanPage() {
  const [scanned, setScanned] = useState<string | null>(null)

  return (
    <QRScanner
      onScan={(result) => {
        setScanned(result)
      }}
      onError={(error) => {
        console.error('Scan error:', error)
      }}
      facingMode="environment"       // 'user' or 'environment'
      brightness={1}
    />
  )
}
```

### QRSettings

Configuration panel for QR code customization:

```typescript
import { QRSettings } from '@kotonosora/qr-generator'

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    size: 256,
    level: 'H',
    fgColor: '#000000',
    bgColor: '#FFFFFF'
  })

  return (
    <QRSettings
      value={settings}
      onChange={setSettings}
      presets={[
        { name: 'Print (300x300)', size: 300 },
        { name: 'Screen (256x256)', size: 256 },
        { name: 'Mobile (128x128)', size: 128 }
      ]}
    />
  )
}
```

## Custom Hooks

### useQRCode

Generate and manage QR codes:

```typescript
import { useQRCode } from '@kotonosora/qr-generator'

export function QRCodeManager() {
  const {
    qrCode,
    generate,
    regenerate,
    settings,
    updateSettings,
    dataUrl,
    isValidating
  } = useQRCode({ defaultValue: 'https://example.com' })

  return (
    <div>
      <input
        value={qrCode}
        onChange={(e) => generate(e.target.value)}
        placeholder="Enter URL or text"
      />

      <div>
        {isValidating && <span>Validating...</span>}
        {dataUrl && <img src={dataUrl} alt="QR Code" />}
      </div>
    </div>
  )
}
```

**Features:**

- Value validation
- Auto-regeneration
- Settings management
- Data URL export

### useQRScanner

Manage QR code scanning:

```typescript
import { useQRScanner } from '@kotonosora/qr-generator'
import { useRef } from 'react'

export function Scanner() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const {
    isScanning,
    startScan,
    stopScan,
    lastScanned,
    error
  } = useQRScanner(videoRef)

  return (
    <div>
      <button onClick={startScan}>Start Scan</button>
      <button onClick={stopScan}>Stop Scan</button>
      <video ref={videoRef} />
      {lastScanned && <p>Scanned: {lastScanned}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
```

### useQRDownload

Handle QR code export/download:

```typescript
import { useQRDownload } from '@kotonosora/qr-generator'

export function DownloadQR() {
  const {
    downloadPNG,
    downloadPDF,
    downloadSVG,
    copyBase64,
    print
  } = useQRDownload()

  return (
    <div>
      <button onClick={() => downloadPNG('qrcode')}>
        Download PNG
      </button>
      <button onClick={() => downloadPDF('qrcode')}>
        Download PDF
      </button>
      <button onClick={() => downloadSVG('qrcode')}>
        Download SVG
      </button>
      <button onClick={copyBase64}>
        Copy as Base64
      </button>
      <button onClick={print}>
        Print
      </button>
    </div>
  )
}
```

## QR Code Data Types

### Standard QR Data Formats

```typescript
// URL
const urlQR = "https://example.com";

// Email
const emailQR = "mailto:user@example.com?subject=Hello";

// Phone Number
const phoneQR = "tel:+1-555-0123";

// SMS
const smsQR = "smsto:+1-555-0123:Hello";

// WiFi (WPA)
const wifiQR = "WIFI:T:WPA;S:NetworkName;P:password;;";

// vCard (Contact)
const vcardQR = `BEGIN:VCARD
VERSION:3.0
FN:John Doe
TEL:+1-555-0123
EMAIL:john@example.com
END:VCARD`;

// Calendar Event (iCal)
const calQR = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20260222T090000Z
DTEND:20260222T100000Z
SUMMARY:Meeting
END:VEVENT
END:VCALENDAR`;

// Geo Location
const geoQR = "geo:37.7749,-122.4194";
```

## Usage Examples

### Basic QR Code

```typescript
import { QRCode } from '@kotonosora/qr-generator'

export function WebsiteQR() {
  return (
    <div>
      <h2>Visit Our Website</h2>
      <QRCode
        value="https://example.com"
        size={300}
        level="H"
      />
      <p>Scan with phone camera</p>
    </div>
  )
}
```

### Email QR Code

```typescript
import { QRCode } from '@kotonosora/qr-generator'

export function EmailQR() {
  const emailQR = 'mailto:contact@example.com?subject=Inquiry'

  return (
    <QRCode
      value={emailQR}
      size={200}
      level="M"
    />
  )
}
```

### Product Label

```typescript
import { QRCode } from '@kotonosora/qr-generator'

export function ProductLabel({ productId }) {
  const productUrl = `https://example.com/product/${productId}`

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <h3>Product Code</h3>
      <QRCode
        value={productUrl}
        size={150}
        level="H"
        imageSettings={{
          src: '/logo.png',
          height: 40,
          width: 40,
          excavate: true
        }}
      />
      <p>{productId}</p>
    </div>
  )
}
```

### WiFi Sharing

```typescript
import { QRGenerator } from '@kotonosora/qr-generator'
import { useState } from 'react'

export function ShareWiFi() {
  const [wifiSettings, setWifiSettings] = useState({
    ssid: '',
    password: '',
    security: 'WPA'
  })

  const wifiQR = `WIFI:T:${wifiSettings.security};S:${wifiSettings.ssid};P:${wifiSettings.password};;`

  return (
    <QRGenerator
      value={wifiQR}
      onCodeGenerated={(code) => {
        console.log('WiFi QR:', code)
      }}
    />
  )
}
```

### Event Registration

```typescript
import { QRCode } from '@kotonosora/qr-generator'

export function EventTicket({ eventId, ticketNumber }) {
  const ticketData = `TICKET:${eventId}-${ticketNumber}`

  return (
    <div className="ticket">
      <h2>Event Ticket</h2>
      <QRCode
        value={ticketData}
        size={200}
        level="H"
      />
      <p>Ticket: {ticketNumber}</p>
    </div>
  )
}
```

## Integration Examples

### With Analytics

```typescript
import { QRCode } from '@kotonosora/qr-generator'
import { useGoogleAnalytics } from '@kotonosora/google-analytics'

export function TrackedQR() {
  const { trackEvent } = useGoogleAnalytics()

  const handleDownload = () => {
    trackEvent('qr_code_downloaded', {
      type: 'website_url'
    })
  }

  return (
    <>
      <QRCode value="https://example.com" />
      <button onClick={handleDownload}>Download</button>
    </>
  )
}
```

### With i18n

```typescript
import { QRGenerator } from '@kotonosora/qr-generator'
import { useTranslation } from '@kotonosora/i18n-react'

export function LocalizedQRGenerator() {
  const { t } = useTranslation()

  return (
    <QRGenerator
      presets={[
        { name: t('qr.website'), prefix: 'https://' },
        { name: t('qr.email'), prefix: 'mailto:' },
        { name: t('qr.phone'), prefix: 'tel:' }
      ]}
    />
  )
}
```

## Error Correction Levels

| Level | Recovery Capacity | Use Case                     |
| ----- | ----------------- | ---------------------------- |
| **L** | ~7%               | Decorative, low damage risk  |
| **M** | ~15%              | General use, moderate damage |
| **Q** | ~25%              | Exposed to moisture/wear     |
| **H** | ~30%              | High damage risk, outdoor    |

Choose 'H' for outdoor/printed labels, 'L' for digital displays.

## Performance Tips

```typescript
// Memoize QR codes for large lists
import { useMemo } from 'react'

export function QRList({ items }) {
  const qrCodes = useMemo(
    () => items.map(item => ({ id: item.id, url: item.url })),
    [items]
  )

  return qrCodes.map(qr => (
    <QRCode key={qr.id} value={qr.url} />
  ))
}
```

## Styling

```css
.qr-container {
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  text-align: center;
}

.qr-code {
  display: inline-block;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
}

.qr-settings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}
```

## Testing

```typescript
import { render, screen } from '@testing-library/react'
import { QRCode } from '@kotonosora/qr-generator'

describe('QRCode', () => {
  it('renders QR code', () => {
    render(<QRCode value="https://example.com" />)
    const svg = screen.getByRole('img', { hidden: true })
    expect(svg).toBeInTheDocument()
  })
})
```

## Best Practices

1. **Use appropriate error correction level** based on environment
2. **Include quiet zone** (margin) for reliable scanning
3. **Test with multiple scanners** before deployment
4. **Size appropriately** for distance (1cm per meter of distance)
5. **Provide fallback** (print URL alongside QR)
6. **Validate input data** before encoding
7. **Consider color contrast** for print/digital
8. **Track scans** with analytics for insights

---

The QR generator package provides flexible, robust QR code generation for various use cases in the NARA ecosystem.
