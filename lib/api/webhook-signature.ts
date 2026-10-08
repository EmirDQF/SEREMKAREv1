import { createHmac, timingSafeEqual } from "node:crypto";

const HEX_SHA256_LENGTH = 64;

/**
 * Verifica la firma de un webhook de Cal.com: HMAC-SHA256 (hex) del cuerpo crudo con el
 * secreto, enviado en la cabecera `x-cal-signature-256`. Comparación en tiempo constante.
 */
export function verifyCalcomSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!secret || !signature || signature.length !== HEX_SHA256_LENGTH || !/^[0-9a-f]+$/i.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const received = Buffer.from(signature, "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}
