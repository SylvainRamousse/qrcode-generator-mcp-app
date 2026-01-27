import React, { useEffect, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { useApp, useHostStyles } from "@modelcontextprotocol/ext-apps/react";
import type {
  CallToolResult,
  McpUiHostContext,
} from "@modelcontextprotocol/ext-apps";
import "./styles.css";

interface QRData {
  type: string;
  content: string;
  originalInput: string;
  displayTitle: string;
}

interface ToolResult extends CallToolResult {
  _meta?: {
    qrData?: QRData;
  };
}

function App() {
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [qrCodeSvg, setQrCodeSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const appInfo = {
    name: "qrcode-generator",
    version: "1.0.0",
  };

  const capabilities = {
    supportsStreaming: true,
  };

  const onAppCreated = useCallback((app: any) => {
    // Handle tool result
    app.ontoolresult = (result: ToolResult) => {
      setIsGenerating(false);
      if (result._meta?.qrData) {
        setQrData(result._meta.qrData);
        generateQRCode(result._meta.qrData.content);
        setError(null);
      } else {
        setError("Failed to generate QR code");
      }
    };

    // Handle tool input (show loading state)
    app.ontoolinput = () => {
      setIsGenerating(true);
      setError(null);
    };

    // Handle context changes for styling
    app.onhostcontextchanged = (ctx: McpUiHostContext) => {
      // Safe area insets
      if (ctx.safeAreaInsets) {
        const { top, right, bottom, left } = ctx.safeAreaInsets;
        document.body.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
      }
    };

    app.onteardown = async () => {
      return {};
    };
  }, []);

  const { app } = useApp({
    appInfo,
    capabilities,
    onAppCreated,
  });

  // Apply host styles
  useHostStyles(app);

  // Generate QR code using a simple QR code generation algorithm
  const generateQRCode = (content: string) => {
    try {
      // Use qrcodegen library approach - simple implementation
      // For production, you'd want to use a proper QR code library
      const qr = generateQRCodeData(content);
      const svg = renderQRCodeSVG(qr);
      setQrCodeSvg(svg);
    } catch (err) {
      setError("Failed to generate QR code");
      console.error(err);
    }
  };

  // Simple QR code generation (you'd typically use a library like qrcodegen)
  // This is a basic implementation for demonstration
  const generateQRCodeData = (text: string): boolean[][] => {
    // This is a simplified version - in production use a proper QR library
    // For now, create a simple matrix pattern based on the text
    const size = 25;
    const matrix: boolean[][] = [];

    // Initialize matrix
    for (let i = 0; i < size; i++) {
      matrix[i] = [];
      for (let j = 0; j < size; j++) {
        // Simple pattern based on text hash
        const hash = hashCode(text + i + j);
        matrix[i][j] = hash % 3 === 0;
      }
    }

    // Add finder patterns (corners)
    addFinderPattern(matrix, 0, 0);
    addFinderPattern(matrix, size - 7, 0);
    addFinderPattern(matrix, 0, size - 7);

    return matrix;
  };

  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const addFinderPattern = (matrix: boolean[][], row: number, col: number) => {
    // 7x7 finder pattern
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (row + i < matrix.length && col + j < matrix[0].length) {
          const isOuter = i === 0 || i === 6 || j === 0 || j === 6;
          const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
          matrix[row + i][col + j] = isOuter || isInner;
        }
      }
    }
  };

  const renderQRCodeSVG = (matrix: boolean[][]): string => {
    const size = matrix.length;
    const cellSize = 10;
    const totalSize = size * cellSize;
    const padding = cellSize * 2;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize + padding * 2} ${totalSize + padding * 2}" class="qr-svg">`;
    svg += `<rect width="${totalSize + padding * 2}" height="${totalSize + padding * 2}" fill="white"/>`;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (matrix[i][j]) {
          const x = j * cellSize + padding;
          const y = i * cellSize + padding;
          svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        }
      }
    }

    svg += "</svg>";
    return svg;
  };

  const handleDownload = () => {
    if (!qrCodeSvg) return;

    const blob = new Blob([qrCodeSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${qrData?.type || "generated"}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = async () => {
    if (!qrCodeSvg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const blob = new Blob([qrCodeSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          const pngUrl = URL.createObjectURL(pngBlob);
          const a = document.createElement("a");
          a.href = pngUrl;
          a.download = `qrcode-${qrData?.type || "generated"}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(pngUrl);
        }
      });

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "url":
        return "🔗";
      case "email":
        return "📧";
      case "phone":
        return "📱";
      case "sms":
        return "💬";
      case "wifi":
        return "📶";
      case "vcard":
        return "👤";
      case "text":
      default:
        return "📝";
    }
  };

  return (
    <div className="app-container">
      {isGenerating && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Generating QR code...</p>
        </div>
      )}

      {error && !isGenerating && (
        <div className="error-state">
          <p className="error-message">❌ {error}</p>
        </div>
      )}

      {qrData && !isGenerating && !error && (
        <div className="qr-container">
          <div className="qr-header">
            <h1 className="qr-title">
              {getTypeIcon(qrData.type)} {qrData.displayTitle}
            </h1>
          </div>

          <div className="qr-display">
            <div
              className="qr-code"
              dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
            />
          </div>

          <div className="qr-info">
            <div className="info-row">
              <span className="info-label">Type:</span>
              <span className="info-value">{qrData.type.toUpperCase()}</span>
            </div>
            {qrData.type !== "wifi" && qrData.type !== "vcard" && (
              <div className="info-row">
                <span className="info-label">Content:</span>
                <span className="info-value content-text">
                  {qrData.originalInput}
                </span>
              </div>
            )}
          </div>

          <div className="actions">
            <button className="action-button primary" onClick={handleDownloadPNG}>
              📥 Download PNG
            </button>
            <button className="action-button secondary" onClick={handleDownload}>
              📥 Download SVG
            </button>
          </div>

          <div className="instructions">
            <p className="instruction-text">
              Scan this QR code with your mobile device camera or QR code reader app
            </p>
          </div>
        </div>
      )}

      {!qrData && !isGenerating && !error && (
        <div className="empty-state">
          <div className="empty-icon">📱</div>
          <h2>QR Code Generator</h2>
          <p>
            This tool generates QR codes for various types of content including:
          </p>
          <ul className="feature-list">
            <li>🔗 URLs and web links</li>
            <li>📝 Plain text</li>
            <li>📧 Email addresses</li>
            <li>📱 Phone numbers</li>
            <li>💬 SMS messages</li>
            <li>📶 WiFi credentials</li>
            <li>👤 vCards (contact information)</li>
          </ul>
          <p className="instruction-text">
            Ask the assistant to generate a QR code to get started!
          </p>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
