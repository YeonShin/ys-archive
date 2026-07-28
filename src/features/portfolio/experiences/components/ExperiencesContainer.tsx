import { fetchExperiencesData } from '../services/experiencesApi';
import ExperiencesSection from './ExperiencesSection';

const ExperiencesContainer = async () => {
  const experiencesData = await fetchExperiencesData();
  return <ExperiencesSection data={experiencesData} />;
};

export default ExperiencesContainer;
