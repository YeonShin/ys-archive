import { GuestbookMessage } from '../type';
import GuestbookForm from './GuestbookForm';
import GuestbookMessageList from './GuestbookMessageList';

interface GuestBookProps {
  guestbook: GuestbookMessage[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const Guestbook = ({ guestbook, totalCount, totalPages, currentPage }: GuestBookProps) => {
  return (
    <section className="bg-brand-neutral-muted mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl p-7">
      <header className="flex items-center justify-between">
        <h3 className="text-brand-neutral-dark text-base font-bold">방명록</h3>
        <span className="text-brand-secondary font-mono text-xs">총 {totalCount}개</span>
      </header>

      <GuestbookForm />

      <GuestbookMessageList
        guestbook={guestbook}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </section>
  );
};

export default Guestbook;
