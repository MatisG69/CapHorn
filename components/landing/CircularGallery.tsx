'use client'

import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
}

// Define the type for a single gallery item
export interface GalleryItem {
  common: string;
  binomial: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
    by: string;
  };
}

// Define the props for the CircularGallery component
interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 600, autoRotateSpeed = 0.02, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastXRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);
    // How many degrees of rotation per pixel dragged horizontally.
    const DRAG_SENSITIVITY = 0.35;
    // How many degrees of rotation per unit of horizontal wheel/trackpad delta.
    const WHEEL_SENSITIVITY = 0.25;

    // Merge the forwarded ref with our internal ref.
    const setRefs = (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    // Pointer (mouse + touch) horizontal drag → rotation
    const startDrag = (clientX: number) => {
      setIsDragging(true);
      lastXRef.current = clientX;
      if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    };
    const moveDrag = (clientX: number) => {
      if (lastXRef.current === null) return;
      const deltaX = clientX - lastXRef.current;
      lastXRef.current = clientX;
      setRotation(prev => prev + deltaX * DRAG_SENSITIVITY);
    };
    const endDrag = () => {
      if (lastXRef.current === null) return;
      lastXRef.current = null;
      // Resume auto-rotation shortly after releasing.
      if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = setTimeout(() => setIsDragging(false), 400);
    };

    useEffect(() => {
      return () => {
        if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
      };
    }, []);

    // Horizontal trackpad / wheel swipe → rotation (vertical wheel scrolls the page)
    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      const onWheel = (e: WheelEvent) => {
        // Only intercept when the gesture is mostly horizontal.
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        e.preventDefault();
        setIsDragging(true);
        if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
        setRotation(prev => prev + e.deltaX * WHEEL_SENSITIVITY);
        dragTimeoutRef.current = setTimeout(() => setIsDragging(false), 400);
      };
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => el.removeEventListener('wheel', onWheel);
    }, []);

    // Effect for auto-rotation when not dragging
    useEffect(() => {
      const autoRotate = () => {
        if (!isDragging) {
          setRotation(prev => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isDragging, autoRotateSpeed]);

    const anglePerItem = 360 / items.length;

    return (
      <div
        ref={setRefs}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn("relative w-full h-full flex items-center justify-center select-none", className)}
        style={{ perspective: '2000px', cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'pan-y' }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); startDrag(e.clientX); }}
        onPointerMove={(e) => { if (lastXRef.current !== null) moveDrag(e.clientX); }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.3, 1 - (normalizedAngle / 180));

            return (
              <div
                key={item.photo.url}
                role="group"
                aria-label={item.common}
                className="absolute w-[300px] h-[400px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-150px',
                  marginTop: '-200px',
                  opacity: opacity,
                  transition: 'opacity 0.3s linear'
                }}
              >
                <div className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden group border border-border bg-card/70 dark:bg-card/30 backdrop-blur-lg">
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />
                  {/* Replaced text-primary-foreground with text-white for consistent color */}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h2 className="text-xl font-bold">{item.common}</h2>
                    <em className="text-sm italic opacity-80">{item.binomial}</em>
                    {item.photo.by ? (
                      <p className="text-xs mt-2 opacity-70">Photo by: {item.photo.by}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
