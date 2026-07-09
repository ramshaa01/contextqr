const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function generateQRCodes() {
  const outputDir = path.join(__dirname, '..', 'public', 'qr');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Placeholder deployed URL for now
  const baseUrl = 'https://contextqr-demo.vercel.app';

  const zones = [
    { name: 'gate', url: `${baseUrl}/scan/gate?zone=zone-gate-a` },
    { name: 'seat', url: `${baseUrl}/scan/seat?zone=zone-seat-101` },
    { name: 'medical', url: `${baseUrl}/scan/medical-post?zone=zone-medical-1` }
  ];

  for (const zone of zones) {
    try {
      const outputPath = path.join(outputDir, `${zone.name}.png`);
      await QRCode.toFile(outputPath, zone.url, {
        color: {
          dark: '#0b1e3d',  // Navy background color for the dots
          light: '#ffffff' // Transparent or white background
        },
        width: 300,
        margin: 2
      });
      console.log(`✅ Generated QR for ${zone.name}: ${outputPath}`);
    } catch (err) {
      console.error(`❌ Failed to generate QR for ${zone.name}`, err);
    }
  }
}

generateQRCodes();
