import os
import json
from PIL import Image
import pillow_heif
import torch
from transformers import pipeline

# Register HEIF / HEIC image support (e.g., iPhone photos)
pillow_heif.register_heif_opener()

images_dir = r"C:\Users\sbarzeg1\Desktop\SimaBarzegarWebsite\images"

print("Step 1: Collecting image files...")
image_files = sorted([
    f for f in os.listdir(images_dir)
    if f.lower().endswith(('.jpg', '.jpeg', '.png', '.heic')) and not f.startswith('.')
])
print(f"Total web-compatible images found: {len(image_files)}")

print("Step 2: Initializing CLIP vision-language model...")
device = 0 if torch.cuda.is_available() else -1
classifier = pipeline(
    "zero-shot-image-classification",
    model="openai/clip-vit-base-patch32",
    device=device
)

# Taxonomy strict to the 3 main categories requested
taxonomy = {
    # 1. Landscapes & Nature
    "a photo of dense forest, green trees, mountains, garden foliage, or natural wilderness": {
        "folder": "landscapes_nature",
        "category": "Landscapes & Nature"
    },
    "a photo of ocean water, beach sand, sea waves, or coastal shore": {
        "folder": "landscapes_nature",
        "category": "Landscapes & Nature"
    },
    "a photo of the moon, starry night sky, twilight hour, or blue sky": {
        "folder": "landscapes_nature",
        "category": "Landscapes & Nature"
    },
    
    # 2. People & Places
    "a photo of a person, human face portrait, group of friends, family, or people": {
        "folder": "people_places",
        "category": "People & Places"
    },
    "a photo of city skyline, modern architecture, urban buildings, streets, room interior, or place": {
        "folder": "people_places",
        "category": "People & Places"
    },
    
    # 3. Art & Creative
    "a photo of handmade craft, art painting, drawing illustration, sculpture, or stained glass window": {
        "folder": "art_creative",
        "category": "Art & Creative"
    },
    "a photo of flower petals, blooming floral blossom, or flower bouquet": {
        "folder": "art_creative",
        "category": "Art & Creative"
    }
}

candidate_labels = list(taxonomy.keys())

category_mapping = {}
detailed_mapping = {}

print("Categorizing images into the 3 main collections...")

batch_size = 16
for i in range(0, len(image_files), batch_size):
    batch_files = image_files[i:i+batch_size]
    batch_imgs = []
    batch_names = []
    
    for fname in batch_files:
        fpath = os.path.join(images_dir, fname)
        try:
            img = Image.open(fpath).convert("RGB")
            # Downsample for faster and consistent CLIP processing
            img.thumbnail((512, 512))
            batch_imgs.append(img)
            batch_names.append(fname)
        except Exception as e:
            print(f"Skipping unreadable image {fname}: {e}")
            
    if not batch_imgs:
        continue
        
    try:
        results = classifier(batch_imgs, candidate_labels=candidate_labels)
        if isinstance(results, dict):
            results = [results]
            
        for fname, res in zip(batch_names, results):
            top_label = res[0]["label"]
            match_data = taxonomy[top_label]
            
            category_mapping[fname] = match_data["category"]
            detailed_mapping[fname] = {
                "folder": match_data["folder"],
                "category": match_data["category"],
                "confidence": round(res[0]["score"], 3)
            }
    except Exception as err:
        print(f"Batch processing error at index {i}: {err}. Retrying individually...")
        for fname, img in zip(batch_names, batch_imgs):
            try:
                res = classifier(img, candidate_labels=candidate_labels)
                top_label = res[0]["label"]
                match_data = taxonomy[top_label]
                category_mapping[fname] = match_data["category"]
                detailed_mapping[fname] = {
                    "folder": match_data["folder"],
                    "category": match_data["category"],
                    "confidence": round(res[0]["score"], 3)
                }
            except Exception as single_err:
                print(f"Fallback assigned for {fname}: {single_err}")
                category_mapping[fname] = "Landscapes & Nature"
                detailed_mapping[fname] = {
                    "folder": "landscapes_nature",
                    "category": "Landscapes & Nature",
                    "confidence": 0.0
                }

    print(f"Processed {min(i+batch_size, len(image_files))}/{len(image_files)} images...")

print("\nStep 3: Saving output JSON and JavaScript files...")

# Output JS for web integration
js_content = f"window.galleryCategories = {{\n  \"mapping\": {json.dumps(category_mapping, indent=4)},\n  \"detailed\": {json.dumps(detailed_mapping, indent=4)}\n}};\n"
with open(os.path.join(images_dir, "gallery-categories.js"), "w", encoding="utf-8") as f:
    f.write(js_content)

# Output JSON
with open(os.path.join(images_dir, "image-categories.json"), "w", encoding="utf-8") as f:
    json.dump({"mapping": category_mapping, "detailed": detailed_mapping}, f, indent=2)

# Print Summary
summary = {}
for item in detailed_mapping.values():
    cat = item["category"]
    summary[cat] = summary.get(cat, 0) + 1

print("\n--- Categorization Summary ---")
for cat, count in sorted(summary.items()):
    print(f"  • {cat}: {count} images")

print("\nClassification process completed successfully!")