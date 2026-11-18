from PIL import Image
from collections import deque
import os

img = Image.open('C:/proyectosass/Aplicaciones/profe-pizarra/avatars/spritesheet.jpg').convert('RGB')
W, H = img.size

out_dir = 'C:/proyectosass/Aplicaciones/profe-pizarra/avatars/sprites'
os.makedirs(out_dir, exist_ok=True)

def clean_and_upscale(pil_crop, scale=4, trim_purple=True):
    rgba = pil_crop.convert('RGBA')
    w, h = rgba.size
    pix = rgba.load()
    visited = set()
    q = deque()

    # Seed transparent floodfill from borders
    for x in range(w):
        for y in [0, 1, h-2, h-1]:
            r, g, b, a = pix[x, y]
            if r > 185 and g > 180 and b > 175:
                q.append((x, y))
                visited.add((x, y))

    for y in range(h):
        for x in [0, 1, w-2, w-1]:
            r, g, b, a = pix[x, y]
            if r > 185 and g > 180 and b > 175 and (x, y) not in visited:
                q.append((x, y))
                visited.add((x, y))

    while q:
        cx, cy = q.popleft()
        pix[cx, cy] = (0, 0, 0, 0)
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                r, g, b, a = pix[nx, ny]
                # Background off-white / light grey
                if r > 195 and g > 190 and b > 185 and abs(r - g) < 30 and abs(r - b) < 30:
                    visited.add((nx, ny))
                    q.append((nx, ny))
                elif trim_purple and (r < 150 and 60 < b < 220 and g < 75):
                    # Purple badge / border artifact
                    visited.add((nx, ny))
                    q.append((nx, ny))

    # Clean isolated stray purple artifacts
    for y in range(h):
        for x in range(w):
            r, g, b, a = pix[x, y]
            if a > 0 and trim_purple and (r < 140 and 60 < b < 220 and g < 70):
                pix[x, y] = (0, 0, 0, 0)

    # Upscale 4x with high-quality Lanczos resampling
    upscaled = rgba.resize((w * scale, h * scale), Image.Resampling.LANCZOS)
    return upscaled

# 1. 8 TALKING & EXPLAINING FRAMES
talk_x1, talk_x2 = 160, 1016
talk_y1, talk_y2 = 186, 336
talk_frame_w = (talk_x2 - talk_x1) / 8.0

print("Generating 8 HD talking frames...")
for i in range(8):
    fx1 = int(talk_x1 + i * talk_frame_w)
    fx2 = int(talk_x1 + (i + 1) * talk_frame_w)
    crop = img.crop((fx1, talk_y1, fx2, talk_y2))
    hd = clean_and_upscale(crop, scale=4)
    hd.save(os.path.join(out_dir, f'talk_{i+1}.png'))

# 2. 6 WRITING ON BOARD FRAMES
write_x1, write_x2 = 468, 1016
write_y1, write_y2 = 386, 528
write_frame_w = (write_x2 - write_x1) / 6.0

print("Generating 6 HD writing frames...")
for i in range(6):
    fx1 = int(write_x1 + i * write_frame_w)
    fx2 = int(write_x1 + (i + 1) * write_frame_w)
    crop = img.crop((fx1, write_y1, fx2, write_y2))
    hd = clean_and_upscale(crop, scale=4)
    hd.save(os.path.join(out_dir, f'write_{i+1}.png'))

# 3. 6 TURN TO BOARD TRANSITION FRAMES
turn_x1, turn_x2 = 14, 462
turn_y1, turn_y2 = 386, 528
turn_frame_w = (turn_x2 - turn_x1) / 6.0

print("Generating 6 HD turn frames...")
for i in range(6):
    fx1 = int(turn_x1 + i * turn_frame_w)
    fx2 = int(turn_x1 + (i + 1) * turn_frame_w)
    crop = img.crop((fx1, turn_y1, fx2, turn_y2))
    hd = clean_and_upscale(crop, scale=4)
    hd.save(os.path.join(out_dir, f'turn_{i+1}.png'))

# 4. 8 PHONEME LIP-SYNC MOUTHS
mouth_names = [
    ('mouth_ae', 0, 0), ('mouth_i', 1, 0), ('mouth_o', 2, 0), ('mouth_u', 3, 0),
    ('mouth_mbp', 0, 1), ('mouth_fv', 1, 1), ('mouth_ldt', 2, 1), ('mouth_sz', 3, 1)
]
mouth_x1, mouth_x2 = 776, 1012
mouth_col_w = (mouth_x2 - mouth_x1) / 4.0

print("Generating 8 HD mouth phonemes...")
for name, col, row in mouth_names:
    my1 = 32 if row == 0 else 92
    my2 = 88 if row == 0 else 148
    mx1 = int(mouth_x1 + col * mouth_col_w)
    mx2 = int(mouth_x1 + (col + 1) * mouth_col_w)
    crop = img.crop((mx1, my1, mx2, my2))
    hd = clean_and_upscale(crop, scale=4)
    hd.save(os.path.join(out_dir, f'{name}.png'))

# 5. BASE FULL BODY POSE
print("Generating HD base pose...")
base_crop = img.crop((4, 28, 155, 600))
base_hd = clean_and_upscale(base_crop, scale=3)
base_hd.save(os.path.join(out_dir, 'base_pose.png'))

print("Completed slicing and HD upscaling!")
