import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const PublicJobView = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/${id}`);
                setJob(response.data);
            } catch (error) {
                setError('Job not found or no longer available');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="public-job-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="public-job-container">
                <div className="public-job-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">😕</div>
                        <h3>{error || 'Job not found'}</h3>
                        <p>This job posting may have been removed or is no longer available.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!job.active) {
        return (
            <div className="public-job-container">
                <div className="public-job-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">🔒</div>
                        <h3>This position is no longer accepting applications</h3>
                        <p>Check back later for new opportunities.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="public-job-container">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)'
                }}>
                    <span style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        width: '50px',
                        height: '50px',
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>📋</span>
                    TalentTrack
                </div>
            </div>

            <div className="public-job-card">
                <span className="badge badge-hired" style={{ marginBottom: '1rem' }}>
                    🟢 Now Hiring
                </span>
                <h1 className="public-job-title">{job.title}</h1>

                <div className="public-job-description">
                    {job.description || 'No description provided for this position.'}
                </div>

                <Link to={`/careers/${id}/apply`} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    Apply Now →
                </Link>

                <div style={{
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border-color)',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem'
                }}>
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default PublicJobView;
