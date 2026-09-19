import { RefObject, useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  rootMargin?: string;
  once?: boolean;
}

interface UseInViewResult<T extends HTMLElement> {
  ref: RefObject<T | null>;
  isInView: boolean;
}

export const useInView = <T extends HTMLElement>({
  rootMargin = '200px',
  once = true,
}: UseInViewOptions = {}): UseInViewResult<T> => {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || (once && isInView)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once, isInView]);

  return { ref, isInView };
};
