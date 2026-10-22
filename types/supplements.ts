/** Catálogo de suplementos (data/supplements.ts). Sin pasarela de pago: el pedido va por WhatsApp. */

export type SupplementCategoryId = "salud-osea" | "articular" | "bienestar";

export interface SupplementCategory {
  id: SupplementCategoryId;
  name: string;
  /** Texto neutro: qué tipo de productos agrupa. Sin beneficios terapéuticos ni de prevención. */
  description: string;
}

export type SupplementStatus = "disponible" | "agotado" | "por-confirmar";

export interface Supplement {
  id: string;
  name: string;
  category: SupplementCategoryId;
  /** "Frasco x 60 tabletas" */
  presentation: string;
  /** En soles (S/). null = por confirmar. */
  price: number | null;
  /** Registro sanitario (DIGEMID). null = por confirmar: no se publica el producto sin revisarlo. */
  sanitaryRegistry: string | null;
  status: SupplementStatus;
}
