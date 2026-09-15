# Ritik Mishra | Technical Writer & Architect Portfolio

A modern, highly-interactive, developer-focused technical writing portfolio and documentation platform.

## Features

- **Docs-as-Code Approach**: Documentation structured like engineering specifications with embedded code samples, architecture diagrams, and API references.
- **Dynamic Mermaid.js Integration**: Automatically generated, responsive architecture diagrams directly from text definitions.
- **Advanced Reading Experience**:
  - **Light/Dark Mode Toggle**: First-class support for both high-contrast dark themes and clean light themes.
  - **Reader Mode**: Distraction-free reading environment that expands content width and hides sidebars.
  - **Font Scaling (A- / A+)**: Accessible text scaling controls.
- **Interactive Network Background**: A dynamic HTML5 canvas particle network background that reacts to mouse movement.
- **Zero-Dependency Core**: Built with Vanilla HTML5, CSS3, and JavaScript.

## Setup & Local Development

To run this portfolio locally, you can use any local HTTP server. For example, using Python 3:

```bash
# Navigate to the repository
cd ormdocs

# Start a local web server on port 8000
python3 -m http.server 8000
```

Then, open your browser and navigate to: `http://localhost:8000/index.html`

## Architecture Highlights

- **CSS Variables First**: All themes and colors are driven by CSS custom properties for instant context switching.
- **Responsive Tables & Code**: Code blocks (`overflow-x: auto`) and tables are fully responsive to prevent breaking the layout on mobile or in split-pane views.
- **Modular JavaScript**: Global state (theme, font size, reader mode) is persisted via `localStorage` to ensure a continuous experience across page navigation.

## Authors
- **Ritik Mishra** - Technical Writer & Architect