import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const loop = () => {
      const { x: tx, y: ty } = targetRef.current;
      let { x, y } = currentRef.current;
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      currentRef.current = { x, y };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .card, .magnetic-wrap')) {
        dotRef.current?.classList.add('cursor-hover');
      } else {
        dotRef.current?.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <div ref={dotRef} className="custom-cursor" />;
}
