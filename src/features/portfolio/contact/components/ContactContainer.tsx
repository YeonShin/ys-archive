import { fetchGuestbookData } from '@/features/portfolio/guestbook/services/guestbook.service';

import { fetchContactData } from '../services/contactApi';
import ContactSection from './ContactSection';

interface ContactContainerProps {
  page: number;
}

const ContactContainer = async ({ page }: ContactContainerProps) => {
  const contactData = await fetchContactData();
  const guestbookResponse = await fetchGuestbookData(page, 5);
  return (
    <ContactSection
      contact={contactData ? contactData.contact : []}
      guestbook={guestbookResponse?.data || []}
      totalCount={guestbookResponse?.totalCount || 0}
      totalPages={guestbookResponse?.totalPages || 1}
      currentPage={guestbookResponse?.currentPage || page}
    />
  );
};

export default ContactContainer;
