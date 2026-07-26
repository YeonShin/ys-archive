'use client';

import { FiBookOpen, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="border-brand-neutral-muted bg-brand-neutral-light border-t py-8">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center gap-4 px-6 md:flex-row md:justify-between md:px-12">
        <p className="text-brand-secondary text-sm font-medium">
          © {new Date().getFullYear()} YS-Archieve. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/YeonShin"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-brand-neutral-dark hover:text-brand-primary transition-colors"
          >
            <FiGithub className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/yeon-s-kim/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-brand-neutral-dark hover:text-brand-primary transition-colors"
          >
            <FiLinkedin className="h-5 w-5" />
          </a>
          <a
            href="https://yeonnim01.tistory.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Blog"
            className="text-brand-neutral-dark hover:text-brand-primary transition-colors"
          >
            <FiBookOpen className="h-5 w-5" />
          </a>
          <a
            href="mailto:yeonshin82@gmail.com"
            aria-label="Email"
            className="text-brand-neutral-dark hover:text-brand-primary transition-colors"
          >
            <FiMail className="h-5 w-5" />
          </a>

          <div className="bg-brand-neutral-muted/50 mx-2 hidden h-4 w-px md:block"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
