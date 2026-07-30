document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Footer Year
  const yearElem = document.getElementById("year");
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // 2. Element References
  const pageSections = document.querySelectorAll(".page-section");
  const navLinks = document.querySelectorAll(".nav-link");
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
  const subpageCards = document.querySelectorAll(".nav-subpage-card");
  const subpageBtns = document.querySelectorAll(".nav-subpage-btn");

  // Read category data from window object
  const categoryMapping = (window.galleryCategories && window.galleryCategories.mapping) || {};
  const detailedData = (window.galleryCategories && window.galleryCategories.detailed) || {};

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

  // 3. SPA Sub-Page Navigation Router
  function navigateToPage(targetId, targetSubcat = null) {
    const cleanId = targetId.replace("#", "").toLowerCase() || "home";

    // Hide all page sections, activate target section
    pageSections.forEach((section) => {
      const sectionId = section.id.toLowerCase();
      if (sectionId === cleanId) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });

    // Update active class on header nav links
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.replace("#", "").toLowerCase() === cleanId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Scroll to top of section smoothly
    const targetElem = document.getElementById(cleanId);
    if (targetElem) {
      targetElem.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Special handling for Gallery subcategory selection
    if (cleanId === "gallery" && targetSubcat) {
      selectGallerySubcategory(targetSubcat);
    }
  }

  // 4. Header Nav Link Click Handlers
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const pageId = href.replace("#", "");
        navigateToPage(pageId);

        // Update URL Hash without jumping
        history.pushState(null, "", `#${pageId}`);
      }
    });
  });

  // Home Quick Cards Click Handlers
  subpageCards.forEach((card) => {
    card.addEventListener("click", () => {
      const target = card.getAttribute("data-target");
      if (target) {
        navigateToPage(target);
        history.pushState(null, "", `#${target}`);
      }
    });
  });

  subpageBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const href = btn.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const pageId = href.replace("#", "");
        navigateToPage(pageId);
        history.pushState(null, "", `#${pageId}`);
      }
    });
  });

  // Brand Header Title Click Handler -> Go Home
  const brandLink = document.querySelector(".brand");
  if (brandLink) {
    brandLink.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToPage("home");
      history.pushState(null, "", "#home");
    });
  }

  // 5. Open Category Drawer from Card Click
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

  // 6. Setup Subcategories & Filter Options
  function setupSubcategoriesAndImages(mainCategory, activeSubcatFilter = "all") {
    if (!subcatList || !folderGrid) return;
    subcatList.innerHTML = "";
    folderGrid.innerHTML = "";

    const categoryEntries = Object.entries(categoryMapping).filter(([_, catName]) => catName === mainCategory);

    if (categoryEntries.length === 0) {
      folderGrid.innerHTML = `<p style="font-size: 0.9rem; color: var(--text-muted);">No images found for this category.</p>`;
      return;
    }

    let subcategories = [];
    if (mainCategory === "Landscapes & Nature") {
      subcategories = ["nature", "sea side", "sunset/sunrise", "moon"];
    } else if (mainCategory === "People & Places") {
      subcategories = ["people", "places", "city view"];
    } else if (mainCategory === "Art & Creative") {
      subcategories = ["art", "food", "flowers"];
    }

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
          return true;
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

  // 7. Render Micro-Thumbnails
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

  // 8. Direct Subcategory Selection Handler
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

  topSubnavBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const subcatKey = btn.getAttribute("data-top-subcat");
      if (subcatKey) {
        selectGallerySubcategory(subcatKey);
      }
    });
  });

  dropdownSubcatLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const subcatKey = link.getAttribute("data-subcat");
      navigateToPage("gallery", subcatKey);
      history.pushState(null, "", "#gallery");
    });
  });

  if (dropdownToggle && dropdownContainer) {
    dropdownToggle.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdownContainer.classList.toggle("is-open");
      }
    });
  }

  // 9. Modal and Drawer Close Events
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

  // 10. Mobile Navigation Toggle
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // 11. Initial URL Hash Routing & Popstate Support
  function handleUrlHash() {
    const hash = window.location.hash.replace("#", "") || "home";
    navigateToPage(hash);
  }

  window.addEventListener("popstate", handleUrlHash);
  handleUrlHash();
});