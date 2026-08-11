import { fetchHeroData } from '../services/heroApi';
import HeroSection from './HeroSection';

const HeroContainer = async () => {
  const heroData = await fetchHeroData();
  return <HeroSection data={heroData} />;
};

export default HeroContainer;
