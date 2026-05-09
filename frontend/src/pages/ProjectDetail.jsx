import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiPlus, FiUserPlus, FiTrash2, FiEdit3 } from 'react-icons/fi';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [projectRes, tasksRes, usersRes] = await Promise.all([
          axios.get(`${API_URL}/projects/${id}`, config),
          axios.get(`${API_URL}/tasks/project/${id}`, config),
          axios.get(`${API_URL}/tasks/users`, config)
        ]);
        setProject(projectRes.data);
        setTasks(tasksRes.data);
        setAllUsers(usersRes.data);
      } catch (err) {
        console.error(err);
        // If project details were loaded but other things failed, we still want to show the project
        if (err.config?.url?.includes('/api/projects/')) {
          alert('Failed to load project details');
        }
      }
    };
    fetchData();
  }, [id, user]);

  const updateTaskStatus = async (taskId, status) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_URL}/tasks/${taskId}/status`, { status }, config);
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const addMember = async (userId) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${API_URL}/projects/${id}/members`, { userId }, config);
      setProject(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  const removeMember = async (userId) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.delete(`${API_URL}/projects/${id}/members/${userId}`, config);
      setProject(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (!project) return <div className="container">Loading...</div>;

  const isAdmin = project.admin._id === user._id || project.admin === user._id;

  return (
    <div className="container" style={{ paddingBottom: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{project.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{project.description}</p>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="secondary" onClick={() => setShowTeamModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiUserPlus /> Manage Team
            </button>
            <button className="primary" onClick={() => setShowTaskModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiPlus /> Add Task
            </button>
          </div>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {['To Do', 'In Progress', 'Done'].map(status => (
          <div key={status}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {status} ({tasks.filter(t => t.status === status).length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.filter(t => t.status === status).map(task => (
                <motion.div 
                  layoutId={task._id}
                  key={task._id} 
                  className="glass task-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: 600 }}>{task.title}</h4>
                    <span style={{ fontSize: '0.75rem' }} className={`priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{task.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Assigned: <strong>{task.assignedTo?.name || 'Unassigned'}</strong>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span>
                      <select 
                        value={task.status} 
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Creation Modal (Simple Overlay) */}
      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Task</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
              const taskData = {
                title: formData.get('title'),
                description: formData.get('description'),
                project: id,
                assignedTo: formData.get('assignedTo'),
                dueDate: formData.get('dueDate'),
                priority: formData.get('priority')
              };
              try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.post(`${API_URL}/tasks`, taskData, config);
                setTasks([...tasks, data]);
                setShowTaskModal(false);
              } catch (err) {
                console.error(err);
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input name="title" placeholder="Task Title" required />
              <textarea name="description" placeholder="Description" rows="3" />
              <select name="assignedTo" required>
                <option value="">Assign To...</option>
                {allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input name="dueDate" type="date" required />
                <select name="priority">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowTaskModal(false)} className="secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="primary" style={{ flex: 1 }}>Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Management Modal */}
      {showTeamModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Manage Team</h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Current Members</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {project.members.map(member => (
                  <div key={member._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <span>{member.name} ({member.email})</span>
                    {member._id !== project.admin._id && (
                      <button onClick={() => removeMember(member._id)} style={{ padding: '0.25rem', background: 'transparent', color: '#f87171' }}>
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Add New Member</h3>
              <select onChange={(e) => e.target.value && addMember(e.target.value)} style={{ padding: '0.5rem' }}>
                <option value="">Select User to Add...</option>
                {allUsers.filter(u => !project.members.some(m => m._id === u._id)).map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <button onClick={() => setShowTeamModal(false)} className="primary" style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
