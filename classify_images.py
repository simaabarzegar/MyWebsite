import os
import json
from PIL import Image
import pillow_heif
import torch
from transformers import pipeline

pillow_heif.register_heif_opener()

images_dir = r"C:\Users\sbarzeg1\Desktop\SimaBarzegarWebsite\images"

print("Step 1: Collecting image files...")
image_files = sorted([
    f for f in os.listdir(images_dir)
    if f.lower().endswith(('.jpg', '.jpeg', '.png')) and not f.startswith('.')
])
print(f"Total web-compatible images found: {len(image_files)}")

print("Step 2: Initializing CLIP classification model...")
device = 0 if torch.cuda.is_available() else -1
classifier = pipeline(
    "zero-shot-image-classification",
    model="openai/clip-vit-base-patch32",
    device=device
)

candidate_labels = [
    "nature, forest, trees, mountains, garden, foliage, or green natural landscape",
    "city view, cityscape, street, buildings, skyscrapers, or urban architecture",
    "sea side, beach, ocean, sea waves, or coastal water",
    "flowers, flower blossom, petals, bouquet, or floral arrangement",
    "people, portrait of a person, group of people, human face, or person pose",
    "places, travel destination, room interior, house, terrace, or architectural location",
    "moon, night sky with moon, dark sky, or night view",
    "food, dish, meal, cooking, plate of food, fruit, or beverage",
    "art, painting, drawing, artwork, sketch, or creative illustration",
    "sunset or sunrise sky, evening twilight, golden hour, or dawn"
]

label_to_category = {
    "nature, forest, trees, mountains, garden, foliage, or green natural landscape": "nature",
    "city view, cityscape, street, buildings, skyscrapers, or urban architecture": "city view",
    "sea side, beach, ocean, sea waves, or coastal water": "sea side",
    "flowers, flower blossom, petals, bouquet, or floral arrangement": "flowers",
    "people, portrait of a person, group of people, human face, or person pose": "people",
    "places, travel destination, room interior, house, terrace, or architectural location": "places",
    "moon, night sky with moon, dark sky, or night view": "moon",
    "food, dish, meal, cooking, plate of food, fruit, or beverage": "food",
    "art, painting, drawing, artwork, sketch, or creative illustration": "art",
    "sunset or sunrise sky, evening twilight, golden hour, or dawn": "sunset/sunrise"
}

category_mapping = {}
print("Categorizing all 471 images...")

batch_size = 16
for i in range(0, len(image_files), batch_size):
    batch_files = image_files[i:i+batch_size]
    batch_imgs = []
    batch_names = []
    
    for fname in batch_files:
        fpath = os.path.join(images_dir, fname)
        try:
            img = Image.open(fpath).convert("RGB")
            batch_imgs.append(img)
            batch_names.append(fname)
        except Exception as e:
            print(f"Skipping corrupt image {fname}: {e}")
            
    if not batch_imgs:
        continue
        
    try:
        results = classifier(batch_imgs, candidate_labels=candidate_labels)
        if isinstance(results, dict):
            results = [results]
            
        for fname, res in zip(batch_names, results):
            top_label = res[0]["label"]
            category_mapping[fname] = label_to_category[top_label]
    except Exception as err:
        print(f"Batch classification error at {i}: {err}")
        for fname, img in zip(batch_names, batch_imgs):
            try:
                res = classifier(img, candidate_labels=candidate_labels)
                category_mapping[fname] = label_to_category[res[0]["label"]]
            except:
                category_mapping[fname] = "nature"
                
    print(f"Categorized {min(i+batch_size, len(image_files))}/{len(image_files)} images...")

print("\nStep 3: Writing gallery data files...")

# Write gallery-categories.js
js_content = f"window.galleryCategories = {{\n  \"mapping\": {json.dumps(category_mapping, indent=4)}\n}};\n"
with open(os.path.join(images_dir, "gallery-categories.js"), "w", encoding="utf-8") as f:
    f.write(js_content)

# Write gallery-images.js
all_images = sorted(list(category_mapping.keys()))
images_js_content = f"window.galleryImages = {json.dumps(all_images, indent=2)};\n"
with open(os.path.join(images_dir, "gallery-images.js"), "w", encoding="utf-8") as f:
    f.write(images_js_content)

# Write image-categories.json
with open(os.path.join(images_dir, "image-categories.json"), "w", encoding="utf-8") as f:
    json.dump({"mapping": category_mapping}, f, indent=2)

# Write gallery-files.txt
with open(os.path.join(images_dir, "gallery-files.txt"), "w", encoding="utf-8") as f:
    for img_name in all_images:
        f.write(f"{img_name}\n")

# Summary
summary = {}
for cat in category_mapping.values():
    summary[cat] = summary.get(cat, 0) + 1

print("\n--- Final Category Summary ---")
for cat, count in sorted(summary.items()):
    print(f"  {cat}: {count} images")
print("Image processing and classification successfully finished!")
