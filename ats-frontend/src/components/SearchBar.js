import React from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
    return (
        <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
                type="text"
                className="form-control search-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
