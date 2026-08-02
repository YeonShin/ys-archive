import Image from 'next/image';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { ProjectArchitecture } from '../type';

interface ArchitectureItemProps {
  architecture: ProjectArchitecture;
}

const ArchitectureItem = ({ architecture }: ArchitectureItemProps) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="group bg-brand-neutral-dark/5 relative aspect-4/3 w-full cursor-zoom-in overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105">
            <Image
              src={architecture.url}
              fill
              alt={`${architecture.name} 다이어그램 이미지`}
              unoptimized
              className="absolute"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col bg-linear-to-t from-black/90 to-transparent p-4 pt-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="text-xs font-bold text-white">{architecture.name}</p>
              <p className="text-xs text-white/60">클릭하여 크게 보기</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="max-w-5xl border-none bg-transparent p-0 shadow-none ring-0 sm:w-fit sm:max-w-[90vw]"
        >
          <div className="relative overflow-hidden rounded-xl">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              unoptimized
              src={architecture.url}
              alt={`architecture ${architecture.name}`}
              className="h-auto max-h-[90vh] w-auto max-w-full object-contain"
            />
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col bg-linear-to-t from-black/90 to-transparent p-4 pt-6">
              <p className="text-lg font-bold text-white">{architecture.name}</p>
              <p className="text-sm text-white/60">{architecture.caption}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArchitectureItem;
