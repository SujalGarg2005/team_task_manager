import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiPlus, FiGrid, FiList, FiClock, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [issues, setIssues] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAdminIssuesModal, setShowAdminIssuesModal] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [statsRes, projectsRes, activitiesRes] = await Promise.all([
          axios.get(`${API_URL}/tasks/stats`, config),
          axios.get(`${API_URL}/projects`, config),
          axios.get(`${API_URL}/activities`, config)
        ]);
        setStats(statsRes.data);
        setProjects(projectsRes.data);
        setActivities(activitiesRes.data);

        if (user.role === 'Admin') {
          const issuesRes = await axios.get(`${API_URL}/issues`, config);
          setIssues(issuesRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  const reportIssue = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const formData = new FormData(e.target);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/issues`, {
        title: formData.get('title'),
        description: formData.get('description')
      }, config);
      alert('Issue reported successfully!');
      setShowReportModal(false);
    } catch (err) {
      alert('Failed to report issue');
    }
  };

  const updateIssueStatus = async (id, status) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_URL}/issues/${id}`, { status }, config);
      setIssues(issues.map(i => i._id === id ? { ...i, status } : i));
    } catch (err) {
      alert('Failed to update issue');
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, here's what's happening today.</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <motion.div whileHover={{ y: -5 }} className="glass stat-card">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Tasks</span>
          <span className="stat-value" style={{ color: '#818cf8' }}>{stats?.totalTasks || 0}</span>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="glass stat-card">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>In Progress</span>
          <span className="stat-value" style={{ color: '#fbbf24' }}>{stats?.inProgress || 0}</span>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="glass stat-card">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Completed</span>
          <span className="stat-value" style={{ color: '#34d399' }}>{stats?.done || 0}</span>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="glass stat-card">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Overdue</span>
          <span className="stat-value" style={{ color: '#f87171' }}>{stats?.overdue || 0}</span>
        </motion.div>
      </div>

      {/* Tasks Per User Breakdown */}
      {stats?.tasksPerUser && Object.keys(stats.tasksPerUser).length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Tasks Per User</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {Object.entries(stats.tasksPerUser).map(([name, count]) => (
              <motion.div whileHover={{ y: -5 }} key={name} className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{name}</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{count} Tasks</p>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)' }}>
                  <FiList />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Projects Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Your Projects</h2>
            {user.role === 'Admin' && (
              <Link to="/projects/new" className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <FiPlus /> New Project
              </Link>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {projects.map(project => (
              <Link key={project._id} to={`/project/${project._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div whileHover={{ scale: 1.02 }} className="glass" style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>{project.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{project.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                      {project.members.length} Members
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>View Details →</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions / Recent Activity */}
        <aside>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {user.role === 'Admin' && (
              <Link to="/projects/new" style={{ textDecoration: 'none' }}>
                <button className="secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-start' }}>
                  <FiList /> Create Project
                </button>
              </Link>
            )}
            <button onClick={() => setShowHistoryModal(true)} className="secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-start' }}>
              <FiClock /> View History
            </button>
            <button onClick={() => setShowReportModal(true)} className="secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-start' }}>
              <FiAlertCircle /> Report Issue
            </button>
            {user.role === 'Admin' && (
              <button onClick={() => setShowAdminIssuesModal(true)} className="primary" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-start', marginTop: '1rem' }}>
                <FiAlertCircle /> Review Issues ({issues.filter(i => i.status === 'Open').length})
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Recent Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activities.length === 0 ? <p>No recent activity.</p> : activities.map(activity => (
                <div key={activity._id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <p style={{ fontWeight: 600 }}>{activity.action}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{activity.details}</p>
                  <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--primary)' }}>
                    by {activity.user.name} • {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowHistoryModal(false)} className="primary" style={{ width: '100%', marginTop: '2rem' }}>Close</button>
          </div>
        </div>
      )}

      {/* Report Issue Modal */}
      {showReportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Report an Issue</h2>
            <form onSubmit={reportIssue} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Subject</label>
                <input name="title" required placeholder="What's wrong?" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                <textarea name="description" required rows="4" placeholder="Tell us more about the issue..." />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowReportModal(false)} className="secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="primary" style={{ flex: 1 }}>Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Issues Modal */}
      {showAdminIssuesModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Reported Issues</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {issues.length === 0 ? <p>No issues reported.</p> : issues.map(issue => (
                <div key={issue._id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontWeight: 600 }}>{issue.title}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{issue.description}</p>
                      <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                        From: {issue.user.name} ({issue.user.email})
                      </p>
                    </div>
                    <select 
                      value={issue.status} 
                      onChange={(e) => updateIssueStatus(issue._id, e.target.value)}
                      style={{ width: 'auto', padding: '0.25rem', fontSize: '0.75rem' }}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowAdminIssuesModal(false)} className="primary" style={{ width: '100%', marginTop: '2rem' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
