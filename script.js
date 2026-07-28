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

  // Read category data from window object
  const categoryData = (window.galleryCategories && window.galleryCategories.detailed) || {};

  // 3. Open Category Drawer
  folderCards.forEach((folder) => {
    folder.addEventListener("click", () => {
      const folderCategory = folder.getAttribute("data-folder");
      if (folderTitle) folderTitle.textContent = folderCategory;
      if (folderView) folderView.hidden = false;

      folderView?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setupSubcategoriesAndImages(folderCategory);
    });
  });

  // 4. Setup Subcategories & Filter Options
  function setupSubcategoriesAndImages(mainCategory) {
    if (!subcatList || !folderGrid) return;
    subcatList.innerHTML = "";
    folderGrid.innerHTML = "";

    const categoryEntries = Object.entries(categoryData).filter(([_, info]) => {
      const cat = typeof info === "object" ? info.category : info;
      return cat === mainCategory;
    });

    if (categoryEntries.length === 0) {
      folderGrid.innerHTML = `<p style="font-size: 0.9rem; color: var(--text-muted);">No images found for this category.</p>`;
      return;
    }

    const subcategories = Array.from(
      new Set(
        categoryEntries.map(([_, info]) =>
          typeof info === "object" && info.subcategory ? info.subcategory : "General"
        )
      )
    );

    // Filter Button: "All"
    const allBtn = document.createElement("button");
    allBtn.className = "subcat-btn active";
    allBtn.textContent = "All Subcategories";
    allBtn.addEventListener("click", () => {
      document.querySelectorAll(".subcat-btn").forEach((b) => b.classList.remove("active"));
      allBtn.classList.add("active");
      renderMicroThumbnails(categoryEntries);
    });
    subcatList.appendChild(allBtn);

    // Individual Subcategory Pills
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

    renderMicroThumbnails(categoryEntries);
  }

  // 5. Render Micro-Thumbnails
  function renderMicroThumbnails(entries) {
    if (!folderGrid) return;
    folderGrid.innerHTML = "";

    entries.forEach(([filename, info]) => {
      const img = document.createElement("img");
      const imgPath = filename.startsWith("images/") ? filename : `images/${filename}`;
      img.src = imgPath;
      img.alt = typeof info === "object" && info.subcategory ? info.subcategory : filename;
      img.className = "micro-thumb";
      img.loading = "lazy";

      // Lightbox click handler
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

  // 6. Modal and Drawer Close Events
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

  // 7. Mobile Navigation Toggle
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 8. Scroll Animations
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".hero-content, .section, .card, .profile-card, .timeline-item, .highlight-box").forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
});