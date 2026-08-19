# Sima Barzegar Website

A single-page personal website and portfolio for Sima Barzegar. The site presents her professional experience, research, publications, profiles, personal interests, image gallery, documents, milestones, and contact information.

## Access the Repository

The source code is available on GitHub:

<https://github.com/simaabarzegar/MyWebsite>

To download it locally:

```bash
git clone https://github.com/simaabarzegar/MyWebsite.git
cd MyWebsite
```

## Open the Website Locally

This is a static website with no build step, package manager, or required dependencies.

### Option 1: Open the HTML file

Open `index.html` directly in a web browser.

### Option 2: Run a local server

Running a local server provides behavior closer to a hosted website, especially for relative paths and gallery assets.

With Python:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000> in your browser.

Alternatively, with Node.js and `npx`:

```bash
npx serve .
```

Use the local URL shown in the terminal.

## Project Files

- `index.html` - The complete website structure and content.
- `styles.css` - Theme, layout, responsive styles, and animations.
- `script.js` - Navigation, scroll reveals, certificate toggle, footer year, and survey behavior.
- `images/` - Gallery images, categories, and thumbnails.
- `documents/` - Downloadable CV and welcome note files.
- `classify_images.py`, `generate_gallery_data.py`, `generate_thumbnails.py` - Optional scripts for managing gallery data and thumbnails.

## Notes

- The survey form is client-side only. It displays a thank-you message but does not send responses to a server.
- There is currently no published hosting address. The website can be accessed from the GitHub repository or by running it locally as described above.
