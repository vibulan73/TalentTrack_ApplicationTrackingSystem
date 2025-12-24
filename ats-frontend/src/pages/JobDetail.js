import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [jobRes, appsRes] = await Promise.all([
                api.get(`/jobs/${id}`),
                api.get(`/applications?jobId=${id}`)
            ]);
            setJob(jobRes.data);
            setApplications(appsRes.data);
        } catch (error) {
            console.error('Error fetching job data:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (applicationId, newStatus) => {
        try {
            await api.put(`/applications/${applicationId}/status`, { status: newStatus });
            setApplications(applications.map(app =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            alert('Failed to update status');
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

    if (!job) {
        return (
            <div className="app-container">
                <Navbar />
                <main className="main-content">
                    <div className="empty-state">
                        <h3>Job not found</h3>
                        <Link to="/jobs" className="btn btn-primary">Back to Jobs</Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content">
                <div className="page-header">
                    <div>
                        <Link to="/jobs" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                            ← Back to Jobs
                        </Link>
                        <h1 className="page-title">{job.title}</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span className={`badge ${job.active ? 'badge-hired' : 'badge-rejected'}`}>
                            {job.active ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                        <Link to={`/jobs/${id}/edit`} className="btn btn-secondary">
                            ✏️ Edit
                        </Link>
                    </div>
                </div>

                {/* Job Details */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>📋 Job Description</h3>
                    <p style={{
                        whiteSpace: 'pre-wrap',
                        color: 'var(--text-primary)',
                        lineHeight: '1.8'
                    }}>
                        {job.description || 'No description provided'}
                    </p>
                    <div style={{
                        marginTop: '1.5rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border-color)',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem'
                    }}>
                        <span>📅 Created: {new Date(job.createdAt).toLocaleDateString()}</span>
                        <span style={{ marginLeft: '2rem' }}>👤 By: {job.createdByName}</span>
                        <span style={{ marginLeft: '2rem' }}>
                            🔗 <a href={`/careers/${job.id}`} target="_blank" rel="noopener noreferrer">
                                Public Application Link
                            </a>
                        </span>
                    </div>
                </div>

                {/* Applications */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">📄 Applications ({applications.length})</h2>
                    </div>

                    {applications.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <h3>No applications yet</h3>
                            <p>Share the public application link to start receiving applications.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Resume</th>
                                        <th>Status</th>
                                        <th>Applied</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((app) => (
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
                                            <td>
                                                {app.resumeDownloadUrl ? (
                                                    <a
                                                        href={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${app.resumeDownloadUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-secondary btn-sm"
                                                    >
                                                        📎 {app.resumeOriginalName || 'Download'}
                                                    </a>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)' }}>No resume</span>
                                                )}
                                            </td>
                                            <td><StatusBadge status={app.status} /></td>
                                            <td style={{ color: 'var(--text-muted)' }}>
                                                {new Date(app.submittedAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <select
                                                    className="form-control form-select"
                                                    style={{ minWidth: '150px', padding: '0.5rem' }}
                                                    value={app.status}
                                                    onChange={(e) => updateStatus(app.id, e.target.value)}
                                                >
                                                    <option value="NEW">New</option>
                                                    <option value="SHORTLISTED">Shortlisted</option>
                                                    <option value="INTERVIEWED">Interviewed</option>
                                                    <option value="REJECTED">Rejected</option>
                                                    <option value="HIRED">Hired</option>
                                                </select>
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

export default JobDetail;
