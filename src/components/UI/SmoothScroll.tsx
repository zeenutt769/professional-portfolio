import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
    children: React.ReactNode;
    className?: string;
    onScroll?: (e: any) => void;
}

export const SmoothScroll = forwardRef<HTMLDivElement, SmoothScrollProps>(({ children, className = '', onScroll }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Expose the wrapper ref to parent if needed
    useImperativeHandle(ref, () => wrapperRef.current as HTMLDivElement);

    useEffect(() => {
        if (!wrapperRef.current || !contentRef.current) return;

        const lenis = new Lenis({
            wrapper: wrapperRef.current,
            content: contentRef.current,
            lerp: 0.1,
            wheelMultiplier: 1,
            smoothWheel: true,
        });

        if (onScroll) {
            lenis.on('scroll', onScroll);
        }

        const raf = (time: number) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            if (onScroll) {
                lenis.off('scroll', onScroll);
            }
        };
    }, [onScroll]);

    return (
        <div ref={wrapperRef} className={`overflow-y-auto custom-scrollbar ${className}`}>
            <div ref={contentRef} className="min-h-full">
                {children}
            </div>
        </div>
    );
});
