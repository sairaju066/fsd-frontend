import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Search, MapPin, DollarSign, Calendar } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await axios.get('/scholarships');
        setScholarships(res.data);
      } catch (error) {
        console.error('Error fetching scholarships:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  const handleApply = async (id) => {
    if (!user) {
      setMessage({ text: 'Please login to apply for scholarships', type: 'error' });
      return;
    }

    if (user.role !== 'student') {
      setMessage({ text: 'Only students can apply for scholarships', type: 'error' });
      return;
    }

    setApplyingId(id);
    setMessage({ text: '', type: '' });

    try {
      await axios.post(`/applications/${id}`, {
        application_text: 'I am highly interested in this scholarship and meet all the eligibility requirements. Please review my profile for more details.'
      });
      setMessage({ text: 'Application submitted successfully!', type: 'success' });
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to submit application', 
        type: 'error' 
      });
    } finally {
      setApplyingId(null);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const filteredScholarships = scholarships.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4 animate-fade-in">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h1 className="page-title text-gradient mb-1" style={{ fontSize: '2.5rem' }}>Find Scholarships</h1>
          <p className="text-secondary">Discover opportunities that match your potential</p>
        </div>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 text-center`} style={{ 
          background: message.type === 'success' ? 'var(--success-glow)' : 'var(--danger-glow)',
          color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
          borderRadius: 'var(--radius-md)'
        }}>
          {message.text}
        </div>
      )}

      <div className="glass-card mb-4">
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-muted)' }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            className="form-control" 
            style={{ paddingLeft: '48px', fontSize: '1.1rem' }}
            placeholder="Search by keyword, major, or organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader-lg"></div>
      ) : filteredScholarships.length === 0 ? (
        <div className="glass-card text-center p-4 text-muted">
          No scholarships found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-2">
          {filteredScholarships.map(scholarship => (
            <div key={scholarship.id} className="glass-card">
              <h3 className="mb-2" style={{ fontSize: '1.4rem' }}>{scholarship.title}</h3>
              
              <div className="d-flex gap-3 mb-2 text-sm text-secondary">
                <div className="d-flex align-center gap-1">
                  <DollarSign size={16} className="text-success" />
                  <span className="text-primary font-weight-bold">${scholarship.amount}</span>
                </div>
                <div className="d-flex align-center gap-1">
                  <Calendar size={16} className="text-warning" />
                  <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              
              <p className="text-secondary mb-3 text-sm" style={{ 
                display: '-webkit-box', 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical', 
                overflow: 'hidden' 
              }}>
                {scholarship.description}
              </p>
              
              <div className="mb-3 text-sm">
                <strong className="text-primary">Eligibility:</strong>
                <p className="text-secondary mt-1">{scholarship.eligibility_criteria}</p>
              </div>
              
              <div className="d-flex justify-between align-center mt-3">
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  disabled={applyingId === scholarship.id || (user && user.role !== 'student')}
                  onClick={() => handleApply(scholarship.id)}
                >
                  {applyingId === scholarship.id ? <div className="loader"></div> : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Scholarships;
