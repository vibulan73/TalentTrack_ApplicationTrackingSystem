import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusClass = () => {
        switch (status) {
            case 'NEW':
                return 'badge-new';
            case 'SHORTLISTED':
                return 'badge-shortlisted';
            case 'INTERVIEWED':
                return 'badge-interviewed';
            case 'REJECTED':
                return 'badge-rejected';
            case 'HIRED':
                return 'badge-hired';
            default:
                return 'badge-new';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'NEW':
                return '🆕';
            case 'SHORTLISTED':
                return '⭐';
            case 'INTERVIEWED':
                return '🎤';
            case 'REJECTED':
                return '❌';
            case 'HIRED':
                return '✅';
            default:
                return '📋';
        }
    };

    return (
        <span className={`badge ${getStatusClass()}`}>
            {getStatusIcon()} {status}
        </span>
    );
};

export default StatusBadge;
