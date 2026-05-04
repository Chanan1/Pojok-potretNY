/**
 * Detects transparent regions in a canvas image and returns bounding boxes
 * as percentage-based slot positions.
 */
export function detectTransparentSlots(
  dataUrl: string,
  maxSlots: number = 8
): Promise<{ x: number; y: number; width: number; height: number }[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve([]);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { width, height, data } = imageData;

      // Create a visited map
      const visited = new Uint8Array(width * height);

      // Find connected transparent regions using flood fill
      const regions: { minX: number; minY: number; maxX: number; maxY: number; area: number }[] = [];

      const isTransparent = (x: number, y: number) => {
        const i = (y * width + x) * 4;
        return data[i + 3] < 30; // Alpha < 30 considered transparent
      };

      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          const pidx = py * width + px;
          if (visited[pidx] || !isTransparent(px, py)) continue;

          // Flood fill to find connected transparent region
          let minX = px, maxX = px, minY = py, maxY = py;
          let area = 0;
          const stack: [number, number][] = [[px, py]];

          while (stack.length > 0) {
            const [x, y] = stack.pop()!;
            const idx = y * width + x;

            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            if (visited[idx]) continue;
            if (!isTransparent(x, y)) continue;

            visited[idx] = 1;
            area++;

            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);

            stack.push([x + 1, y]);
            stack.push([x - 1, y]);
            stack.push([x, y + 1]);
            stack.push([x, y - 1]);
          }

          // Filter out tiny regions (noise) — must be at least 1% of total image area
          const minArea = (width * height) * 0.01;
          if (area >= minArea) {
            regions.push({ minX, minY, maxX, maxY, area });
          }
        }
      }

      // Sort regions by vertical position (top to bottom), then left to right
      regions.sort((a, b) => {
        const aCenterY = (a.minY + a.maxY) / 2;
        const bCenterY = (b.minY + b.maxY) / 2;
        // If centers are within 10% of height, sort by X
        if (Math.abs(aCenterY - bCenterY) < height * 0.1) {
          return a.minX - b.minX;
        }
        return aCenterY - bCenterY;
      });

      // Take top N regions by area, up to maxSlots
      const topRegions = regions
        .sort((a, b) => b.area - a.area)
        .slice(0, maxSlots)
        // Re-sort by position
        .sort((a, b) => {
          const aCenterY = (a.minY + a.maxY) / 2;
          const bCenterY = (b.minY + b.maxY) / 2;
          if (Math.abs(aCenterY - bCenterY) < height * 0.1) {
            return a.minX - b.minX;
          }
          return aCenterY - bCenterY;
        });

      // Convert to percentage-based slots
      const slots = topRegions.map((r) => ({
        x: (r.minX / width) * 100,
        y: (r.minY / height) * 100,
        width: ((r.maxX - r.minX) / width) * 100,
        height: ((r.maxY - r.minY) / height) * 100,
      }));

      resolve(slots);
    };

    img.onerror = () => resolve([]);
    img.src = dataUrl;
  });
}
