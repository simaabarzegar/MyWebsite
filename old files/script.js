const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const folderTriggers = document.querySelectorAll('.gallery-folder');
const folderView = document.getElementById('folder-view');
const folderViewGrid = document.getElementById('folder-view-grid');
const folderViewTitle = document.getElementById('folder-view-title');
const folderViewClose = document.querySelector('.folder-view-close');
const zoomModal = document.getElementById('zoom-modal');
const zoomModalImage = document.getElementById('zoom-modal-image');
const zoomModalClose = document.querySelector('.zoom-modal-close');

const allGalleryImages = (window.galleryImages || [])
  .filter((imageName) => /\.(jpe?g|png)$/i.test(imageName));

const categoryMapping = (window.galleryCategories && window.galleryCategories.mapping) || {};

const categoryDisplayNames = {
  'nature': 'Nature',
  'sea side': 'Sea side',
  'sunset/sunrise': 'Sunset / Sunrise',
  'moon': 'Moon',
  'people': 'People',
  'places': 'Places',
  'city view': 'City view',
  'art': 'Art',
  'food': 'Food',
  'flowers': 'Flowers'
};

const mainFolders = {
  landscapes: {
    title: 'Landscapes & nature',
    subtitle: 'Nature, sea side, sunset/sunrise, and moon photos.',
    subcategories: ['nature', 'sea side', 'sunset/sunrise', 'moon']
  },
  people: {
    title: 'People & places',
    subtitle: 'People, places, and city views.',
    subcategories: ['people', 'places', 'city view']
  },
  creative: {
    title: 'Art & creative',
    subtitle: 'Art, food, and flower photos.',
    subcategories: ['art', 'food', 'flowers']
  }
};

const folderImages = Object.fromEntries(
  Object.entries(mainFolders).map(([folderKey, folder]) => [
    folderKey,
    allGalleryImages.filter((imageName) => folder.subcategories.includes(categoryMapping[imageName]))
  ])
);

const folderCategoryLists = Object.fromEntries(
  Object.entries(mainFolders).map(([folderKey, folder]) => [
    folderKey,
    folder.subcategories.filter((subcat) => Object.values(categoryMapping).includes(subcat))
  ])
);

if (folderTriggers.length && folderView && folderViewGrid) {
  let activeFolder = null;
  let activeSubcategory = null;

  const renderSubcategories = (folderKey) => {
    const list = document.getElementById('folder-subcategory-list');
    if (!list) return;

    const availableSubcats = folderCategoryLists[folderKey] || [];
    list.innerHTML = availableSubcats
      .map((subcategory) => `<button type="button" class="folder-subcategory-button" data-folder="${folderKey}" data-subcategory="${subcategory}">${categoryDisplayNames[subcategory] || subcategory}</button>`)
      .join('');

    list.querySelectorAll('.folder-subcategory-button').forEach((button) => {
      button.addEventListener('click', () => {
        const subcategory = button.dataset.subcategory;
        renderFolderImages(folderKey, subcategory);
      });
    });
  };

  const renderFolderImages = (folderKey, subcategory) => {
    if (!folderViewTitle) return;
    activeFolder = folderKey;
    activeSubcategory = subcategory;
    folderViewGrid.innerHTML = (allGalleryImages
      .filter((imageName) => categoryMapping[imageName] === subcategory)
      .map((imageName) => `<img src="images/${imageName}" alt="${subcategory} photo" loading="lazy" data-full-image="images/${imageName}" />`)
      .join('')) || '<p class="folder-empty">No images found for this subcategory yet.</p>';

    folderViewGrid.querySelectorAll('img').forEach((image) => {
      image.addEventListener('click', () => {
        if (zoomModal && zoomModalImage) {
          zoomModalImage.src = image.dataset.fullImage;
          zoomModalImage.alt = image.alt;
          zoomModal.hidden = false;
          zoomModal.classList.add('is-open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const buttons = document.querySelectorAll('.folder-subcategory-button');
    buttons.forEach((button) => {
      button.classList.toggle('active', button.dataset.subcategory === subcategory);
    });
  };

  const openFolder = (folderKey, title) => {
    folderView.hidden = false;
    if (folderViewTitle) {
      folderViewTitle.textContent = title;
    }
    renderSubcategories(folderKey);
    const defaultSubcategory = folderCategoryLists[folderKey]?.[0] || 'nature';
    renderFolderImages(folderKey, defaultSubcategory);
  };

  const closeFolder = () => {
    folderView.hidden = true;
    folderViewGrid.innerHTML = '';
  };

  folderTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      openFolder(trigger.dataset.folder, trigger.dataset.title || 'Gallery');
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openFolder(trigger.dataset.folder, trigger.dataset.title || 'Gallery');
      }
    });
  });

  if (folderViewClose) {
    folderViewClose.addEventListener('click', closeFolder);
  }
}

if (zoomModal && zoomModalClose) {
  const closeZoomModal = () => {
    zoomModal.hidden = true;
    zoomModal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  zoomModal.addEventListener('click', (event) => {
    if (event.target === zoomModal) {
      closeZoomModal();
    }
  });

  zoomModalClose.addEventListener('click', closeZoomModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeZoomModal();
    }
  });
}

const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');

if (nav && navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.hero-content, .section, .card, .profile-card, .timeline-item, .highlight-box, .survey-form, .section-heading').forEach((element) => {
  element.classList.add('reveal');
  revealObserver.observe(element);
});

const certificateCard = document.querySelector('.certificate-card');
const certificateToggle = document.querySelector('.certificate-toggle');

if (certificateCard && certificateToggle) {
  certificateToggle.addEventListener('click', () => {
    certificateCard.classList.toggle('is-open');
    certificateToggle.textContent = certificateCard.classList.contains('is-open') ? 'Hide certificate' : 'View certificate';
  });
}

const form = document.getElementById('survey-form');
const message = document.getElementById('form-message');

if (form && message) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name')?.toString().trim();

    if (name) {
      message.textContent = `Thank you, ${name}! Your message has been received.`;
      form.reset();
    }
  });
}

document.addEventListener('contextmenu', (event) => {
  if (event.target.closest('.hero-photo')) {
    event.preventDefault();
  }
});
