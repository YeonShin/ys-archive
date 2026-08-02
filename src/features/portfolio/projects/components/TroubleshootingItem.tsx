import { CheckCircle, Lightbulb, Search, TriangleAlert } from 'lucide-react';

import Markdown from '@/components/ui/markdown';

import { ProjectTroubleshooting } from '../type';
import ImageCarousel from './ImageCarousel';

interface TroubleshootingItemProps {
  troubleshooting: ProjectTroubleshooting;
}

const TroubleshootingItem = ({ troubleshooting }: TroubleshootingItemProps) => {
  return (
    <div className="bg-brand-neutral-muted w-full rounded-2xl p-4">
      <ImageCarousel
        images={
          troubleshooting.images?.map((img) => ({
            url: img.url,
            caption: img.caption,
          })) || []
        }
      />

      <div className="mt-4 flex flex-col gap-4 p-2">
        <h3 className="text-brand-primary text-lg font-bold">{troubleshooting.title}</h3>

        <div className="flex flex-col gap-4">
          {[
            {
              label: '문제 상황',
              icon: <TriangleAlert className="w-4 text-red-500" />,
              content: troubleshooting.problem,
            },
            {
              label: '원인 분석',
              icon: <Search className="w-4 text-blue-500" />,
              content: troubleshooting.cause,
            },
            {
              label: '해결 과정',
              icon: <Lightbulb className="w-4 text-amber-500" />,
              content: troubleshooting.process,
            },
            {
              label: '결과 및 성과',
              icon: <CheckCircle className="w-4 text-green-500" />,
              content: troubleshooting.result,
            },
          ].map(
            (step, idx) =>
              step.content && (
                <div key={idx} className="flex flex-col gap-2">
                  <span className="text-md flex items-center gap-2 font-bold">
                    {step.icon} {step.label}
                  </span>
                  <div className="border-brand-neutral-dark/10 ml-2 border-l-2 pl-4">
                    <Markdown
                      content={step.content}
                      className="text-brand-neutral-dark/90 text-sm leading-relaxed whitespace-pre-wrap"
                    />
                  </div>
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingItem;
