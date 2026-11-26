import Image from 'next/image';

import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { ProjectArchitecture } from '../type';

interface ArchitectureItemProps {
  architecture: ProjectArchitecture;
}

const ArchitectureItem = ({ architecture }: ArchitectureItemProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label={`${architecture.name} 다이어그램 크게 보기`}
          className="group bg-brand-neutral-dark/5 hover:bg-brand-neutral-dark/5 focus-visible:ring-brand-primary relative aspect-4/3 h-auto w-full cursor-zoom-in overflow-hidden rounded-xl p-0 whitespace-normal transition-transform duration-300 hover:scale-105 focus-visible:ring-2"
        >
          <Image
            src={architecture.url}
            fill
            sizes="(max-width: 767px) 90vw, 45vw"
            alt={`${architecture.name} 다이어그램 이미지`}
            className="object-contain"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col bg-linear-to-t from-black/90 to-transparent p-4 pt-6 text-left transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <p className="text-xs font-bold text-white">{architecture.name}</p>
            <p className="text-xs text-white/60">클릭하여 크게 보기</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="group max-w-5xl border-none bg-transparent p-0 shadow-none ring-0 sm:w-fit sm:max-w-[90vw]"
      >
        <DialogTitle className="sr-only">
          {architecture.name} 아키텍처 다이어그램 확대 보기
        </DialogTitle>
        <DialogDescription className="sr-only">
          {architecture.caption || `${architecture.name} 다이어그램 이미지`}
        </DialogDescription>

        <div className="relative overflow-hidden rounded-xl">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="다이어그램 확대 보기 닫기"
              className="focus-visible:ring-brand-primary absolute top-3 right-3 z-20 rounded-full bg-black/70 text-white hover:bg-black/90 hover:text-white focus-visible:ring-2"
            >
              <XIcon aria-hidden="true" />
            </Button>
          </DialogClose>

          <Image
            width={0}
            height={0}
            sizes="(max-width: 639px) 100vw, 90vw"
            src={architecture.url}
            alt={`architecture ${architecture.name}`}
            className="h-auto max-h-[90vh] w-auto max-w-full object-contain"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col bg-linear-to-t from-black/90 to-transparent p-4 pt-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-lg font-bold text-white">{architecture.name}</p>
            <p className="text-sm text-white/60">{architecture.caption}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArchitectureItem;
