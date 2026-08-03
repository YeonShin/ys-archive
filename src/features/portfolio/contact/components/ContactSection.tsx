'use client';

import { motion } from 'motion/react';

import SectionHeader from '@/features/portfolio/components/SectionHeader';
import Guestbook from '@/features/portfolio/guestbook/components/Guestbook';
import { GuestbookMessage } from '@/features/portfolio/guestbook/type';
import { getContainerVariants, getItemVariants } from '@/lib/animations';

import { Contact } from '../type';
import ContactItem from './ContactItem';

interface ContactSectionProps {
  contact: Contact[];
  guestbook: GuestbookMessage[];
}

const containerVariants = getContainerVariants();
const itemVariants = getItemVariants();

const ContactSection = ({ contact, guestbook }: ContactSectionProps) => {
  return (
    <motion.section
      id="contact"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="bg-brand-neutral-light flex min-h-screen w-full flex-col items-center gap-8 px-6 py-24 md:py-32"
    >
      <div className="flex w-full max-w-4xl flex-col items-center gap-4">
        <SectionHeader title="Contact" korTitle="연락망" className="text-center" />

        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <h2 className="text-brand-primary text-lg font-bold">
            저의 포트폴리오를 봐주셔서 감사합니다!
          </h2>
          <h3 className="text-brand-secondary text-sm">
            관심있게 보셨다면 아래를 통해 제게 연락주세요 🙇‍♂️
          </h3>
        </motion.div>

        <motion.ul
          variants={itemVariants}
          className="mx-auto grid max-w-3xl grid-cols-2 justify-center gap-4 sm:flex sm:max-w-none sm:flex-wrap"
        >
          {contact.map((item) => (
            <li key={item.id}>
              <ContactItem contact={item} />
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.div
        variants={itemVariants}
        aria-hidden="true"
        className="via-brand-primary/30 mb-14 h-px w-full max-w-4xl bg-linear-to-r from-transparent to-transparent"
      />

      <Guestbook guestbook={guestbook} />
    </motion.section>
  );
};

export default ContactSection;
