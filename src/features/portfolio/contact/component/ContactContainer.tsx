import { fetchContactData } from '../services/contactApi';
import ContactSection from './ContactSection';

const ContactContainer = async () => {
  const contactData = await fetchContactData();
  return <ContactSection contact={contactData ? contactData.contact : []} />;
};

export default ContactContainer;
