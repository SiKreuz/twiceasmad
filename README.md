# twiceasmad - Band Website

A one-page Hugo website for your band with a clean, modern design.

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   hugo server -D
   ```

2. **Add your hero images:**
   - Landscape crop (desktop + phones in landscape): `assets/images/hero-landscape.jpg` (16:9, e.g. 3840×2160)
   - Portrait crop (phones + tablets in portrait): `assets/images/hero-portrait.jpg` (9:19.5, e.g. 1290×2796)
   - The right crop is served automatically by screen orientation

3. **Edit your content:**
   - Update section files in `content/sections/`
   - Adjust site settings in `hugo.toml`
   - Edit styles in `static/css/style.css`

## 📁 Structure

```
/
├── content/
│   └── sections/         # Main content sections (about, music, shows, contact, etc.)
├── static/
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript
│   └── images/           # Images
├── layouts/
│   └── _default/         # Hugo templates
├── data/
├── hugo.toml             # Site configuration
└── README.md
```

## 🛠 Usage

- **Add/Edit Sections:**  
  Create or edit Markdown files in `content/sections/`.  
  Use frontmatter to set `title`, `weight`, and `id`.

- **Customize Site Settings:**  
  Edit `hugo.toml` for site title, description, and social links.

- **Styling:**  
  Modify `static/css/style.css` for custom styles.

- **Build for Production:**  
  ```bash
  hugo
  ```

- **Deploy:**  
  Upload the `public/` directory to your web host or use a service like Netlify or GitHub Pages.

---

Built with