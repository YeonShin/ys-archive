import { fetchGuestbookData } from '@/features/portfolio/guestbook/services/guestbookApi';

import { fetchContactData } from '../services/contactApi';
import ContactSection from './ContactSection';

const ContactContainer = async () => {
  const contactData = await fetchContactData();
  const guestbookData = await fetchGuestbookData();
  return (
    <ContactSection
      contact={contactData ? contactData.contact : []}
      guestbook={guestbookData ? guestbookData : []}
    />
  );
};

export default ContactContainer;
