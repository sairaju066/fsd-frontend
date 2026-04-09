import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await register(formData);
    
    if (result.success) {
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
    <div className="container d-flex justify-center align-center min-h-[80vh] mt-4 mb-4 animate-fade-in">
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-1 text-gradient">Create Account</h2>
        <p className="text-center text-secondary mb-3 text-sm">Join to find and apply for scholarships</p>
        
        {error && (
          <div className="mb-3 p-2 text-center" style={{ background: 'var(--danger-glow)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '12px', left: '16px', color: 'var(--text-muted)' }}>
                <User size={20} />
              </div>
              <input 
                type="text" 
                name="name"
                className="form-control" 
                style={{ paddingLeft: '48px' }}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '12px', left: '16px', color: 'var(--text-muted)' }}>
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                name="email"
                className="form-control" 
                style={{ paddingLeft: '48px' }}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '12px', left: '16px', color: 'var(--text-muted)' }}>
                <Shield size={20} />
              </div>
              <select 
                name="role"
                className="form-control" 
                style={{ paddingLeft: '48px', appearance: 'none' }}
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="admin">Administrator</option>
              </select>
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
                name="password"
                className="form-control" 
                style={{ paddingLeft: '48px' }}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required 
                minLength={6}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
            {isLoading ? <div className="loader"></div> : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-3 text-sm text-secondary">
          Already have an account? <Link to="/login" className="text-gradient">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
