import { FormEvent, useState } from 'react';
import { Project } from '../types';

type NewProjectModalProps = {
  onClose: () => void;
  onCreate: (project: Project) => void;
  token: string;
};

const mutation = `
  mutation CreateProject($title: String!, $description: String) {
    createProject(title: $title, description: $description) {
      id
      title
      description
      createdAt
      updatedAt
      tasks {
        id
        title
        completed
        createdAt
        projectId
      }
    }
  }
`;

export default function NewProjectModal({ onClose, onCreate, token }: NewProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: mutation,
          variables: { title, description },
        }),
      });

      const payload = await response.json();
      if (!response.ok || payload.errors) {
        throw new Error(payload.errors?.[0]?.message || 'Unable to create project');
      }

      onCreate(payload.data.createProject as Project);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>New project</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>

          <label>
            Description
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
