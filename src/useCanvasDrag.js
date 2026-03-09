import { useCallback, useRef, useEffect } from 'react';

export function useCanvasDrag(initialOffset = { x: 0, y: 0 }, onMove) {
  const offset = useRef({ ...initialOffset });
  const isDragging = useRef(false);
  const didDrag = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const totalDist = useRef(0);
  const velocity = useRef({ x: 0, y: 0 });
  const animationFrame = useRef(null);
  const containerRef = useRef(null);

  const notify = useCallback(() => {
    onMove?.(offset.current);
  }, [onMove]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseDown = (e) => {
      isDragging.current = true;
      didDrag.current = false;
      totalDist.current = 0;
      lastPos.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: 0, y: 0 };
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
    };

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      totalDist.current += Math.abs(dx) + Math.abs(dy);
      if (totalDist.current > 5) {
        didDrag.current = true;
      }
      velocity.current = { x: dx, y: dy };
      lastPos.current = { x: e.clientX, y: e.clientY };
      offset.current.x += dx;
      offset.current.y += dy;
      notify();
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;

      const decelerate = () => {
        velocity.current.x *= 0.92;
        velocity.current.y *= 0.92;

        if (Math.abs(velocity.current.x) < 0.5 && Math.abs(velocity.current.y) < 0.5) {
          animationFrame.current = null;
          return;
        }

        offset.current.x += velocity.current.x;
        offset.current.y += velocity.current.y;
        notify();
        animationFrame.current = requestAnimationFrame(decelerate);
      };

      if (Math.abs(velocity.current.x) > 1 || Math.abs(velocity.current.y) > 1) {
        animationFrame.current = requestAnimationFrame(decelerate);
      }
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [notify]);

  return {
    offset,
    didDrag,
    containerRef,
  };
}
