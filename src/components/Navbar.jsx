import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand text-gradient">
          <GraduationCap size={28} />
          <span>ScholarLink</span>
        </Link>
        <div className="navbar-nav">
          <Link to="/scholarships" className="nav-link">Scholarships</Link>
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} className="nav-link">
                Dashboard
              </Link>
              <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '6px 16px' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '6px 16px' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
