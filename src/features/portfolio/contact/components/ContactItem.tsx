import { IconType } from 'react-icons';
import { FaLinkedin, FaPhoneAlt } from 'react-icons/fa';
import { FiBookOpen, FiGithub, FiGlobe, FiInstagram, FiMail } from 'react-icons/fi';
import { toast } from 'sonner';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Contact } from '../type';

interface ContactItemProps {
  contact: Contact;
}

const iconMap: Record<string, IconType> = {
  email: FiMail,
  github: FiGithub,
  blog: FiBookOpen,
  instagram: FiInstagram,
  linkedin: FaLinkedin,
  phone: FaPhoneAlt,
};

const ContactItem = ({ contact }: ContactItemProps) => {
  // 매핑된 아이콘이 없으면 기본 아이콘(FiGlobe) 사용
  const Icon = iconMap[contact.icon.toLowerCase()] || FiGlobe;
  const isExternal = !contact.url.startsWith('mailto:');
  const isEmail = contact.name.toLowerCase() === 'email' || contact.url.startsWith('mailto:');

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isEmail) {
      e.preventDefault();
      try {
        const emailAddress = contact.url.replace('mailto:', '');
        await navigator.clipboard.writeText(emailAddress);
        toast.success('이메일 주소가 성공적으로 복사되었습니다.');
      } catch (error) {
        console.error('복사 실패', error);
        toast.error('이메일 주소 복사에 실패했습니다.');
      }
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            className="shadow-brand-neutral-muted bg-brand-neutral-muted hover:bg-brand-neutral-muted focus-visible:ring-brand-primary focus:visible:ring-offset-2 hover:border-brand-primary/30 focus:ring-brand-primary flex flex-col items-center justify-center gap-3 rounded-2xl border border-transparent p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl focus:ring-4 focus:outline-none focus-visible:ring-2 sm:w-24"
            href={contact.url}
            onClick={handleClick}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            aria-label={
              isEmail
                ? '이메일 주소 복사하기'
                : `${contact.name} 페이지로 이동${isExternal ? ' (새 창에서 열림)' : ''}`
            }
          >
            <Icon size={32} className="text-brand-neutral-dark mb-1" aria-hidden="true" />
            <span className="text-brand-neutral-dark text-sm font-medium">{contact.name}</span>
          </a>
        </TooltipTrigger>
        <TooltipContent>{contact.description ?? contact.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ContactItem;
