import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs/all');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;

        try {
            await api.delete(`/jobs/${id}`);
            setJobs(jobs.filter(job => job.id !== id));
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to delete job');
        }
    };

    const toggleActive = async (job) => {
        try {
            await api.put(`/jobs/${job.id}`, { ...job, active: !job.active });
            fetchJobs();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to update job');
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
                    <h1 className="page-title">💼 Job Postings</h1>
                    <Link to="/jobs/new" className="btn btn-primary">
                        ➕ Create New Job
                    </Link>
                </div>

                {jobs.length === 0 ? (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">💼</div>
                            <h3>No jobs created yet</h3>
                            <p>Create your first job posting to start receiving applications.</p>
                            <Link to="/jobs/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                Create Job
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="job-grid">
                        {jobs.map((job) => (
                            <div key={job.id} className="job-card">
                                <div className="job-card-header">
                                    <h3 className="job-card-title">{job.title}</h3>
                                    <span className={`badge ${job.active ? 'badge-hired' : 'badge-rejected'}`}>
                                        {job.active ? '🟢 Active' : '🔴 Inactive'}
                                    </span>
                                </div>
                                <p className="job-card-description">
                                    {job.description || 'No description provided'}
                                </p>
                                <div className="job-card-footer">
                                    <div className="job-card-meta">
                                        <span>📄 {job.applicationCount || 0} applications</span>
                                        <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    marginTop: '1rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid var(--border-color)'
                                }}>
                                    <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm">
                                        👁️ View
                                    </Link>
                                    <Link to={`/jobs/${job.id}/edit`} className="btn btn-secondary btn-sm">
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => toggleActive(job)}
                                    >
                                        {job.active ? '⏸️ Deactivate' : '▶️ Activate'}
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(job.id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                                <div style={{ marginTop: '0.75rem' }}>
                                    <a
                                        href={`/careers/${job.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
                                    >
                                        🔗 Public application link
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Jobs;
