import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/projects`, { name, description }, config);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass" 
        style={{ padding: '2.5rem', width: '100%', maxWidth: '500px' }}
      >
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem', fontWeight: 800 }}>Start New Project</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Project Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Website Redesign" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" placeholder="What is this project about?" />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={() => navigate('/')} className="secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="primary" style={{ flex: 1 }}>Create Project</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProject;
