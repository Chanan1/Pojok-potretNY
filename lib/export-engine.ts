import { useEditorStore } from "@/store/useEditorStore";

const loadImg = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export const exportCanvas = async (
  scale: number = 2,
  format: "png" | "jpg" = "png"
): Promise<string> => {
  const store = useEditorStore.getState();
  const { template, photos, slots, stickers, texts, backgroundColor } = store;

  // 1. Determine base canvas size
  let width = 320;
  let height = 960;
  let templateImg: HTMLImageElement | null = null;

  if (template) {
    templateImg = await loadImg(template.src);
    width = templateImg.naturalWidth;
    height = templateImg.naturalHeight;
  }

  // 2. Setup canvas
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");

  // Scale everything to match the required multiplier
  ctx.scale(scale, scale);

  // 3. Draw background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // 4. Preload photos
  const photoImgs = await Promise.all(
    photos.map((p) => (p ? loadImg(p).catch(() => null) : Promise.resolve(null)))
  );

  // 5. Draw slots (Photos)
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const photo = photoImgs[slot.photoIndex];
    if (!photo) continue;

    const slotX = (slot.x / 100) * width;
    const slotY = (slot.y / 100) * height;
    const slotW = (slot.width / 100) * width;
    const slotH = (slot.height / 100) * height;

    ctx.save();

    // Create clipping path for the slot
    ctx.beginPath();
    ctx.rect(slotX, slotY, slotW, slotH);
    ctx.clip();

    // Calculate photo transform inside the slot
    const cx = slotX + slotW / 2;
    const cy = slotY + slotH / 2;

    ctx.translate(cx, cy);
    ctx.rotate(((slot.photoRotation || 0) * Math.PI) / 180);
    ctx.scale(slot.photoScale || 1, slot.photoScale || 1);

    // CSS object-cover behavior replication
    const imageRatio = photo.width / photo.height;
    const slotRatio = slotW / slotH;

    let drawW, drawH;
    if (imageRatio > slotRatio) {
      drawH = slotH;
      drawW = photo.width * (slotH / photo.height);
    } else {
      drawW = slotW;
      drawH = photo.height * (slotW / photo.width);
    }

    const tx = ((slot.photoX || 0) / 100) * drawW;
    const ty = ((slot.photoY || 0) / 100) * drawH;
    ctx.translate(tx, ty);

    // Apply filters
    const f = slot.filter;
    ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) sepia(${f.sepia || 0}%) blur(${f.blur || 0}px)`;

    ctx.drawImage(photo, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();
  }

  // 6. Draw Template Overlay
  if (templateImg) {
    ctx.drawImage(templateImg, 0, 0, width, height);
  }

  // 7. Draw Stickers
  for (const st of stickers) {
    try {
      const stImg = await loadImg(st.src);
      ctx.save();

      const sx = (st.x / 100) * width;
      const sy = (st.y / 100) * height;

      ctx.translate(sx, sy);
      ctx.rotate((st.rotation * Math.PI) / 180);
      const flipX = st.flipX ? -1 : 1;
      const flipY = st.flipY ? -1 : 1;
      ctx.scale(st.scale * flipX, st.scale * flipY);
      ctx.globalAlpha = (st.opacity ?? 100) / 100;

      // Base dimension equivalent to w-20 h-20 object-contain (80px box) in editor preview
      // The canvas could be much larger than the preview. 
      // The preview base size is 320x960. 
      // If our canvas is `width` wide, and the preview is 320px wide, the scaling factor is `width / 320`
      const relativeScale = width / 320;
      const baseSize = 80 * relativeScale;

      const stRatio = stImg.width / stImg.height;
      let stW = baseSize,
        stH = baseSize;
      if (stRatio > 1) {
        stH = baseSize / stRatio;
      } else {
        stW = baseSize * stRatio;
      }

      ctx.drawImage(stImg, -stW / 2, -stH / 2, stW, stH);
      ctx.restore();
    } catch (e) {
      console.error("Failed to draw sticker:", e);
    }
  }

  // 8. Draw Texts
  for (const tx of texts) {
    ctx.save();
    const txX = (tx.x / 100) * width;
    const txY = (tx.y / 100) * height;

    ctx.translate(txX, txY);
    ctx.rotate((tx.rotation * Math.PI) / 180);
    ctx.scale(tx.scale, tx.scale);

    ctx.fillStyle = tx.color;
    
    // Similarly scale the font size
    const relativeScale = width / 320;
    const fontSize = 24 * relativeScale;
    
    ctx.font = `${fontSize}px ${tx.fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(tx.text, 0, 0);
    ctx.restore();
  }

  // 9. Export
  const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
  return canvas.toDataURL(mimeType, 0.9);
};
