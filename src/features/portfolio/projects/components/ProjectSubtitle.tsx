interface ProjectSubtitleProps {
  subtitle: string;
}

const ProjectSubtitle = ({ subtitle }: ProjectSubtitleProps) => {
  return (
    <p className="text-brand-secondary font-mono text-xs tracking-[0.2em] uppercase">{subtitle}</p>
  );
};

export default ProjectSubtitle;
