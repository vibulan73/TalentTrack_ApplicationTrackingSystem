import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import SearchBar from '../components/SearchBar';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterJob, setFilterJob] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appsRes, jobsRes] = await Promise.all([
                api.get('/applications'),
                api.get('/jobs')
            ]);
            setApplications(appsRes.data);
            setJobs(jobsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchData();
            return;
        }

        setLoading(true);
        try {
            const response = await api.get(`/applications/search?query=${encodeURIComponent(searchQuery)}`);
            setApplications(response.data);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterJob) params.append('jobId', filterJob);
            if (filterStatus) params.append('status', filterStatus);

            const response = await api.get(`/applications?${params.toString()}`);
            setApplications(response.data);
        } catch (error) {
            console.error('Error filtering:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filterJob || filterStatus) {
            handleFilter();
        } else if (!searchQuery) {
            fetchData();
        }
    }, [filterJob, filterStatus]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchQuery) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

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

    const clearFilters = () => {
        setSearchQuery('');
        setFilterJob('');
        setFilterStatus('');
        fetchData();
    };

    if (loading && applications.length === 0) {
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
                    <h1 className="page-title">📄 All Applications</h1>
                    <span style={{ color: 'var(--text-muted)' }}>
                        {applications.length} application{applications.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Search and Filter */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div className="filter-bar">
                        <SearchBar
                            value={searchQuery}
                            onChange={(value) => {
                                setSearchQuery(value);
                                if (!value) {
                                    setFilterJob('');
                                    setFilterStatus('');
                                }
                            }}
                            placeholder="Search by name or email..."
                        />
                        <select
                            className="form-control form-select"
                            value={filterJob}
                            onChange={(e) => setFilterJob(e.target.value)}
                        >
                            <option value="">All Jobs</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title}</option>
                            ))}
                        </select>
                        <select
                            className="form-control form-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="NEW">New</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="INTERVIEWED">Interviewed</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="HIRED">Hired</option>
                        </select>
                        {(searchQuery || filterJob || filterStatus) && (
                            <button className="btn btn-secondary" onClick={clearFilters}>
                                ✕ Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Applications List */}
                {applications.length === 0 ? (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <h3>No applications found</h3>
                            <p>
                                {searchQuery || filterJob || filterStatus
                                    ? 'Try adjusting your search or filters'
                                    : 'Applications will appear here once candidates apply to your jobs.'
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="card">
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Job</th>
                                        <th>Resume</th>
                                        <th>Status</th>
                                        <th>Applied</th>
                                        <th>Update Status</th>
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
                                                <a href={`/jobs/${app.jobId}`} style={{ color: 'var(--primary)' }}>
                                                    {app.jobTitle}
                                                </a>
                                            </td>
                                            <td>
                                                {app.resumeDownloadUrl ? (
                                                    <a
                                                        href={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${app.resumeDownloadUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-secondary btn-sm"
                                                    >
                                                        📎 View
                                                    </a>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                                                )}
                                            </td>
                                            <td><StatusBadge status={app.status} /></td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                {new Date(app.submittedAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <select
                                                    className="form-control form-select"
                                                    style={{ minWidth: '140px', padding: '0.5rem' }}
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
                    </div>
                )}
            </main>
        </div>
    );
};

export default Applications;
