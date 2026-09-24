import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import NewProjectModal from '../components/NewProjectModal';
import { User, Project } from '../types';

const projectsQuery = `
  query Projects {
    projects {
      id
      title
      description
      createdAt
      updatedAt
      tasks {
        id
        title
        description
        completed
        projectId
        createdAt
        completedAt
      }
    }
  }
`;

type DashboardPageProps = {
  user: User;
  onLogout: () => void;
};

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('workspace_token') || '';

  const fetchProjects = async () => {
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: projectsQuery }),
    });

    const payload = await response.json();
    if (!response.ok || payload.errors) {
      throw new Error(payload.errors?.[0]?.message || 'Unable to fetch projects');
    }

    setProjects(payload.data.projects as Project[]);
  };

  useEffect(() => {
    fetchProjects().catch((error) => console.error(error)).finally(() => setLoading(false));
  }, []);

  const handleProjectCreated = (project: Project) => {
    setProjects((current) => [project, ...current]);
  };

  const totalTasks = projects.reduce((sum, project) => sum + project.tasks.length, 0);
  const completedTasks = projects.reduce(
    (sum, project) => sum + project.tasks.filter((task) => task.completed).length,
    0
  );

  return (
    <div className="app-shell">
      <Sidebar username={user.username} onLogout={onLogout} />

      <main className="main-panel">
        <header className="topbar">
          <div>
            <span className="eyebrow">Overview</span>
            <h1>Dashboard</h1>
          </div>
          <button className="primary-button" onClick={() => setShowModal(true)}>New project</button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Projects</span>
            <strong>{projects.length}</strong>
          </div>
          <div className="stat-card">
            <span>Tasks</span>
            <strong>{totalTasks}</strong>
          </div>
          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>
        </section>

        <section className="project-section">
          <div className="section-header">
            <h2>Recent projects</h2>
          </div>

          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <h3>No projects yet</h3>
              <p>Create your first project to get started.</p>
            </div>
          ) : (
            <div className="project-grid">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      </main>

      {showModal ? <NewProjectModal token={token} onClose={() => setShowModal(false)} onCreate={handleProjectCreated} /> : null}
    </div>
  );
}
