import { formatLimaDateTime } from "@/lib/lima-format";

/**
 * Confirmación de cita por WhatsApp Cloud API (opcional). Solo se activa si existen
 * WHATSAPP_CLOUD_TOKEN y WHATSAPP_PHONE_ID; la plantilla debe estar aprobada por Meta
 * (ver docs/CONFIGURAR-CITAS.md). Nunca incluye síntomas ni el motivo de la consulta.
 */

export interface WhatsAppCloudConfig {
  token: string;
  phoneId: string;
  templateName: string;
  languageCode: string;
  graphVersion: string;
}

/** WHATSAPP_CLOUD_TOKEN, WHATSAPP_PHONE_ID, WHATSAPP_TEMPLATE_NAME, WHATSAPP_TEMPLATE_LANG, WHATSAPP_GRAPH_VERSION. */
type WhatsAppEnv = Readonly<Record<string, string | undefined>>;

const DEFAULT_TEMPLATE = "confirmacion_cita";
const DEFAULT_LANG = "es";
/** Versión de la Graph API; configurable si Meta publica una nueva. */
const DEFAULT_GRAPH_VERSION = "v21.0";
const REQUEST_TIMEOUT_MS = 10_000;

export function whatsappCloudConfig(env: WhatsAppEnv): WhatsAppCloudConfig | null {
  const token = env.WHATSAPP_CLOUD_TOKEN?.trim();
  const phoneId = env.WHATSAPP_PHONE_ID?.trim();
  if (!token || !phoneId) return null;
  return {
    token,
    phoneId,
    templateName: env.WHATSAPP_TEMPLATE_NAME?.trim() || DEFAULT_TEMPLATE,
    languageCode: env.WHATSAPP_TEMPLATE_LANG?.trim() || DEFAULT_LANG,
    graphVersion: env.WHATSAPP_GRAPH_VERSION?.trim() || DEFAULT_GRAPH_VERSION,
  };
}

interface ConfirmationInput {
  phone: string;
  name: string;
  startTime: string;
}

export function buildTemplatePayload(config: WhatsAppCloudConfig, input: ConfirmationInput) {
  return {
    messaging_product: "whatsapp",
    to: input.phone.replace(/\D/g, ""),
    type: "template",
    template: {
      name: config.templateName,
      language: { code: config.languageCode },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: input.name.trim().split(/\s+/)[0] || "paciente" },
            { type: "text", text: formatLimaDateTime(input.startTime) },
          ],
        },
      ],
    },
  };
}

/** Envía la plantilla. Devuelve true si Meta la aceptó (sin lanzar errores hacia el webhook). */
export async function sendBookingConfirmation(config: WhatsAppCloudConfig, input: ConfirmationInput): Promise<boolean> {
  try {
    const response = await fetch(`https://graph.facebook.com/${config.graphVersion}/${config.phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(buildTemplatePayload(config, input)),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return response.ok;
  } catch {
    return false;
  }
}
