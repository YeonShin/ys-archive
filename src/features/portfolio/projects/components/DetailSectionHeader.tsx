interface DetailSectionHeaderProps {
  title: string;
}

const DetailSectionHeader = ({ title }: DetailSectionHeaderProps) => {
  return (
    <header>
      <div className="mb-4 flex items-center gap-3 text-base">
        <div className="bg-brand-primary h-5 w-1 shrink-0 rounded-full" />
        <h2 className="text-brand-neutral-dark font-bold">{title}</h2>
      </div>

      <div className="bg-brand-secondary/30 h-px w-full rounded-full" />
    </header>
  );
};

export default DetailSectionHeader;
