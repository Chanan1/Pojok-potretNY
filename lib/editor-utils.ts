export const FONT_OPTIONS = [
  { id: 'sans', label: 'DM Sans (Modern)', family: '"DM Sans", sans-serif' },
  { id: 'serif', label: 'Playfair Display (Elegan)', family: '"Playfair Display", serif' },
  { id: 'handwriting', label: 'Dancing Script (Latin)', family: '"Dancing Script", cursive' },
  { id: 'mono', label: 'Space Mono (Mesin Ketik)', family: '"Space Mono", monospace' },
];

export const COLORS = [
  '#FADADD', '#FDF0EC', '#FFF0F5', '#FFE4E1', '#E6E6FA', '#D8BFD8', '#F0E68C', '#E0FFFF', '#F5F5DC', '#FFFFFF', '#000000',
];

export const GRADIENTS = [
  'linear-gradient(135deg, #FADADD, #C9B8E8)',
  'linear-gradient(135deg, #FFE4E1, #FFB6C1)',
  'linear-gradient(135deg, #E6E6FA, #D8BFD8)',
  'linear-gradient(135deg, #F0E68C, #FFDAB9)',
  'linear-gradient(135deg, #E0FFFF, #B0E0E6)',
  'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
];

export const PLACEHOLDER_BACKGROUNDS = ['#FADADD', '#E6E6FA', '#FFF0F5', '#E0FFFF', '#F5F5DC', '#FFE4E1', '#F0E68C', '#D8BFD8'];
export const PLACEHOLDER_EMOJIS = ['📷', '✨', '🌸', '💫', '🧸', '🎀', '💌', '🎨'];

export type FilterPreset = {
  id: string
  label: string
  thumbCss: string
  adjustments: {
    brightness: number
    contrast: number
    saturation: number
    sharpness: number
  }
}

export const FILTER_PRESETS: FilterPreset[] = [
  { id: 'normal', label: 'Normal', thumbCss: '', adjustments: { brightness: 10, contrast: 10, saturation: 10, sharpness: 0 } },
  { id: 'bright', label: 'Bright', thumbCss: 'brightness(1.14) saturate(1.05)', adjustments: { brightness: 13, contrast: 10, saturation: 11, sharpness: 1 } },
  { id: 'warm', label: 'Warm', thumbCss: 'sepia(0.18) saturate(1.15) hue-rotate(-8deg)', adjustments: { brightness: 11, contrast: 11, saturation: 12, sharpness: 1 } },
  { id: 'soft', label: 'Soft', thumbCss: 'brightness(1.06) contrast(0.94) saturate(0.92)', adjustments: { brightness: 11, contrast: 8, saturation: 9, sharpness: 0 } },
  { id: 'vintage', label: 'Vintage', thumbCss: 'sepia(0.28) contrast(0.92) saturate(0.84)', adjustments: { brightness: 10, contrast: 9, saturation: 8, sharpness: 1 } },
  { id: 'bw', label: 'B&W', thumbCss: 'grayscale(1) contrast(1.05)', adjustments: { brightness: 10, contrast: 11, saturation: 0, sharpness: 1 } },
  { id: 'moody', label: 'Moody', thumbCss: 'brightness(0.92) contrast(1.14) saturate(0.86)', adjustments: { brightness: 9, contrast: 13, saturation: 8, sharpness: 2 } },
  { id: 'dreamy', label: 'Dreamy', thumbCss: 'brightness(1.08) contrast(0.9) saturate(1.08)', adjustments: { brightness: 12, contrast: 8, saturation: 11, sharpness: 0 } },
]

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function buildCompositeFilter(filterId: string, adjustments: { brightness: number, contrast: number, saturation: number }) {
  const brightness = 0.65 + adjustments.brightness / 20
  const contrast = 0.65 + adjustments.contrast / 20
  const saturation = adjustments.saturation / 10

  const presetMap: Record<string, string> = {
    normal: '',
    bright: '',
    warm: 'sepia(0.18) hue-rotate(-8deg)',
    soft: 'opacity(0.98)',
    vintage: 'sepia(0.28)',
    bw: 'grayscale(1)',
    moody: 'brightness(0.92)',
    dreamy: 'brightness(1.04)',
  }

  return `${presetMap[filterId] ?? ''} brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`.trim()
}

export function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

