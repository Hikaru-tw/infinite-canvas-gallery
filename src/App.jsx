import { useMemo, useRef, useCallback, useState, memo } from 'react';
import { useCanvasDrag } from './useCanvasDrag';
import { generateImagePositions, TILE_SIZE } from './generatePositions';
import './App.css';

const IMAGE_COUNT = 100;

const imageSeeds = Array.from({ length: IMAGE_COUNT }, () =>
  Math.random().toString(36).slice(2)
);

function getTileKey(tx, ty) {
  return `${tx},${ty}`;
}

function getVisibleTiles(ox, oy) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const worldLeft = -ox;
  const worldTop = -oy;
  const worldRight = worldLeft + vw;
  const worldBottom = worldTop + vh;

  const tileMinX = Math.floor(worldLeft / TILE_SIZE) - 1;
  const tileMaxX = Math.floor(worldRight / TILE_SIZE) + 1;
  const tileMinY = Math.floor(worldTop / TILE_SIZE) - 1;
  const tileMaxY = Math.floor(worldBottom / TILE_SIZE) + 1;

  const tiles = [];
  for (let tx = tileMinX; tx <= tileMaxX; tx++) {
    for (let ty = tileMinY; ty <= tileMaxY; ty++) {
      tiles.push({ tx, ty, key: getTileKey(tx, ty) });
    }
  }
  return tiles;
}

const Tile = memo(function Tile({ tx, ty, images, onImageClick }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: tx * TILE_SIZE,
        top: ty * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
    >
      {images.map((img) => (
        <div
          key={img.id}
          className="gallery-image"
          onClick={() => onImageClick(img)}
          style={{
            left: img.x,
            top: img.y,
            width: img.w,
            height: img.h,
            transform: `rotate(${img.rotation}deg)`,
          }}
        >
          <img
            src={img.src}
            alt=""
            loading="lazy"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
});

function App() {
  const surfaceRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);

  const initialOffset = useMemo(() => ({
    x: -TILE_SIZE / 2 + window.innerWidth / 2,
    y: -TILE_SIZE / 2 + window.innerHeight / 2,
  }), []);

  const lastTileKeyRef = useRef('');
  const [visibleTiles, setVisibleTiles] = useState(() =>
    getVisibleTiles(initialOffset.x, initialOffset.y)
  );

  const onMove = useCallback((pos) => {
    if (surfaceRef.current) {
      surfaceRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    }

    const newTiles = getVisibleTiles(pos.x, pos.y);
    const newKey = newTiles.map((t) => t.key).join('|');
    if (newKey !== lastTileKeyRef.current) {
      lastTileKeyRef.current = newKey;
      setVisibleTiles(newTiles);
    }
  }, []);

  const { didDrag, containerRef } = useCanvasDrag(initialOffset, onMove);

  const images = useMemo(() => {
    const positions = generateImagePositions(IMAGE_COUNT);
    return positions.map((pos, i) => ({
      ...pos,
      id: i,
      src: `https://picsum.photos/seed/${imageSeeds[i]}/${pos.w}/${pos.h}`,
    }));
  }, []);

  // Only open lightbox if the user tapped (didn't drag)
  const onImageClick = useCallback((img) => {
    if (didDrag.current) return;
    setLightbox(img);
  }, [didDrag]);

  return (
    <div className="canvas-container" ref={containerRef}>
      <div
        ref={surfaceRef}
        className="canvas-surface"
        style={{
          transform: `translate3d(${initialOffset.x}px, ${initialOffset.y}px, 0)`,
        }}
      >
        {visibleTiles.map(({ tx, ty, key }) => (
          <Tile key={key} tx={tx} ty={ty} images={images} onImageClick={onImageClick} />
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img
            src={lightbox.src}
            alt=""
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            &times;
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
