'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// 하단 도트(Dots) 인디케이터 컴포넌트
const CarouselDots = () => {
  const { api } = useCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!api) return;

    let mounted = true;
    requestAnimationFrame(() => {
      if (mounted) {
        setScrollSnaps(api.scrollSnapList());
        setSelectedIndex(api.selectedScrollSnap());
      }
    });

    api.on('select', () => {
      setSelectedIndex(api.selectedScrollSnap());
    });

    return () => {
      mounted = false;
    };
  }, [api]);

  return (
    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          className={cn(
            'focus-visible:ring-brand-primary h-2 w-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            index === selectedIndex
              ? 'bg-brand-primary w-4'
              : 'bg-brand-secondary/70 hover:bg-brand-secondary',
          )}
          onClick={() => api?.scrollTo(index)}
          aria-label={`${index + 1}번째 슬라이드로 이동`}
          aria-pressed={index === selectedIndex}
        />
      ))}
    </div>
  );
};

export interface CarouselImage {
  url: string;
  caption?: string;
}

interface ImageCarouselProps {
  images?: CarouselImage[];
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
  if (!images) {
    return null;
  }

  return (
    <>
      {images.length > 0 && (
        <Carousel className="group relative w-full">
          <CarouselContent>
            {images.map((image, index) => {
              return (
                <CarouselItem key={index}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="group border-brand-neutral-muted bg-brand-neutral-muted/30 focus-visible:ring-brand-primary relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-xl border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        aria-label={
                          image.caption
                            ? `${image.caption} 이미지 확대`
                            : `${index + 1}번째 스크린샷 이미지 확대`
                        }
                      >
                        <Image
                          fill
                          unoptimized
                          src={image.url}
                          alt={image.caption ? image.caption : `screenshot ${index + 1}`}
                          className="object-cover"
                        />
                        {image.caption && (
                          <div
                            className="text-brand-neutral-light absolute bottom-4 left-4 hidden rounded-xl bg-black/70 px-3 py-1 text-sm font-medium sm:block"
                            aria-hidden="true"
                          >
                            <p className="font-bold text-white">{image.caption}</p>
                          </div>
                        )}
                      </button>
                    </DialogTrigger>
                    <DialogContent
                      showCloseButton={false}
                      className="max-w-4xl border-none bg-transparent p-0 shadow-none ring-0 sm:w-fit sm:max-w-[90vw]"
                    >
                      <div className="relative overflow-hidden rounded-xl">
                        <Image
                          width={0}
                          height={0}
                          sizes="100vw"
                          unoptimized
                          src={image.url}
                          alt={image.caption ? image.caption : `screenshot ${index + 1}`}
                          className="w-full object-contain"
                        />

                        {image.caption && (
                          <div className="text-brand-neutral-light absolute bottom-4 left-4 rounded-xl bg-black/70 px-3 py-1 text-sm font-medium">
                            <p className="font-bold text-white">{image.caption}</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* 하단 도트 인디케이터 */}
          <CarouselDots />

          {/* 좌우 네비게이션 버튼 */}
          <CarouselPrevious
            size="icon-sm"
            className="bg-brand-neutral-dark text-brand-neutral-light hover:bg-brand-neutral-dark/80 hover:text-brand-neutral-light left-4 hidden border-none sm:inline-flex"
          />
          <CarouselNext
            size="icon-sm"
            className="bg-brand-neutral-dark text-brand-neutral-light hover:bg-brand-neutral-dark/80 hover:text-brand-neutral-light right-4 hidden border-none sm:inline-flex"
          />
        </Carousel>
      )}
    </>
  );
};

export default ImageCarousel;
