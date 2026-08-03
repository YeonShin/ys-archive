import { GuestbookMessage } from '../type';
import GuestbookForm from './GuestbookForm';
import GuestbookMessageList from './GuestbookMessageList';

interface GuestBookProps {
  guestbook: GuestbookMessage[];
}

const Guestbook = ({ guestbook }: GuestBookProps) => {
  return (
    <section className="bg-brand-neutral-muted mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl p-7">
      <header className="flex items-center justify-between">
        <h3 className="text-brand-neutral-dark text-base font-bold">방명록</h3>
        <span className="text-brand-secondary font-mono text-xs">총 {guestbook.length}개</span>
      </header>

      <GuestbookForm />

      <GuestbookMessageList guestbook={guestbook} />
    </section>
  );
};

export default Guestbook;