export function drawTemplateAccent(
  ctx: CanvasRenderingContext2D,
  style: string | undefined,
  canvasWidth: number,
  canvasHeight: number
) {
  if (!style) return

  switch (style) {
    case 'film':
      ctx.fillStyle = '#111'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      for (let y = 36; y < canvasHeight - 36; y += 88) {
        ctx.fillRect(24, y, 18, 40)
        ctx.fillRect(canvasWidth - 42, y, 18, 40)
      }
      break
    case 'editorial':
      ctx.strokeStyle = 'rgba(61,43,53,0.12)'
      ctx.lineWidth = 2
      ctx.strokeRect(24, 24, canvasWidth - 48, canvasHeight - 48)
      break
    case 'monogram':
      ctx.strokeStyle = 'rgba(120,92,65,0.18)'
      ctx.lineWidth = 2
      ctx.strokeRect(28, 28, canvasWidth - 56, canvasHeight - 56)
      ctx.strokeRect(44, 44, canvasWidth - 88, canvasHeight - 88)
      break
    case 'gallery':
      ctx.fillStyle = 'rgba(61,43,53,0.05)'
      ctx.fillRect(18, 18, canvasWidth - 36, canvasHeight - 36)
      break
    case 'darkline':
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.lineWidth = 2
      ctx.strokeRect(22, 22, canvasWidth - 44, canvasHeight - 44)
      break
    case 'botanical':
      ctx.fillStyle = 'rgba(99, 140, 109, 0.12)'
      ctx.beginPath()
      ctx.arc(130, 130, 80, 0, Math.PI * 2)
      ctx.arc(canvasWidth - 120, canvasHeight - 120, 90, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'rose':
      ctx.fillStyle = 'rgba(232,71,138,0.08)'
      ctx.fillRect(0, canvasHeight - 130, canvasWidth, 130)
      break
    case 'lavender':
      ctx.fillStyle = 'rgba(255,255,255,0.14)'
      ctx.fillRect(0, 0, canvasWidth, 150)
      break
    case 'wedding':
      ctx.strokeStyle = 'rgba(198, 168, 120, 0.28)'
      ctx.lineWidth = 2
      ctx.strokeRect(26, 26, canvasWidth - 52, canvasHeight - 52)
      break
    case 'midnight':
      ctx.fillStyle = 'rgba(67, 113, 168, 0.18)'
      ctx.fillRect(0, 0, canvasWidth, 200)
      break
    case 'cute-note':
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.fillRect(20, 20, canvasWidth - 40, canvasHeight - 40)
      break
    default:
      break
  }
}

export function drawPhotoIntoSlot(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  slot: { x: number; y: number; width: number; height: number },
  transform: { x: number, y: number, scale: number, rotation?: number },
  compositeFilter = ''
) {
  const scale = Math.max(slot.width / image.width, slot.height / image.height) * transform.scale
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  const offsetX = (transform.x / 100) * slot.width
  const offsetY = (transform.y / 100) * slot.height
  const drawX = slot.x + (slot.width - drawWidth) / 2 + offsetX
  const drawY = slot.y + (slot.height - drawHeight) / 2 + offsetY

  ctx.save()
  ctx.beginPath()
  ctx.rect(slot.x, slot.y, slot.width, slot.height)
  ctx.clip()
  ctx.filter = compositeFilter || 'none'
  
  if (transform.rotation) {
    ctx.translate(slot.x + slot.width / 2, slot.y + slot.height / 2);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.translate(-(slot.x + slot.width / 2), -(slot.y + slot.height / 2));
  }
  
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
  ctx.filter = 'none'
  ctx.restore()
}

export function drawStickerOnCanvas(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  sticker: { x: number, y: number, scale: number, rotation: number, opacity: number, flipX: boolean, flipY: boolean },
  canvasWidth: number,
  canvasHeight: number
) {
  const centerX = (sticker.x / 100) * canvasWidth
  const centerY = (sticker.y / 100) * canvasHeight
  const width = (sticker.scale / 100) * canvasWidth
  const height = width * ((image.naturalHeight || image.height) / (image.naturalWidth || image.width || 1))

  ctx.save()
  ctx.globalAlpha = sticker.opacity / 100
  ctx.translate(centerX, centerY)
  ctx.rotate((sticker.rotation * Math.PI) / 180)
  ctx.scale(sticker.flipX ? -1 : 1, sticker.flipY ? -1 : 1)
  ctx.drawImage(image, -width / 2, -height / 2, width, height)
  ctx.restore()
}

export async function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Gagal memuat gambar'))
    img.src = src
  })
}

export function floodClearAtPoint(imageData: ImageData, x: number, y: number, tolerance = 44) {
  const { width, height, data } = imageData
  const targetColor = [
    data[(y * width + x) * 4],
    data[(y * width + x) * 4 + 1],
    data[(y * width + x) * 4 + 2],
    data[(y * width + x) * 4 + 3]
  ]

  const isMatch = (idx: number) => {
    return (
      Math.abs(data[idx] - targetColor[0]) <= tolerance &&
      Math.abs(data[idx + 1] - targetColor[1]) <= tolerance &&
      Math.abs(data[idx + 2] - targetColor[2]) <= tolerance &&
      Math.abs(data[idx + 3] - targetColor[3]) <= tolerance
    )
  }

  const stack = [{ x, y }]
  const processed = new Uint8Array(width * height)
  
  let minX = width, minY = height, maxX = 0, maxY = 0;

  while (stack.length > 0) {
    const pt = stack.pop()!
    const idx = (pt.y * width + pt.x) * 4

    if (pt.x < 0 || pt.x >= width || pt.y < 0 || pt.y >= height) continue
    if (processed[pt.y * width + pt.x]) continue

    if (isMatch(idx)) {
      data[idx + 3] = 0 // set alpha to 0
      processed[pt.y * width + pt.x] = 1

      minX = Math.min(minX, pt.x)
      minY = Math.min(minY, pt.y)
      maxX = Math.max(maxX, pt.x)
      maxY = Math.max(maxY, pt.y)

      stack.push({ x: pt.x + 1, y: pt.y })
      stack.push({ x: pt.x - 1, y: pt.y })
      stack.push({ x: pt.x, y: pt.y + 1 })
      stack.push({ x: pt.x, y: pt.y - 1 })
    }
  }

  if (minX <= maxX && minY <= maxY) {
    return {
      bounds: { left: minX, top: minY, right: maxX, bottom: maxY }
    }
  }
  return null
}
