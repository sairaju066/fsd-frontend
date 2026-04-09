import { Link } from 'react-router-dom';
import { Search, Award, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div className="container animate-fade-in">
      <header className="page-header mt-4">
        <h1 className="page-title text-gradient">Fund Your Future</h1>
        <p className="page-subtitle">
          Discover thousands of scholarships and financial aid opportunities tailored for your educational journey.
        </p>
        <div className="d-flex justify-center gap-3 mt-4">
          <Link to="/scholarships" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
            Browse Scholarships
          </Link>
          <Link to="/register" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
            Create Account
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-3 mt-4 mb-4">
        <div className="glass-card text-center">
          <div className="mb-2" style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'var(--bg-tertiary)', color: 'var(--accent-primary)' }}>
            <Search size={32} />
          </div>
          <h3 className="mb-1">Easy Search</h3>
          <p className="text-secondary text-sm">Find scholarships that match your profile with our advanced filtering and search tools.</p>
        </div>
        
        <div className="glass-card text-center">
          <div className="mb-2" style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'var(--bg-tertiary)', color: 'var(--accent-primary)' }}>
            <Award size={32} />
          </div>
          <h3 className="mb-1">Apply Seamlessly</h3>
          <p className="text-secondary text-sm">Submit applications quickly and track all your financial aid opportunities in one place.</p>
        </div>

        <div className="glass-card text-center">
          <div className="mb-2" style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'var(--bg-tertiary)', color: 'var(--accent-primary)' }}>
            <TrendingUp size={32} />
          </div>
          <h3 className="mb-1">Track Progress</h3>
          <p className="text-secondary text-sm">Stay updated with real-time application statuses and never miss a critical deadline again.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
