import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      // Get user from context or localstorage after login
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role === 'admin') navigate('/admin-dashboard');
        else navigate('/student-dashboard');
      }, 100);
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-center align-center min-h-[80vh] mt-4 animate-fade-in">
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-1 text-gradient">Welcome Back</h2>
        <p className="text-center text-secondary mb-3 text-sm">Login to manage your scholarships</p>
        
        {error && (
          <div className="mb-3 p-2 text-center" style={{ background: 'var(--danger-glow)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '12px', left: '16px', color: 'var(--text-muted)' }}>
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                className="form-control" 
                style={{ paddingLeft: '48px' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '12px', left: '16px', color: 'var(--text-muted)' }}>
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                className="form-control" 
                style={{ paddingLeft: '48px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
            {isLoading ? <div className="loader"></div> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-3 text-sm text-secondary">
          Don't have an account? <Link to="/register" className="text-gradient">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
