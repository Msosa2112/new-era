import { useEffect, useRef, useState } from 'react';

/**
 * Hook for high-performance viewport scroll reveals using IntersectionObserver.
 * Once an element enters the viewport, .is-revealed is added and observation stops,
 * ensuring 60fps/120fps with zero persistent scroll listeners.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.05) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const rootEl = containerRef.current || document.body;
    if (!rootEl) return;

    const revealAll = (scope: ParentNode) => {
      const targets = scope.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
      targets.forEach((target) => target.classList.add('is-revealed'));
    };

    // Check prefers-reduced-motion or lacking IntersectionObserver
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      revealAll(rootEl);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '60px 0px 40px 0px'
      }
    );

    const observeTargets = (scope: ParentNode) => {
      if (scope instanceof HTMLElement && scope.classList.contains('reveal-on-scroll') && !scope.classList.contains('is-revealed')) {
        observer.observe(scope);
      }
      const targets = scope.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
      targets.forEach((target) => observer.observe(target));
    };

    observeTargets(rootEl);

    // Watch for async rendered cards (e.g. MLS properties, filtered agents, Load More)
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            observeTargets(node);
          }
        });
      }
    });

    mutationObserver.observe(rootEl, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [threshold]);

  return containerRef;
}

/**
 * Animated counter hook that smoothly counts up from 0 to target
 * using an ease-out curve when triggered into view.
 */
export function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return;
    }

    let startTime: number | null = null;
    let frameId: number;

    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4);
    };

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutQuart(progress);
      
      setCount(Math.round(easedProgress * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [target, duration, start]);

  return count;
}
