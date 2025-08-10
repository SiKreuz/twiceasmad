# twiceasmad - Band Website

A one-page Hugo website for your band with a clean, modern design.

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   hugo server -D
   ```

2. **Add your hero image:**
   - Place your band's hero image in `static/images/hero-background.jpg`
   - Recommended size: 1920x1080px or higher

3. **Customize your content:**
   - Edit `data/homepage.yaml` to update sections
   - Modify `hugo.toml` for site settings

## 📝 Customizing Content

### Site Settings
Edit `hugo.toml`:
```toml
title = 'Your Band Name'
[params]
  bandName = "Your Band Name"
  description = "Your Genre/Description"
  
  # Social Media Links
  [[params.social]]
    name = "Facebook"
    url = "https://facebook.com/yourband"
  [[params.social]]
    name = "Instagram"
    url = "https://instagram.com/yourband"
  [[params.social]]
    name = "Spotify"
    url = "https://open.spotify.com/artist/yourid"
  # Add more platforms as needed
```

### Social Media Links
Update your social media in `hugo.toml` using the `[[params.social]]` array:
- Each entry has a `name` and `url` field
- Only entries with non-empty URLs will appear in the footer
- Leave `url = ""` for platforms you don't use
- Easy to add new platforms or reorder existing ones
- Special handling for email (uses `mailto:` automatically)

### Sections Content
Each section is now a separate file in `content/sections/`:
- **about.md**: Band story and background
- **music.md**: Albums, singles, streaming links
- **shows.md**: Concert dates and venues
- **contact.md**: Contact and social media
- **gallery.md**: Photo gallery (example)

#### Adding New Sections
Create a new file in `content/sections/`:
```markdown
---
title: "Merchandise"
weight: 6
id: "merchandise"
---

Check out our latest merch and support the band!

<!-- You can add HTML here -->
<div class="merch-grid">
  <img src="/images/tshirt.jpg" alt="Band T-Shirt">
</div>
```

#### Removing Sections
Simply delete the section file from `content/sections/`.

#### Reordering Sections
Change the `weight` value in the frontmatter (lower numbers appear first).

#### HTML Support
Each section supports:
- **Markdown** for text formatting
- **HTML** for rich content (embeds, forms, galleries)
- **Shortcodes** for Hugo functionality

### Styling
- Main styles: `static/css/style.css`
- Colors: Change the primary color `#ff6b6b` throughout the CSS
- Fonts: Currently using Inter from Google Fonts

## 🎨 Features

- **Responsive Design**: Works on all devices
- **Smooth Scrolling**: Navigation with smooth scroll to sections
- **Sticky Navigation**: Appears after scrolling past hero
- **Mobile Menu**: Hamburger menu for mobile devices
- **Parallax Effect**: Subtle parallax on hero image
- **Animation**: Sections fade in as you scroll

## 📱 Mobile Responsive

The site is fully responsive and includes:
- Mobile navigation menu
- Optimized typography for small screens
- Touch-friendly buttons and links

## 🔧 Advanced Customization

### Adding Social Media Links
Edit the footer section in `layouts/_default/single.html`:
```html
<a href="https://facebook.com/yourband" class="social-link">Facebook</a>
<a href="https://instagram.com/yourband" class="social-link">Instagram</a>
```

### Embedding Media
In any section content, you can add:
- **Spotify**: Embed Spotify players
- **YouTube**: Embed YouTube videos
- **SoundCloud**: Embed SoundCloud widgets

Example in `data/homepage.yaml`:
```yaml
content: |
  Check out our latest single:
  
  <iframe src="https://open.spotify.com/embed/track/..." width="100%" height="380"></iframe>
```

### Custom CSS
Add custom styles to `static/css/style.css` or create additional CSS files.

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to GitHub Actions
4. Create `.github/workflows/hugo.yml` for automated deployment

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `hugo`
3. Set publish directory: `public`

## 📁 File Structure

```
/
├── content/
│   └── _index.md          # Homepage content
├── data/
│   └── homepage.yaml      # Sections content (EDIT THIS)
├── layouts/
│   └── _default/
│       ├── baseof.html    # Base template
│       └── single.html    # Homepage layout
├── static/
│   ├── css/
│   │   └── style.css      # Main styles
│   ├── js/
│   │   └── main.js        # JavaScript functionality
│   └── images/
│       └── README.md      # Image guidelines
└── hugo.toml              # Site configuration
```

## 🎵 Tips for Band Websites

1. **High-quality images**: Use professional photos
2. **Fast loading**: Optimize images and minimize code
3. **Contact info**: Make it easy for bookers to reach you
4. **Social proof**: Include press quotes, streaming numbers
5. **Call-to-action**: Direct visitors to listen, follow, or book
6. **Mobile-first**: Most visitors will be on mobile devices

## 🛠️ Troubleshooting

### Hugo not found
Install Hugo: https://gohugo.io/installation/

### Images not showing
- Check file path: `static/images/hero-background.jpg`
- Verify image format (JPG, PNG, WebP)
- Clear browser cache

### Sections not updating
- Restart Hugo server after editing `data/homepage.yaml`
- Check YAML syntax (indentation matters)

---

Built with ❤️ for your band's success!
