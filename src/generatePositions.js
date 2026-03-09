// Tile size — all images are placed within a [0, TILE_SIZE] x [0, TILE_SIZE] area
// This tile then repeats infinitely in all directions
export const TILE_SIZE = 3500;

const IMAGE_SIZES = [
  { w: 250, h: 350 },
  { w: 300, h: 200 },
  { w: 200, h: 200 },
  { w: 350, h: 250 },
  { w: 280, h: 380 },
  { w: 220, h: 300 },
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rectsOverlap(a, b, padding = 40) {
  return !(
    a.x + a.w + padding < b.x ||
    b.x + b.w + padding < a.x ||
    a.y + a.h + padding < b.y ||
    b.y + b.h + padding < a.y
  );
}

export function generateImagePositions(count) {
  const positions = [];
  let attempts = 0;
  const maxAttempts = count * 80;

  // Place images within the tile, with margin so they don't clip at edges
  const margin = 60;

  while (positions.length < count && attempts < maxAttempts) {
    const size = IMAGE_SIZES[randomBetween(0, IMAGE_SIZES.length - 1)];
    const candidate = {
      x: randomBetween(margin, TILE_SIZE - margin - size.w),
      y: randomBetween(margin, TILE_SIZE - margin - size.h),
      w: size.w,
      h: size.h,
      rotation: randomBetween(-6, 6),
    };

    const overlaps = positions.some((p) => rectsOverlap(candidate, p));
    if (!overlaps) {
      positions.push(candidate);
    }
    attempts++;
  }

  return positions;
}
