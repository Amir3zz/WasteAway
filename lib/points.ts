export type WasteCategory = "EDIBLE_SURPLUS" | "ORGANIC_COMPOST";

const POINTS_PER_KG: Record<WasteCategory, number> = {
  EDIBLE_SURPLUS: 12,
  ORGANIC_COMPOST: 8,
};

export function calculatePoints(
  category: WasteCategory,
  weightKg: number,
): number {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return 0;
  }

  const pointsPerKg = POINTS_PER_KG[category];

  return Math.max(1, Math.round(weightKg * pointsPerKg));
}

export function getPointsPerKg(category: WasteCategory): number {
  return POINTS_PER_KG[category];
}
