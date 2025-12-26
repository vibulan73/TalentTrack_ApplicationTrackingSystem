import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const JobForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    useEffect(() => {
        const fetchJob = async () => {
            setFetchLoading(true);
            try {
                const response = await api.get(`/jobs/${id}`);
                setTitle(response.data.title);
                setDescription(response.data.description || '');
            } catch (error) {
                setError('Failed to load job details');
            } finally {
                setFetchLoading(false);
            }
        };

        if (isEditing) {
            fetchJob();
        }
    }, [id, isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditing) {
                await api.put(`/jobs/${id}`, { title, description });
            } else {
                await api.post('/jobs', { title, description });
            }
            navigate('/jobs');
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to save job');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
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
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <div className="page-header">
                        <h1 className="page-title">
                            {isEditing ? '✏️ Edit Job' : '➕ Create New Job'}
                        </h1>
                    </div>

                    <div className="card">
                        {error && <div className="alert alert-error">⚠️ {error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Job Title *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Senior Software Engineer"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Job Description</label>
                                <textarea
                                    className="form-control"
                                    placeholder="Describe the role, responsibilities, requirements, benefits..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={10}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : (isEditing ? 'Update Job' : 'Create Job')}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/jobs')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JobForm;
