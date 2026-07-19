import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-brand-neutral-light flex flex-1 flex-col items-center justify-center font-sans">
      <main className="bg-brand-neutral-muted border-brand-secondary/15 flex w-full max-w-3xl flex-1 flex-col items-center justify-between rounded-3xl border px-16 py-32 sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-brand-neutral-dark max-w-xs text-3xl leading-10 font-semibold tracking-tight">
            To get started, edit the page.tsx file.
          </h1>
          <p className="text-brand-secondary max-w-md text-lg leading-8">
            Looking for a starting point or more instructions? Head over to{' '}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="text-brand-primary font-medium"
            >
              Templates
            </a>{' '}
            or the{' '}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="text-brand-primary font-medium"
            >
              Learning
            </a>{' '}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="bg-brand-neutral-dark text-brand-neutral-light hover:bg-brand-primary flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 transition-colors md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="border-brand-secondary/30 text-brand-neutral-dark hover:bg-brand-neutral-light flex h-12 w-full items-center justify-center rounded-full border border-solid px-5 transition-colors hover:border-transparent md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
