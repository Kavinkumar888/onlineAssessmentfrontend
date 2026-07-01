import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('admin@exam.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(identifier, password);
      if (res.user.role === 'admin') navigate('/admin');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Secure Examination Portal</h2>
        <p>Sign in to continue</p>
        {error ? <div className="error-box">{error}</div> : null}
        <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Email or Register Number" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
