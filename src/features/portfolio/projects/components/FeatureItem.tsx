import Markdown from '@/components/ui/markdown';

import { ProjectKeyFeature } from '../type';

interface FeatureItemProps {
  feature: ProjectKeyFeature;
  index: number;
}

const FeatureItem = ({ feature, index }: FeatureItemProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="bg-brand-primary text-brand-neutral-light rounded-lg p-1 px-2.5 font-mono text-xs">{`${index < 10 ? `0${index}` : index}`}</span>
        <p className="text-brand-neutral-dark text-md font-bold">{feature.title}</p>
      </div>

      <ul className="space-y-2 pl-2">
        {feature.desc.map((desc, index) => (
          <li className="flex gap-2 text-sm" key={index}>
            <span className="text-brand-primary shrink-0 pt-0.5 text-xs">▸</span>
            <Markdown content={desc} className="text-brand-neutral-dark" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeatureItem;
