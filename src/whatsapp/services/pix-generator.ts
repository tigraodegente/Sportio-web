// PIX QR Code payload generator (BR Code / EMV standard)
// Generates the "copia e cola" PIX string
import { whatsappConfig } from "../config";

interface PixPayloadInput {
  amount: number; // in BRL (e.g., 5.00)
  description?: string;
  txId?: string;
}

/**
 * Generates a PIX "copia e cola" payload string following BR Code (EMV) specification.
 * This can be sent as text in WhatsApp for the user to copy and pay.
 */
export function generatePixPayload(input: PixPayloadInput): string {
  const { pix } = whatsappConfig;

  if (!pix.key) {
    return `PIX: ${pix.merchantName} | R$${input.amount.toFixed(2)} | Chave nao configurada`;
  }

  const pixKey = pix.key;
  const merchantName = pix.merchantName.substring(0, 25);
  const merchantCity = pix.merchantCity.substring(0, 15);
  const txId = (input.txId ?? generateTxId()).substring(0, 25);
  const amount = input.amount.toFixed(2);

  // Build EMV TLV payload
  const merchantAccountInfo = buildTLV("00", "br.gov.bcb.pix") + buildTLV("01", pixKey);

  const payload =
    buildTLV("00", "01") + // Payload Format Indicator
    buildTLV("26", merchantAccountInfo) + // Merchant Account Information
    buildTLV("52", "0000") + // Merchant Category Code
    buildTLV("53", "986") + // Transaction Currency (BRL)
    buildTLV("54", amount) + // Transaction Amount
    buildTLV("58", "BR") + // Country Code
    buildTLV("59", merchantName) + // Merchant Name
    buildTLV("60", merchantCity) + // Merchant City
    buildTLV("62", buildTLV("05", txId)); // Additional Data (txId)

  // Add CRC16 placeholder and compute
  const payloadWithCRC = payload + "6304";
  const crc = computeCRC16(payloadWithCRC);

  return payloadWithCRC + crc;
}

function buildTLV(id: string, value: string): string {
  const length = value.length.toString().padStart(2, "0");
  return `${id}${length}${value}`;
}

function generateTxId(): string {
  return `SP${Date.now().toString(36).toUpperCase()}`;
}

/**
 * CRC-16/CCITT-FALSE computation for PIX EMV payloads
 */
function computeCRC16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  crc &= 0xffff;
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Get human-readable PIX info for display
 */
export function getPixInfo(input: PixPayloadInput): {
  key: string;
  amount: string;
  merchantName: string;
  qrPayload: string;
} {
  return {
    key: whatsappConfig.pix.key,
    amount: `R$${input.amount.toFixed(2)}`,
    merchantName: whatsappConfig.pix.merchantName,
    qrPayload: generatePixPayload(input),
  };
}
