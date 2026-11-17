import { GUESTBOOK_PAGE_SIZE } from '@/features/portfolio/guestbook/constants/pagination';
import { fetchGuestbookData } from '@/features/portfolio/guestbook/services/guestbook.service';
import { GuestbookResponse } from '@/features/portfolio/guestbook/type';

import { fetchContactData } from '../services/contactApi';
import ContactSection from './ContactSection';

const EMPTY_GUESTBOOK: GuestbookResponse = {
  data: [],
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,
};

// 방명록은 1페이지만 서버(ISR HTML)에서 렌더링하고, 2페이지 이상은 클라이언트에서 조회한다.
const ContactContainer = async () => {
  const [contactData, guestbookResponse] = await Promise.all([
    fetchContactData(),
    fetchGuestbookData(1, GUESTBOOK_PAGE_SIZE),
  ]);

  return (
    <ContactSection
      contact={contactData ? contactData.contact : []}
      initialGuestbook={guestbookResponse ?? EMPTY_GUESTBOOK}
    />
  );
};

export default ContactContainer;
