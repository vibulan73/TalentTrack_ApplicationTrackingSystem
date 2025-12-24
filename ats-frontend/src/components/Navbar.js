import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    <span className="navbar-brand-icon">📋</span>
                    TalentTrack
                </Link>

                <ul className="navbar-nav">
                    <li>
                        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                            📊 Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}>
                            💼 Jobs
                        </Link>
                    </li>
                    <li>
                        <Link to="/applications" className={`nav-link ${isActive('/applications') ? 'active' : ''}`}>
                            📄 Applications
                        </Link>
                    </li>
                </ul>

                <div className="navbar-user">
                    <div className="user-info">
                        <div className="user-name">{user?.fullName}</div>
                        <div className="user-role">Recruiter</div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
