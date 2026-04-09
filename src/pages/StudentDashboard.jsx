import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get('/applications/my-applications');
        setApplications(res.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge badge-approved d-flex align-center gap-1"><CheckCircle size={14} /> Approved</span>;
      case 'rejected':
        return <span className="badge badge-rejected d-flex align-center gap-1"><XCircle size={14} /> Rejected</span>;
      default:
        return <span className="badge badge-pending d-flex align-center gap-1"><Clock size={14} /> Pending</span>;
    }
  };

  return (
    <div className="container mt-4 animate-fade-in">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h1 className="page-title text-gradient mb-1" style={{ fontSize: '2.5rem' }}>Student Dashboard</h1>
          <p className="text-secondary">Welcome back, {user?.name}</p>
        </div>
        <Link to="/scholarships" className="btn btn-secondary">
          Find More Scholarships
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mb-4 gap-3">
        <div className="glass-card text-center">
          <h2 className="text-3xl text-primary">{applications.length}</h2>
          <p className="text-secondary mt-1">Total Applications</p>
        </div>
        <div className="glass-card text-center">
          <h2 className="text-3xl text-success">
            {applications.filter(a => a.status === 'approved').length}
          </h2>
          <p className="text-secondary mt-1">Approved</p>
        </div>
        <div className="glass-card text-center">
          <h2 className="text-3xl text-warning">
            {applications.filter(a => a.status === 'pending').length}
          </h2>
          <p className="text-secondary mt-1">Pending</p>
        </div>
      </div>

      <h2 className="mb-3 text-xl">My Applications</h2>
      
      {loading ? (
        <div className="loader-lg"></div>
      ) : applications.length === 0 ? (
        <div className="glass-card text-center p-4">
          <p className="text-secondary mb-3">You haven't applied for any scholarships yet.</p>
          <Link to="/scholarships" className="btn btn-primary">Browse Scholarships</Link>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Scholarship Title</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Amount</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Date Applied</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{app.title}</td>
                    <td style={{ padding: '16px', color: 'var(--success)' }}>${app.amount}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px' }}>{getStatusBadge(app.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
