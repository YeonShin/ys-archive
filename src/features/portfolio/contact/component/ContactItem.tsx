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
            className="shadow-brand-neutral-muted bg-brand-neutral-muted hover:bg-brand-neutral-muted hover:border-brand-primary/30 flex flex-col items-center justify-center gap-3 rounded-2xl border border-transparent p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl sm:w-24"
            href={contact.url}
            onClick={handleClick}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            <Icon size={32} className="text-brand-neutral-dark mb-1" />
            <span className="text-brand-neutral-dark text-sm font-medium">{contact.name}</span>
          </a>
        </TooltipTrigger>
        <TooltipContent>{contact.description ?? contact.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ContactItem;
