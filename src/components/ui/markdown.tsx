'use client';

import ReactMarkdown from 'react-markdown';

import { cn } from '@/lib/utils';

interface MarkdownProps {
  content: string;
  className?: string;
}

const Markdown = ({ content, className }: MarkdownProps) => {
  return (
    <div className={cn('text-brand-neutral-dark flex flex-col gap-4 leading-relaxed', className)}>
      <ReactMarkdown
        components={{
          strong: ({ node, ...props }) => (
            <strong
              className="bg-brand-primary/10 text-brand-neutral-dark rounded-sm px-1 font-extrabold"
              {...props}
            />
          ),
          em: ({ node, ...props }) => (
            <em className="text-brand-neutral-dark/90 italic" {...props} />
          ),
          code: ({ node, className, ...props }) => (
            <code
              className={`bg-brand-neutral-muted text-brand-primary rounded-md px-1.5 py-0.5 font-mono text-sm ${
                className || ''
              }`}
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-brand-primary/50 text-brand-neutral-dark/70 bg-brand-neutral-muted/50 my-4 rounded-r-lg border-l-4 py-1 pl-4 italic"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-brand-primary decoration-brand-primary/30 hover:decoration-brand-primary font-medium underline underline-offset-4 transition-colors"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="marker:text-brand-primary my-4 list-disc space-y-2 pl-5" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="marker:text-brand-primary my-4 list-decimal space-y-2 pl-5 font-medium"
              {...props}
            />
          ),
          li: ({ node, ...props }) => <li className="text-brand-neutral-dark/80" {...props} />,

          h1: ({ node, ...props }) => (
            <h1 className="text-brand-neutral-dark mt-6 mb-4 text-3xl font-extrabold" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-brand-neutral-dark mt-5 mb-3 text-2xl font-bold" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-brand-neutral-dark mt-4 mb-2 text-xl font-bold" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mb-4 leading-relaxed last:mb-0" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
