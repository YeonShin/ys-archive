const ProjectDetailSkeleton = () => {
  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between px-8 py-6">
        <div className="bg-brand-secondary/20 h-4 w-24 animate-pulse rounded-md" />
        <div className="bg-brand-secondary/20 h-8 w-8 animate-pulse rounded-full" />
      </div>

      <article className="flex flex-col gap-8 px-8">
        <div className="bg-brand-secondary/20 aspect-video w-full animate-pulse rounded-xl" />

        <div className="bg-brand-neutral-muted flex w-full flex-col gap-4 rounded-2xl px-5 py-8">
          <div className="bg-brand-secondary/20 h-8 w-2/3 animate-pulse rounded-lg" />
          <div className="bg-brand-secondary/10 h-4 w-1/3 animate-pulse rounded-md" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-brand-secondary/20 h-6 w-32 animate-pulse rounded-md" />
          <div className="bg-brand-secondary/10 h-4 w-full animate-pulse rounded-md" />
          <div className="bg-brand-secondary/10 h-4 w-5/6 animate-pulse rounded-md" />
        </div>
      </article>
    </div>
  );
};

export default ProjectDetailSkeleton;
