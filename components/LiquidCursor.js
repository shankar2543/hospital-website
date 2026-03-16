import { useEffect, useRef } from 'react';

export default function LiquidCursor() {
  const dotRef = useRef(null);
  const blobRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dot = dotRef.current;
    const blob = blobRef.current;
    if (!dot || !blob) return;

    let mouseX = 0, mouseY = 0;
    let blobX = 0,  blobY = 0;
    let lastX = 0,  lastY = 0;
    let isClicking = false;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onDown = () => {
      isClicking = true;
      blob.style.transition = 'transform 0.08s cubic-bezier(0.4, 0, 0.2, 1)';
      blob.style.transform   = 'translate(-50%, -50%) scale(1.5, 0.65)';
    };

    const onUp = () => {
      isClicking = false;
      blob.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
      blob.style.transform   = 'translate(-50%, -50%) scale(1, 1)';
    };

    const onEnterLink = () => {
      dot.style.width    = '12px';
      dot.style.height   = '12px';
      blob.style.width   = '56px';
      blob.style.height  = '56px';
      blob.style.opacity = '0.6';
    };

    const onLeaveLink = () => {
      dot.style.width    = '8px';
      dot.style.height   = '8px';
      blob.style.width   = '40px';
      blob.style.height  = '40px';
      blob.style.opacity = '1';
    };

    // Attach hover listeners to all interactive elements
    const links = document.querySelectorAll('a, button, [role="button"], input, select, textarea, label');
    links.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink);
      el.addEventListener('mouseleave', onLeaveLink);
    });

    const animate = () => {
      // Dot tracks instantly
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';

      // Blob lags with fluid spring
      blobX += (mouseX - blobX) * 0.11;
      blobY += (mouseY - blobY) * 0.11;
      blob.style.left = blobX + 'px';
      blob.style.top  = blobY + 'px';

      // Velocity-based stretch when not clicking
      if (!isClicking) {
        const dx     = mouseX - lastX;
        const dy     = mouseY - lastY;
        const speed  = Math.sqrt(dx * dx + dy * dy);
        const angle  = Math.atan2(dy, dx) * (180 / Math.PI);
        const sX     = 1 + Math.min(speed * 0.048, 0.55);
        const sY     = 1 - Math.min(speed * 0.024, 0.28);

        if (speed > 1.5) {
          blob.style.transition = 'transform 0.04s linear, width 0.2s, height 0.2s, opacity 0.2s';
          blob.style.transform  = `translate(-50%, -50%) rotate(${angle}deg) scale(${sX}, ${sY})`;
        } else {
          blob.style.transition = 'transform 0.35s ease, width 0.2s, height 0.2s, opacity 0.2s';
          blob.style.transform  = 'translate(-50%, -50%) scale(1, 1)';
        }
      }

      lastX = mouseX;
      lastY = mouseY;
      raf = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup',   onUp);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup',   onUp);
      cancelAnimationFrame(raf);
      links.forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink);
        el.removeEventListener('mouseleave', onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={blobRef} className="cursor-blob" />
    </>
  );
}
