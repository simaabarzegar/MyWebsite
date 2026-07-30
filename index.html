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
  const dropdownSubsecLinks = document.querySelectorAll(".dropdown-menu a[data-sec]");
  const dropdownContainers = document.querySelectorAll(".nav-item.dropdown");
  const subpageBtns = document.querySelectorAll(".nav-subpage-btn");
  const subnavFilterBtns = document.querySelectorAll(".subnav-filter-btn");

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
    const matchesPage = Array.from(pageSections).some(
      (section) => section.id.toLowerCase() === cleanId
    );

    // Only swap which page is shown when the link actually targets a page.
    // "#contact" targets the always-visible footer, not a tab, so it's left alone.
    if (matchesPage) {
      pageSections.forEach((section) => {
        section.classList.toggle("active", section.id.toLowerCase() === cleanId);
      });

      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle("active", href && href.replace("#", "").toLowerCase() === cleanId);
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const targetElem = document.getElementById(cleanId);
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    // Special handling for Gallery subcategory selection
    if (matchesPage && cleanId === "gallery" && targetSubcat) {
      selectGallerySubcategory(targetSubcat);
    }
  }

  // 4. Subsection Filter Tabs Logic (About, Personal, Research)
  // Shared by the in-page pill buttons and the nav dropdown sub-links below.
  function applySubnavFilter(sectionId, subKey) {
    if (!sectionId || !subKey) return;

    // Update active pill button inside section
    const siblingBtns = document.querySelectorAll(`.subnav-filter-btn[data-sec="${sectionId}"]`);
    siblingBtns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-sub") === subKey));

    // Filter content elements inside section
    const targetSection = document.getElementById(sectionId === "personal" ? "beyond-work" : sectionId);
    if (!targetSection) return;

    const filterableElements = targetSection.querySelectorAll("[data-sub]");
    filterableElements.forEach((elem) => {
      // Skip buttons themselves
      if (elem.classList.contains("subnav-filter-btn")) return;

      const elemSub = elem.getAttribute("data-sub");
      elem.style.display = subKey === "all" || elemSub === subKey ? "" : "none";
    });
  }

  subnavFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      applySubnavFilter(btn.getAttribute("data-sec"), btn.getAttribute("data-sub"));
    });
  });

  // Nav dropdown sub-links (About/Personal/Research) navigate to the page and apply its filter
  dropdownSubsecLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute("data-sec");
      const subKey = link.getAttribute("data-sub");
      const pageId = sectionId === "personal" ? "beyond-work" : sectionId;

      navigateToPage(pageId);
      history.pushState(null, "", `#${pageId}`);
      applySubnavFilter(sectionId, subKey);
    });
  });

  // 5. Header Nav Link Click Handlers
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

  // 6. Open Category Drawer from Card Click
  folderCards.forEach((folder) => {
    folder.addEventListener("click", () => {
      const folderCategory = folder.getAttribute("data-folder");
      openFolderCategory(folderCategory);
    });

    folder.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const folderCategory = folder.getAttribute("data-folder");
        openFolderCategory(folderCategory);
      }
    });
  });

  function openFolderCategory(mainCategory, filterSubcategory = "all") {
    if (folderTitle) folderTitle.textContent = mainCategory;
    if (folderView) folderView.hidden = false;

    setupSubcategoriesAndImages(mainCategory, filterSubcategory);
    folderView?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // 7. Setup Subcategories & Filter Options
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

  // 8. Render Micro-Thumbnails
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

  // 9. Direct Subcategory Selection Handler
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

  dropdownContainers.forEach((container) => {
    const toggle = container.querySelector(".dropdown-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        container.classList.toggle("is-open");
      }
    });
  });

  // 10. Modal and Drawer Close Events
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

  // 11b. Quick Message Form (Footer) — client-side only, no backend
  const surveyForm = document.getElementById("survey-form");
  const formMessage = document.getElementById("form-message");

  if (surveyForm && formMessage) {
    surveyForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(surveyForm);
      const name = formData.get("name")?.toString().trim();

      if (name) {
        formMessage.textContent = `Thank you, ${name}! Your message has been received.`;
        surveyForm.reset();
      }
    });
  }

  // 11. Mobile Navigation Toggle
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // 12. Initial URL Hash Routing & Popstate Support
  function handleUrlHash() {
    const hash = window.location.hash.replace("#", "") || "home";
    navigateToPage(hash);
  }

  window.addEventListener("popstate", handleUrlHash);
  handleUrlHash();
});