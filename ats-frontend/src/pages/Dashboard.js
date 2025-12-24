import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, applicationsRes] = await Promise.all([
                api.get('/applications/stats'),
                api.get('/applications')
            ]);
            setStats(statsRes.data);
            setRecentApplications(applicationsRes.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="app-container">
                <Navbar />
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">📊 Dashboard</h1>
                    <Link to="/jobs/new" className="btn btn-primary">
                        ➕ Create New Job
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon primary">💼</div>
                        <div className="stat-content">
                            <h3>{stats?.totalJobs || 0}</h3>
                            <p>Active Jobs</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon secondary">📄</div>
                        <div className="stat-content">
                            <h3>{stats?.totalApplications || 0}</h3>
                            <p>Total Applications</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon warning">🆕</div>
                        <div className="stat-content">
                            <h3>{stats?.applicationsByStatus?.NEW || 0}</h3>
                            <p>New Applications</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon danger">✅</div>
                        <div className="stat-content">
                            <h3>{stats?.applicationsByStatus?.HIRED || 0}</h3>
                            <p>Candidates Hired</p>
                        </div>
                    </div>
                </div>

                {/* Application Status Breakdown */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div className="card-header">
                        <h2 className="card-title">Application Status Breakdown</h2>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {stats?.applicationsByStatus && Object.entries(stats.applicationsByStatus).map(([status, count]) => (
                            <div key={status} style={{
                                background: 'var(--bg-input)',
                                padding: '1rem 1.5rem',
                                borderRadius: 'var(--radius)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <StatusBadge status={status} />
                                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Recent Applications</h2>
                        <Link to="/applications" className="btn btn-secondary btn-sm">
                            View All →
                        </Link>
                    </div>

                    {recentApplications.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <h3>No applications yet</h3>
                            <p>Applications will appear here once candidates apply to your jobs.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Job</th>
                                        <th>Status</th>
                                        <th>Applied</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentApplications.map((app) => (
                                        <tr key={app.id}>
                                            <td>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                                        {app.candidateName}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        {app.candidateEmail}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{app.jobTitle}</td>
                                            <td><StatusBadge status={app.status} /></td>
                                            <td style={{ color: 'var(--text-muted)' }}>
                                                {new Date(app.submittedAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
