import { useRef } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  strength?: number;
  type?: 'button' | 'submit';
}

export default function MagneticButton({
  children,
  className,
  href,
  target,
  rel,
  onClick,
  strength = 0.38,
  type = 'button',
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const handleMouseLeave = () => {
    if (wrapRef.current) wrapRef.current.style.transform = '';
  };

  return (
    <div
      ref={wrapRef}
      className="magnetic-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {href ? (
        <a className={className} href={href} target={target} rel={rel}>
          {children}
        </a>
      ) : (
        <button className={className} type={type} onClick={onClick}>
          {children}
        </button>
      )}
    </div>
  );
}
