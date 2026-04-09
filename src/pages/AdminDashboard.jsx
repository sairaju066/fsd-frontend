import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { RefreshCw, Check, X, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'scholarships'
  
  // New Scholarship form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', amount: '', deadline: '', eligibility_criteria: ''
  });

  const { user } = useContext(AuthContext);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, scholRes] = await Promise.all([
        axios.get('/applications'),
        axios.get('/scholarships')
      ]);
      setApplications(appRes.data);
      setScholarships(scholRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/applications/${id}/status`, { status });
      // Update local state instead of refetching everything
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status } : app
      ));
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    }
  };

  const handleAddScholarship = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/scholarships', formData);
      setFormData({ title: '', description: '', amount: '', deadline: '', eligibility_criteria: '' });
      setShowAddForm(false);
      fetchData(); // Refetch to get new data
      alert('Scholarship added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add scholarship');
    }
  };

  return (
    <div className="container mt-4 animate-fade-in">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h1 className="page-title text-gradient mb-1" style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
          <p className="text-secondary">Administrator panel for {user?.name}</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchData}>
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>

      <div className="d-flex gap-2 mb-4" style={{ background: 'var(--bg-glass)', padding: '8px', borderRadius: 'var(--radius-lg)', display: 'inline-flex' }}>
        <button 
          className={`btn ${activeTab === 'applications' ? 'btn-primary' : ''}`}
          style={{ background: activeTab === 'applications' ? '' : 'transparent', boxShadow: 'none' }}
          onClick={() => setActiveTab('applications')}
        >
          Applications
        </button>
        <button 
          className={`btn ${activeTab === 'scholarships' ? 'btn-primary' : ''}`}
          style={{ background: activeTab === 'scholarships' ? '' : 'transparent', boxShadow: 'none' }}
          onClick={() => setActiveTab('scholarships')}
        >
          Manage Scholarships
        </button>
      </div>

      {loading ? (
        <div className="loader-lg"></div>
      ) : activeTab === 'applications' ? (
        <div>
          <h2 className="mb-3 text-xl">All Applications</h2>
          {applications.length === 0 ? (
            <div className="glass-card text-center p-4 text-muted">No applications found.</div>
          ) : (
            <div className="glass-card" style={{ padding: 0 }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Student</th>
                      <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Scholarship</th>
                      <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Actions / Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '16px' }}>
                          <div className="font-weight-bold">{app.student_name}</div>
                          <div className="text-sm text-secondary">{app.student_email}</div>
                        </td>
                        <td style={{ padding: '16px', fontWeight: '500' }}>{app.scholarship_title}</td>
                        <td style={{ padding: '16px' }}>
                          {app.status === 'pending' ? (
                            <div className="d-flex gap-2">
                              <button className="btn btn-primary" style={{ padding: '6px 12px', background: 'var(--success)' }}
                                onClick={() => handleUpdateStatus(app.id, 'approved')}>
                                <Check size={16} /> Approve
                              </button>
                              <button className="btn btn-danger" style={{ padding: '6px 12px' }}
                                onClick={() => handleUpdateStatus(app.id, 'rejected')}>
                                <X size={16} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`badge badge-${app.status}`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="d-flex justify-between align-center mb-3">
            <h2 className="text-xl">Scholarship Listings</h2>
            <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus size={16} /> Add New
            </button>
          </div>

          {showAddForm && (
            <div className="glass-card mb-4 animate-fade-in" style={{ border: '1px solid var(--accent-primary)' }}>
              <h3 className="mb-3 text-gradient">Create New Scholarship</h3>
              <form onSubmit={handleAddScholarship} className="grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" required 
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Amount ($)</label>
                  <input type="number" className="form-control" required 
                    value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input type="date" className="form-control" required 
                    value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Eligibility</label>
                  <input type="text" className="form-control" required 
                    value={formData.eligibility_criteria} onChange={e => setFormData({...formData, eligibility_criteria: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="3" required 
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="btn btn-primary">Save Scholarship</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-2">
            {scholarships.map(s => (
              <div key={s.id} className="glass-card">
                <h3 className="mb-2">{s.title}</h3>
                <div className="d-flex gap-3 mb-2 text-sm text-secondary">
                  <span>${s.amount}</span> • <span>Deadline: {new Date(s.deadline).toLocaleDateString()}</span>
                </div>
                <p className="text-secondary mb-3 text-sm">{s.description.substring(0, 100)}...</p>
                <div className="text-xs text-muted">Created: {new Date(s.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
