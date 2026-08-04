import SectionHeader from '@/features/portfolio/components/SectionHeader';

const ContactSkeleton = () => {
  return (
    <section
      id="contact-skeleton"
      className="bg-brand-neutral-light flex min-h-screen w-full flex-col items-center gap-8 px-6 py-24 md:py-32"
    >
      <div className="flex w-full max-w-4xl flex-col items-center gap-4">
        <SectionHeader title="Contact" korTitle="Contact" className="text-center" />

        <div className="flex flex-col items-center gap-3 py-1">
          <div className="bg-brand-neutral-muted/60 h-7 w-72 animate-pulse rounded-md sm:w-96" />
          <div className="bg-brand-neutral-muted/60 h-5 w-56 animate-pulse rounded-md sm:w-80" />
        </div>

        <ul className="max-w-ws mx-auto grid grid-cols-2 justify-center gap-4 sm:flex sm:max-w-none sm:flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i}>
              <div className="shadow-brand-neutral-muted bg-brand-neutral-muted flex flex-col items-center justify-center gap-4 rounded-2xl border border-transparent p-5 sm:w-24">
                <div className="bg-brand-neutral-dark/20 h-10 w-10 animate-pulse rounded-full" />
                <div className="bg-brand-neutral-dark/20 h-4 w-12 animate-pulse rounded-md" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="via-brand-primary/30 mb-14 h-px w-full max-w-4xl bg-linear-to-r from-transparent to-transparent" />

      <section className="bg-brand-neutral-muted mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl p-7">
        <header className="flex items-center justify-between">
          <div className="bg-brand-neutral-dark/20 h-5 w-16 animate-pulse rounded-md" />
          <div className="bg-brand-neutral-dark/10 h-4 w-12 animate-pulse rounded-md" />
        </header>

        {/* Form skeleton */}
        <div className="bg-brand-neutral-light space-y-3 rounded-2xl p-5">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="bg-brand-neutral-muted h-10 flex-1 animate-pulse rounded-xl" />
            <div className="bg-brand-neutral-muted h-10 flex-1 animate-pulse rounded-xl" />
          </div>
          <div className="bg-brand-neutral-muted h-24 w-full animate-pulse rounded-xl" />
        </div>

        {/* Message list skeleton */}
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-brand-neutral-light rounded-xl p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="bg-brand-neutral-muted h-4 w-20 animate-pulse rounded-md" />
                <div className="bg-brand-neutral-muted h-3 w-16 animate-pulse rounded-md" />
              </div>
              <div className="bg-brand-neutral-muted h-4 w-3/4 animate-pulse rounded-md" />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default ContactSkeleton;
