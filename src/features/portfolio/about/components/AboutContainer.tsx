import { fetchAboutData } from '../services/aboutApi';
import AboutSection from './AboutSection';

const AboutContainer = async () => {
  const aboutData = await fetchAboutData();
  return <AboutSection data={aboutData} />;
};

export default AboutContainer;
