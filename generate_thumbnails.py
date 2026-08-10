import os
from PIL import Image, ImageOps

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGES_DIR = os.path.join(BASE_DIR, "images")
THUMBS_DIR = os.path.join(IMAGES_DIR, "_thumbs")

WEB_SAFE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_SIZE = (300, 300)
JPEG_QUALITY = 78

CATEGORY_FOLDERS = ["Landscape & Nature", "People & Places", "Art & Creative"]

created = 0
skipped_existing = 0
errors = []

for category_folder in CATEGORY_FOLDERS:
    category_path = os.path.join(IMAGES_DIR, category_folder)
    if not os.path.isdir(category_path):
        continue

    for subfolder in sorted(os.listdir(category_path)):
        subfolder_path = os.path.join(category_path, subfolder)
        if not os.path.isdir(subfolder_path):
            continue

        for fname in sorted(os.listdir(subfolder_path)):
            ext = os.path.splitext(fname)[1].lower()
            if ext not in WEB_SAFE_EXTENSIONS:
                continue

            src_path = os.path.join(subfolder_path, fname)
            thumb_name = os.path.splitext(fname)[0] + ".jpg"
            thumb_dir = os.path.join(THUMBS_DIR, category_folder, subfolder)
            thumb_path = os.path.join(thumb_dir, thumb_name)

            if os.path.exists(thumb_path):
                skipped_existing += 1
                continue

            os.makedirs(thumb_dir, exist_ok=True)

            try:
                with Image.open(src_path) as img:
                    img = ImageOps.exif_transpose(img)
                    img = img.convert("RGB")
                    img.thumbnail(MAX_SIZE, Image.LANCZOS)
                    img.save(thumb_path, "JPEG", quality=JPEG_QUALITY, optimize=True)
                created += 1
            except Exception as e:
                errors.append(f"{src_path}: {e}")

print(f"Created {created} thumbnails, skipped {skipped_existing} already existing")
if errors:
    print(f"\n{len(errors)} errors:")
    for e in errors[:20]:
        print(f"  {e}")
