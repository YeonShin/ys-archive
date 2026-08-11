import { calculateDurationInWeeks, formatDate } from '@/lib/date';

interface ProjectMetaInfoProps {
  startedAt: string;
  endedAt?: string;
  role: string;
}

const ProjectMetaInfo = ({ startedAt, endedAt, role }: ProjectMetaInfoProps) => {
  return (
    <div className="flex flex-col gap-2">
      {/* 개발 기간 */}
      <div className="flex items-baseline gap-3">
        <span className="text-brand-neutral-dark w-14 shrink-0 font-mono text-xs font-bold">
          개발기간
        </span>
        <span className="text-brand-secondary font-mono text-xs">
          {`${formatDate(startedAt)} - ${formatDate(endedAt)}`}
          {endedAt && (
            <span className="text-brand-secondary ml-1">
              ({calculateDurationInWeeks(startedAt, endedAt)}주)
            </span>
          )}
        </span>
      </div>

      {/* 담당 역할 */}
      <div className="flex items-baseline gap-3">
        <span className="text-brand-neutral-dark w-14 shrink-0 font-mono text-xs font-bold">
          담당역할
        </span>
        <span className="text-brand-secondary font-mono text-xs">{role}</span>
      </div>
    </div>
  );
};

export default ProjectMetaInfo;
