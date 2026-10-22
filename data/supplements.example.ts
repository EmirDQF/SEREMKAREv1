import type { Supplement } from "@/types/supplements";

/**
 * SOLO PARA ILUSTRAR EL DISEÑO. NO SE IMPORTA EN NINGUNA PÁGINA NI SE PUBLICA.
 * Productos genéricos de ejemplo, sin marcas, precios, registros ni stock reales.
 * Para probar el diseño en local: copiar a CONFIRMED_SUPPLEMENTS (data/supplements.ts) y activar
 * visibility.supplementsCatalog, sin hacer commit de ese cambio.
 */
export const EXAMPLE_SUPPLEMENTS: readonly Supplement[] = [
  {
    id: "ejemplo-1",
    name: "Producto de ejemplo A",
    category: "salud-osea",
    presentation: "Frasco x 60 tabletas",
    price: null,
    sanitaryRegistry: "EJEMPLO-0000",
    status: "por-confirmar",
  },
  {
    id: "ejemplo-2",
    name: "Producto de ejemplo B",
    category: "articular",
    presentation: "Caja x 30 sobres",
    price: null,
    sanitaryRegistry: "EJEMPLO-0001",
    status: "por-confirmar",
  },
  {
    id: "ejemplo-3",
    name: "Producto de ejemplo C",
    category: "bienestar",
    presentation: "Frasco x 90 cápsulas",
    price: null,
    sanitaryRegistry: "EJEMPLO-0002",
    status: "por-confirmar",
  },
];
