export function generateProductCode(): number {
  return Math.floor(10000000 + Math.random() * 90000000);
}

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// src/app/utils/utils.ts

export interface SKUData {
  brand_id: string | number;
  line_id: string | number;
  animal_id: string | number;
  animal_age_id: string | number;
  animal_size_id: string | number;
  weight?: string | number;
  extra_weight?: string | number;
}

export interface Entity {
  id: number;
  name: string;
}

/**
 * Genera el SKU con la lógica:
 *  - Marca: 3 primeras letras
 *  - Línea: 2 primeras letras
 *  - Animal/Edad/Tamaño: 1 letra especie + 3 edad + 3 tamaño
 *  - Peso
 *  - Sufijo "-E" si extra_weight > 0
 */
export function generateSKU(
  data: SKUData,
  brands: Entity[],
  lines: Entity[],
  animals: Entity[],
  animalAges: Entity[],
  animalSizes: Entity[]
): string {
  const { brand_id, line_id, animal_id, animal_age_id, animal_size_id, weight, extra_weight } =
    data;

  const brand = brands.find((b) => b.id === Number(brand_id));
  const line = lines.find((l) => l.id === Number(line_id));
  const animal = animals.find((a) => a.id === Number(animal_id));
  const age = animalAges.find((a) => a.id === Number(animal_age_id));
  const size = animalSizes.find((s) => s.id === Number(animal_size_id));

  const segments: string[] = [];

  // 1) Marca: 3 letras
  if (brand) {
    segments.push(brand.name.slice(0, 3).toUpperCase());
  }

  // 2) Línea: 2 letras
  if (line) {
    segments.push(line.name.slice(0, 2).toUpperCase());
  }

  // 3) Animal/Edad/Tamaño combinado
  if (animal || age || size) {
    const animalCode = animal?.name[0].toUpperCase() || "";
    const ageCode = age ? age.name.slice(0, 3).toUpperCase() : "";
    const sizeCode = size ? size.name.slice(0, 3).toUpperCase() : "";
    const combo = `${animalCode}${ageCode}${sizeCode}`;
    if (combo) segments.push(combo);
  }

  // 4) Peso
  if (weight !== undefined && weight !== null && String(weight).trim() !== "") {
    segments.push(String(weight));
  }

  // 5) Sufijo extra
  const hasExtra = parseFloat(String(extra_weight || "")) > 0;
  let sku = segments.join("-");
  if (hasExtra) {
    sku += "-E";
  }

  return sku;
}
