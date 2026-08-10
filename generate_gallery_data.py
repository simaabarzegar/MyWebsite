import os
import json

images_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")

# Folder name (as organized on disk) -> canonical names already wired into index.html/script.js
CATEGORY_MAP = {
    "Landscape & Nature": "Landscapes & Nature",
    "People & Places": "People & Places",
    "Art & Creative": "Art & Creative",
}

SUBCATEGORY_MAP = {
    "Nature": "nature",
    "Sea side-Water": "sea side",
    "Sunset-Sunrise": "sunset/sunrise",
    "Moon-Sky": "moon",
    "People": "people",
    "Places": "places",
    "City View": "city view",
    "Art": "art",
    "Food": "food",
    "Flowers": "flowers",
}

WEB_SAFE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

mapping = {}
detailed = {}
skipped = []

for folder_name, category in CATEGORY_MAP.items():
    folder_path = os.path.join(images_dir, folder_name)
    if not os.path.isdir(folder_path):
        continue

    for subfolder_name in sorted(os.listdir(folder_path)):
        subfolder_path = os.path.join(folder_path, subfolder_name)
        if not os.path.isdir(subfolder_path):
            continue

        subcategory = SUBCATEGORY_MAP.get(subfolder_name)
        if subcategory is None:
            print(f"WARNING: no subcategory mapping for folder '{subfolder_name}', skipping its files")
            continue

        for fname in sorted(os.listdir(subfolder_path)):
            fpath = os.path.join(subfolder_path, fname)
            if not os.path.isfile(fpath):
                continue

            ext = os.path.splitext(fname)[1].lower()
            if ext not in WEB_SAFE_EXTENSIONS:
                skipped.append(f"{folder_name}/{subfolder_name}/{fname}")
                continue

            rel_path = f"{folder_name}/{subfolder_name}/{fname}"
            mapping[rel_path] = category
            detailed[rel_path] = {"subcategory": subcategory}

js_content = (
    "window.galleryCategories = {\n"
    f"  \"mapping\": {json.dumps(mapping, indent=2, ensure_ascii=False)},\n"
    f"  \"detailed\": {json.dumps(detailed, indent=2, ensure_ascii=False)}\n"
    "};\n"
)

with open(os.path.join(images_dir, "gallery-categories.js"), "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"\nWrote {len(mapping)} images to images/gallery-categories.js")
print(f"Skipped {len(skipped)} non-web-safe files (HEIC/MOV/MP4/etc.)")

summary = {}
for cat in mapping.values():
    summary[cat] = summary.get(cat, 0) + 1
print("\n--- Category summary ---")
for cat, count in sorted(summary.items()):
    print(f"  {cat}: {count} images")
