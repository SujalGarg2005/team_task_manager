import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiCheckSquare } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="glass" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '12px' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'white', fontSize: '1.25rem', fontWeight: 800 }}>
        <FiCheckSquare style={{ color: 'var(--primary)' }} />
        TeamTask
      </Link>
      
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</p>
          </div>
          <button onClick={logout} className="secondary" style={{ padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
            <FiLogOut />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
