import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const ApplicationForm = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [candidateName, setCandidateName] = useState('');
    const [candidateEmail, setCandidateEmail] = useState('');
    const [resume, setResume] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/${id}`);
                if (!response.data.active) {
                    setError('This position is no longer accepting applications');
                }
                setJob(response.data);
            } catch (error) {
                setError('Job not found');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['application/pdf', 'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

            if (!validTypes.includes(file.type)) {
                setError('Please upload a PDF or DOC/DOCX file');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }

            setResume(file);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('candidateName', candidateName);
            formData.append('candidateEmail', candidateEmail);
            if (resume) {
                formData.append('resume', resume);
            }

            await api.post(`/jobs/${id}/apply`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess(true);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="public-job-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="public-job-container">
                <div className="public-job-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                        Application Submitted!
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Thank you for applying to <strong>{job?.title}</strong>.
                        We will review your application and get back to you soon.
                    </p>
                    <Link to={`/careers/${id}`} className="btn btn-secondary">
                        ← Back to Job Posting
                    </Link>
                </div>
            </div>
        );
    }

    if (error && !job) {
        return (
            <div className="public-job-container">
                <div className="public-job-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">😕</div>
                        <h3>{error}</h3>
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
                <Link
                    to={`/careers/${id}`}
                    style={{ color: 'var(--text-muted)', marginBottom: '1rem', display: 'block' }}
                >
                    ← Back to Job Details
                </Link>

                <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Apply for: {job?.title}
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Fill out the form below to submit your application
                </p>

                {error && <div className="alert alert-error">⚠️ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your full name"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email address"
                            value={candidateEmail}
                            onChange={(e) => setCandidateEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Resume (PDF or DOC)</label>
                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                className="file-input"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                id="resume-input"
                            />
                            <label
                                htmlFor="resume-input"
                                className={`file-input-label ${resume ? 'has-file' : ''}`}
                            >
                                {resume ? (
                                    <>📎 {resume.name}</>
                                ) : (
                                    <>📤 Click to upload your resume</>
                                )}
                            </label>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Accepted formats: PDF, DOC, DOCX (Max 10MB)
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplicationForm;
