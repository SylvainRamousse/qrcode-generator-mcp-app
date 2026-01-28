import { App } from "@modelcontextprotocol/ext-apps";
import QRCode from "qrcode";

const qrCanvas = document.getElementById("qrCanvas") as HTMLCanvasElement;
const encodedText = document.getElementById("encodedText") as HTMLElement;
const downloadBtn = document.getElementById("downloadBtn") as HTMLButtonElement;
const placeholder = document.getElementById("placeholder") as HTMLElement;
const qrContent = document.getElementById("qrContent") as HTMLElement;

function showQR(text: string) {
  QRCode.toCanvas(qrCanvas, text, {
    width: 280,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  }, (error) => {
    if (error) {
      console.error("QR generation failed:", error);
      return;
    }
    encodedText.textContent = text;
    placeholder.style.display = "none";
    qrContent.style.display = "flex";
  });
}

function downloadPNG() {
  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = qrCanvas.toDataURL("image/png");
  link.click();
}

// 1. Create app
const app = new App({ name: "QR Code Generator", version: "1.0.0" });

// 2. Register handlers BEFORE connect
app.ontoolinput = (params) => {
  const text = (params.arguments as { text?: string })?.text;
  if (text) {
    showQR(text);
  }
};

app.ontoolresult = (result) => {
  const { text } = (result.structuredContent as { text?: string }) ?? {};
  if (text) {
    showQR(text);
  }
};

app.onteardown = async () => ({ });
app.onerror = console.error;

// Download button
downloadBtn.addEventListener("click", downloadPNG);

// 3. Connect
app.connect();
