import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { graphqlRequest, saveAuthToken, saveStoredUser } from '../api';
import { User } from '../types';

const signupMutation = `
  mutation Signup($email: String!, $username: String!, $password: String!) {
    signup(email: $email, username: $username, password: $password) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;

type SignupPageProps = {
  onLogin: (user: User) => void;
};

export default function SignupPage({ onLogin }: SignupPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setPending(true);

    try {
      const response = await graphqlRequest<{ signup: { token: string; user: User } }>(signupMutation, {
        email,
        username,
        password,
      });
      saveAuthToken(response.signup.token);
      saveStoredUser(response.signup.user);
      onLogin(response.signup.user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-header">
          <span className="eyebrow">Create account</span>
          <h1>Join the workspace</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>

          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={pending}>
            {pending ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
