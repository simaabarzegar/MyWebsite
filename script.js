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

  const topSubnavBtns = document.querySelectorAll(".top-subnav-btn");
  const dropdownSubcatLinks = document.querySelectorAll(".dropdown-menu a[data-subcat]");
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownContainer = document.querySelector(".nav-item.dropdown");

  // Read category data from window object
  const categoryMapping = (window.galleryCategories && window.galleryCategories.mapping) || {};
  const detailedData = (window.galleryCategories && window.galleryCategories.detailed) || {};

  // Category & Subcategory Mapping Reference
  const mainFolders = {
    "landscapes": {
      title: "Landscapes & Nature",
      subcategories: ["nature", "sea side", "sunset/sunrise", "moon"]
    },
    "people": {
      title: "People & Places",
      subcategories: ["people", "places", "city view"]
    },
    "creative": {
      title: "Art & Creative",
      subcategories: ["art", "food", "flowers"]
    }
  };

  const subcategoryToMainFolder = {
    "nature": "Landscapes & Nature",
    "sea side": "Landscapes & Nature",
    "sunset/sunrise": "Landscapes & Nature",
    "moon": "Landscapes & Nature",
    "people": "People & Places",
    "places": "People & Places",
    "city view": "People & Places",
    "art": "Art & Creative",
    "food": "Art & Creative",
    "flowers": "Art & Creative"
  };

  const categoryDisplayNames = {
    "nature": "Nature",
    "sea side": "Sea side",
    "sunset/sunrise": "Sunset / Sunrise",
    "moon": "Moon",
    "people": "People",
    "places": "Places",
    "city view": "City view",
    "art": "Art",
    "food": "Food",
    "flowers": "Flowers"
  };

  // 3. Open Category Drawer from Card Click
  folderCards.forEach((folder) => {
    folder.addEventListener("click", () => {
      const folderCategory = folder.getAttribute("data-folder");
      openFolderCategory(folderCategory);
    });
  });

  function openFolderCategory(mainCategory, filterSubcategory = "all") {
    if (folderTitle) folderTitle.textContent = mainCategory;
    if (folderView) folderView.hidden = false;

    setupSubcategoriesAndImages(mainCategory, filterSubcategory);
    folderView?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // 4. Setup Subcategories & Filter Options
  function setupSubcategoriesAndImages(mainCategory, activeSubcatFilter = "all") {
    if (!subcatList || !folderGrid) return;
    subcatList.innerHTML = "";
    folderGrid.innerHTML = "";

    // Filter images matching main category name
    const categoryEntries = Object.entries(categoryMapping).filter(([_, catName]) => catName === mainCategory);

    if (categoryEntries.length === 0) {
      folderGrid.innerHTML = `<p style="font-size: 0.9rem; color: var(--text-muted);">No images found for this category.</p>`;
      return;
    }

    // Determine subcategory list for this main category
    let subcategories = [];
    if (mainCategory === "Landscapes & Nature") {
      subcategories = ["nature", "sea side", "sunset/sunrise", "moon"];
    } else if (mainCategory === "People & Places") {
      subcategories = ["people", "places", "city view"];
    } else if (mainCategory === "Art & Creative") {
      subcategories = ["art", "food", "flowers"];
    }

    // Filter Button: "All Subcategories"
    const allBtn = document.createElement("button");
    allBtn.className = `subcat-btn ${activeSubcatFilter === "all" ? "active" : ""}`;
    allBtn.textContent = "All Subcategories";
    allBtn.addEventListener("click", () => {
      document.querySelectorAll(".subcat-btn").forEach((b) => b.classList.remove("active"));
      allBtn.classList.add("active");
      updateTopSubnavActive("all");
      renderMicroThumbnails(categoryEntries);
    });
    subcatList.appendChild(allBtn);

    // Individual Subcategory Pills
    subcategories.forEach((subKey) => {
      const btn = document.createElement("button");
      const isSelected = activeSubcatFilter.toLowerCase() === subKey.toLowerCase();
      btn.className = `subcat-btn ${isSelected ? "active" : ""}`;
      btn.textContent = categoryDisplayNames[subKey] || subKey;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".subcat-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        updateTopSubnavActive(subKey);

        const filtered = categoryEntries.filter(([filename, _]) => {
          const detail = detailedData[filename];
          if (detail && detail.subcategory) {
            return detail.subcategory.toLowerCase() === subKey.toLowerCase();
          }
          return true; // Fallback show
        });
        renderMicroThumbnails(filtered.length > 0 ? filtered : categoryEntries);
      });
      subcatList.appendChild(btn);
    });

    if (activeSubcatFilter !== "all") {
      const filtered = categoryEntries.filter(([filename, _]) => {
        const detail = detailedData[filename];
        if (detail && detail.subcategory) {
          return detail.subcategory.toLowerCase() === activeSubcatFilter.toLowerCase();
        }
        return true;
      });
      renderMicroThumbnails(filtered.length > 0 ? filtered : categoryEntries);
    } else {
      renderMicroThumbnails(categoryEntries);
    }
  }

  // 5. Render Micro-Thumbnails
  function renderMicroThumbnails(entries) {
    if (!folderGrid) return;
    folderGrid.innerHTML = "";

    entries.forEach(([filename, _]) => {
      const img = document.createElement("img");
      const imgPath = filename.startsWith("images/") ? filename : `images/${filename}`;
      img.src = imgPath;
      img.alt = filename;
      img.className = "micro-thumb";
      img.loading = "lazy";

      img.addEventListener("click", () => {
        if (modal && modalImg) {
          modalImg.src = imgPath;
          modal.classList.add("active");
          modal.setAttribute("aria-hidden", "false");
        }
      });

      folderGrid.appendChild(img);
    });
  }

  // 6. Direct Selection Handler for Top Sub-Nav & Dropdown
  function selectGallerySubcategory(targetSubcat) {
    updateTopSubnavActive(targetSubcat);

    if (targetSubcat === "all") {
      openFolderCategory("Landscapes & Nature", "all");
      return;
    }

    const mainCategory = subcategoryToMainFolder[targetSubcat.toLowerCase()] || "Landscapes & Nature";
    openFolderCategory(mainCategory, targetSubcat);
  }

  function updateTopSubnavActive(subcatKey) {
    topSubnavBtns.forEach((btn) => {
      const attr = btn.getAttribute("data-top-subcat");
      btn.classList.toggle("active", attr && attr.toLowerCase() === subcatKey.toLowerCase());
    });
  }

  // Top Subnav Filter Buttons Listener
  topSubnavBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const subcatKey = btn.getAttribute("data-top-subcat");
      if (subcatKey) {
        selectGallerySubcategory(subcatKey);
      }
    });
  });

  // Dropdown Subcategory Links Listener
  dropdownSubcatLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const subcatKey = link.getAttribute("data-subcat");
      if (subcatKey) {
        selectGallerySubcategory(subcatKey);
      }
    });
  });

  // Dropdown Mobile Toggle Support
  if (dropdownToggle && dropdownContainer) {
    dropdownToggle.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdownContainer.classList.toggle("is-open");
      }
    });
  }

  // 7. Modal and Drawer Close Events
  if (folderCloseBtn && folderView) {
    folderCloseBtn.addEventListener("click", () => {
      folderView.hidden = true;
    });
  }

  if (zoomCloseBtn && modal) {
    const closeModal = () => {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    };

    zoomCloseBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // 8. Mobile Navigation Toggle & Smooth Link Closing
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".nav-links a:not(.dropdown-toggle)").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
});