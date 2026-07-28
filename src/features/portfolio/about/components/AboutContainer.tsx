import Markdown from '@/components/ui/markdown';

import { fetchAboutData } from '../services/aboutApi';
import AboutSection from './AboutSection';

const AboutContainer = async () => {
  const aboutData = await fetchAboutData();
  return (
    <AboutSection data={aboutData}>
      <Markdown content={aboutData?.aboutText || ''} className="w-full" />
    </AboutSection>
  );
};

export default AboutContainer;
