import { fetchProjectsData } from '../services/projectsApi';
import ProjectsSection from './ProjectsSection';

const ProjectsContainer = async () => {
  const projectsData = await fetchProjectsData();
  return <ProjectsSection data={projectsData} />;
};

export default ProjectsContainer;
