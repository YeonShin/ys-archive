import { fetchTechStacksData } from '../services/techStacksApi';
import TechStacksSection from './TechStacksSection';

const TechStacksContainer = async () => {
  const techData = await fetchTechStacksData();
  return <TechStacksSection data={techData} />;
};

export default TechStacksContainer;
