import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { graphqlRequest, saveAuthToken, saveStoredUser } from '../api';
import { User } from '../types';

const loginMutation = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;

type LoginPageProps = {
  onLogin: (user: User) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setPending(true);

    try {
      const response = await graphqlRequest<{ login: { token: string; user: User } }>(loginMutation, { email, password });
      saveAuthToken(response.login.token);
      saveStoredUser(response.login.user);
      onLogin(response.login.user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to log in');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-header">
          <span className="eyebrow">Welcome back</span>
          <h1>Sign in to Workspace</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={pending}>
            {pending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
