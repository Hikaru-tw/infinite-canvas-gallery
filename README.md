# Infinite Canvas Image Gallery

A draggable infinite-canvas image gallery built with React and Vite. Browse 100 randomly placed images on a pannable 2D surface with lightbox support.

## Features

- **Infinite canvas** — click and drag to pan freely in any direction
- **Tile-based rendering** — only visible tiles are rendered for performance
- **Lazy-loaded images** — images load on demand via [picsum.photos](https://picsum.photos)
- **Lightbox** — click any image to view it enlarged; click outside or the close button to dismiss
- **Touch & mouse support** — works with both pointer types

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Tech Stack

- [React 19](https://react.dev/) + [Vite 7](https://vite.dev/)
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) (Babel / Fast Refresh)
