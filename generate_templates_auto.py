import os
import json
from PIL import Image

base = r'c:\Users\ACER\pojok-potret\public\templates'
result = []
id_counter = 1

def find_transparent_rects(img_path):
    # Open image
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    
    # Load pixels
    pixels = img.load()
    
    # Simple algorithm to find bounding boxes of transparent regions
    # We will find contiguous components of transparent pixels (alpha < 10)
    visited = set()
    rects = []
    
    for y in range(height):
        for x in range(width):
            if (x, y) not in visited:
                r, g, b, a = pixels[x, y]
                if a < 50: # transparent
                    # Flood fill to find bounds
                    stack = [(x, y)]
                    min_x, max_x = x, x
                    min_y, max_y = y, y
                    
                    while stack:
                        cx, cy = stack.pop()
                        if (cx, cy) in visited:
                            continue
                        visited.add((cx, cy))
                        
                        min_x = min(min_x, cx)
                        max_x = max(max_x, cx)
                        min_y = min(min_y, cy)
                        max_y = max(max_y, cy)
                        
                        # Check neighbors
                        for dx, dy in [(1,0), (-1,0), (0,1), (0,-1)]:
                            nx, ny = cx + dx, cy + dy
                            if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                                nr, ng, nb, na = pixels[nx, ny]
                                if na < 50:
                                    stack.append((nx, ny))
                                else:
                                    # Mark non-transparent as visited so we don't check them again
                                    visited.add((nx, ny))
                    
                    # Convert to percentages
                    w = max_x - min_x + 1
                    h = max_y - min_y + 1
                    
                    # Ignore small artifacts (e.g. noise less than 5% of width/height)
                    if w > width * 0.05 and h > height * 0.05:
                        rects.append({
                            'x': round((min_x / width) * 100, 2),
                            'y': round((min_y / height) * 100, 2),
                            'width': round((w / width) * 100, 2),
                            'height': round((h / height) * 100, 2)
                        })
                else:
                    visited.add((x, y))
                    
    # Sort rects top-to-bottom, left-to-right
    rects.sort(key=lambda r: (r['y'], r['x']))
    return rects

for folder in os.listdir(base):
    folder_path = os.path.join(base, folder)
    if os.path.isdir(folder_path):
        count = int(folder.split()[0])
        for file in os.listdir(folder_path):
            if file.endswith('.png'):
                img_path = os.path.join(folder_path, file)
                print(f"Processing {file}...")
                slots = find_transparent_rects(img_path)
                
                # If algorithm fails or finds too many/few, fallback to basic logic
                if len(slots) != count:
                    print(f"  Warning: Found {len(slots)} slots, expected {count}. Falling back to default.")
                    slots = []
                    padding = 5
                    gap = 2
                    h_per_slot = (100 - (padding * 2) - (gap * (count - 1))) / count
                    for i in range(count):
                        slots.append({
                            'x': padding,
                            'y': padding + i * (h_per_slot + gap),
                            'width': 100 - (padding * 2),
                            'height': h_per_slot
                        })
                else:
                    # Expand the slot slightly (add 0.5% in all directions) to ensure no bleeding edges
                    for s in slots:
                        s['x'] = max(0, s['x'] - 0.5)
                        s['y'] = max(0, s['y'] - 0.5)
                        s['width'] = min(100 - s['x'], s['width'] + 1.0)
                        s['height'] = min(100 - s['y'], s['height'] + 1.0)
                
                # Clean filename for name
                name = file.replace('.png', '')
                
                result.append({
                    'id': f't{id_counter}',
                    'name': name,
                    'src': f'/templates/{folder}/{file}',
                    'frameCount': count,
                    'slots': slots
                })
                id_counter += 1

ts_code = f'import {{ EditorTemplate }} from "@/store/useEditorStore";\n\nexport const PREDEFINED_TEMPLATES: EditorTemplate[] = {json.dumps(result, indent=2)};\n'

with open(r'c:\Users\ACER\pojok-potret\lib\templates.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("Done!")
