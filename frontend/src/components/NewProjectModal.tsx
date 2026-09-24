import { Link } from 'react-router-dom';
import { Project } from '../types';

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const completion = project.tasks.length
    ? Math.round((project.tasks.filter((task) => task.completed).length / project.tasks.length) * 100)
    : 0;

  return (
    <Link to={`/projects/${project.id}`} className="project-card">
      <div className="card-header-row">
        <div>
          <span className="project-category">Project</span>
          <h3>{project.title}</h3>
        </div>
        <span className="project-progress">{completion}%</span>
      </div>

      <p>{project.description || 'No description yet.'}</p>

      <div className="card-stats">
        <span>{project.tasks.length} tasks</span>
        <span>{project.tasks.filter((task) => task.completed).length} done</span>
      </div>

      <div className="progress-bar">
        <span style={{ width: `${completion}%` }} />
      </div>
    </Link>
  );
}
