import { useEffect, useState } from 'react';

export const useActiveSection = (sectionIds: readonly string[]) => {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0, rootMargin: '-40% 0px -40% 0px' },
    );

    const observedElements = new Set<string>();

    const observeElements = () => {
      sectionIds.forEach((id) => {
        if (!observedElements.has(id)) {
          const element = document.getElementById(id);
          if (element) {
            observer.observe(element);
            observedElements.add(id);
          }
        }
      });
      return observedElements.size === sectionIds.length;
    };

    // 초기 렌더링 시 등록 시도
    if (!observeElements()) {
      //  DOM에 아직 없는 요소가 있다면 MutationObserver로 감지 후 등록
      const mutationObserver = new MutationObserver(() => {
        if (observeElements()) {
          mutationObserver.disconnect();
        }
      });

      mutationObserver.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        mutationObserver.disconnect();
      };
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });

      document.body.style.pointerEvents = 'none';

      const handleScrollEnd = () => {
        document.body.style.pointerEvents = 'auto';
        window.removeEventListener('scrollend', handleScrollEnd);
        clearTimeout(fallbackTimeout);
      };

      window.addEventListener('scrollend', handleScrollEnd);

      const fallbackTimeout = setTimeout(handleScrollEnd, 1000);
    }
  };

  return { activeSection, scrollTo };
};
