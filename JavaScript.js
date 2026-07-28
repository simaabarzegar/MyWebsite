document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Footer Year
  const yearElem = document.getElementById("year");
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // 2. Element References
  const folderCards = document.querySelectorAll(".gallery-folder");
  const folderView = document.getElementById("folder-view");
  const folderTitle = document.getElementById("folder-view-title");
  const folderGrid = document.getElementById("folder-view-grid");
  const folderCloseBtn = document.getElementById("folder-close-btn");
  const subcatList = document.getElementById("folder-subcategory-list");

  const modal = document.getElementById("zoom-modal");
  const modalImg = document.getElementById("zoom-modal-image");
  const zoomCloseBtn = document.getElementById("zoom-close-btn");

  // Read data from gallery-categories.js if available
  const categoryData = window.galleryCategories ? window.galleryCategories.detailed : {};

  // 3. Open Folder Drawer when Main Category Card is clicked
  folderCards.forEach((folder) => {
    folder.addEventListener("click", () => {
      const folderCategory = folder.getAttribute("data-folder");
      folderTitle.textContent = folderCategory;
      folderView.hidden = false;

      // Smooth scroll into open drawer view
      folderView.scrollIntoView({ behavior: "smooth", block: "nearest" });

      setupSubcategoriesAndImages(folderCategory);
    });
  });

  // 4. Setup Subcategory Pills and Render Micro-Thumbnails
  function setupSubcategoriesAndImages(mainCategory) {
    subcatList.innerHTML = "";
    folderGrid.innerHTML = "";

    // Filter entries by matching main category name
    const categoryEntries = Object.entries(categoryData).filter(([_, info]) => {
      const cat = typeof info === "object" ? info.category : info;
      return cat && cat.trim().toLowerCase() === mainCategory.trim().toLowerCase();
    });

    if (categoryEntries.length === 0) {
      folderGrid.innerHTML = `<p style="font-size: 0.9rem; color: var(--text-muted); padding: 1rem 0;">No images registered for standard folder "${mainCategory}". Check gallery-categories.js filenames.</p>`;
      return;
    }

    // Extract unique subcategories
    const subcategories = Array.from(
      new Set(
        categoryEntries.map(([_, info]) =>
          typeof info === "object" && info.subcategory ? info.subcategory : "General"
        )
      )
    );

    // Render "All" subcategory button
    const allBtn = document.createElement("button");
    allBtn.className = "subcat-btn active";
    allBtn.textContent = "All Subcategories";
    allBtn.addEventListener("click", () => {
      document.querySelectorAll(".subcat-btn").forEach((b) => b.classList.remove("active"));
      allBtn.classList.add("active");
      renderMicroThumbnails(categoryEntries);
    });
    subcatList.appendChild(allBtn);

    // Render individual subcategory buttons
    subcategories.forEach((sub) => {
      const btn = document.createElement("button");
      btn.className = "subcat-btn";
      btn.textContent = sub;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".subcat-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filtered = categoryEntries.filter(([_, info]) => {
          const s = typeof info === "object" && info.subcategory ? info.subcategory : "General";
          return s === sub;
        });
        renderMicroThumbnails(filtered);
      });
      subcatList.appendChild(btn);
    });

    // Default view: Show all micro-thumbnails for this category
    renderMicroThumbnails(categoryEntries);
  }

  // 5. Render Tiny (32px) Micro-Thumbnails with Fallback Handler
  function renderMicroThumbnails(entries) {
    folderGrid.innerHTML = "";

    entries.forEach(([filename, info]) => {
      const img = document.createElement("img");
      
      // Clean path resolution
      const imagePath = filename.startsWith("images/") || filename.startsWith("http")
        ? filename 
        : `images/${filename}`;

      img.src = imagePath;
      img.alt = typeof info === "object" && info.subcategory ? info.subcategory : filename;
      img.className = "micro-thumb";
      img.loading = "lazy";

      // Fallback if image path is incorrect/not found locally
      img.onerror = function() {
        this.onerror = null;
        this.src = "https://placehold.co/100x100/1f2937/f3f4f6?text=Missing";
      };

      // On Click: Open full image in modal
      img.addEventListener("click", () => {
        if (modal && modalImg) {
          modalImg.src = img.src;
          modal.classList.add("active");
          modal.setAttribute("aria-hidden", "false");
        }
      });

      folderGrid.appendChild(img);
    });
  }

  // 6. Close Drawer and Modal Events
  if (folderCloseBtn) {
    folderCloseBtn.addEventListener("click", () => {
      folderView.hidden = true;
    });
  }

  if (zoomCloseBtn && modal) {
    zoomCloseBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    });

    // Close modal when clicking backdrop
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  }
});