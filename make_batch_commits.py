import subprocess
import os

cwd = r"C:\Users\sbarzeg1\Desktop\SimaBarzegarWebsite"

def run(cmd):
    p = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    print(f"CMD: {cmd}")
    if p.stdout.strip():
        print("OUT:", p.stdout.strip()[:150])
    if p.stderr.strip():
        print("ERR:", p.stderr.strip()[:150])

# Config git identity
run('git config user.name "Sima Barzegar"')
run('git config user.email "sima.barzegar@bsc.es"')

# Commit 1: Code and Metadata (~1MB)
run('git add index.html script.js styles.css documents/ CLAUDE.md host-address.txt classify_images.py .gitignore images/gallery-categories.js images/gallery-files.txt images/gallery-images.js images/gallery-images.json images/image-categories.json')
run('git commit -m "Commit 1: Website code and metadata"')

# Commit 2: Batch A
run('git add images/0* images/3* images/4* images/6* images/a* images/E* images/F* images/f* images/fda* images/fe* images/IMG_0*')
run('git commit -m "Commit 2: Images batch A"')

# Commit 3: Batch B
run('git add images/IMG_5*')
run('git commit -m "Commit 3: Images batch B"')

# Commit 4: Batch C
run('git add images/IMG_6*')
run('git commit -m "Commit 4: Images batch C"')

# Commit 5: Batch D
run('git add images/IMG_7* images/IMG_8* images/IMG_9* "Ashtanga Primary Series.png" IMG_5475.JPG SIMA_BARZEGAR.jpg SIMA_BARZEGAR_CV.pdf')
run('git commit -m "Commit 5: Images batch D and root assets"')

print("All batch commits created successfully!")
