import { useState, useEffect } from 'react';

export function useQueryFilters() {
    const [activeFilter, setActiveFilter] = useState('trending');
    const [activeCategory, setActiveCategory] = useState(null);
    const [sortBy, setSortBy] = useState('trending');
    const [searchQuery, setSearchQuery] = useState('');

    const handleFilterChange = (filterId) => {
        setActiveFilter(filterId);
        setActiveCategory(null);
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    const handleSortChange = (sort) => {
        setSortBy(sort);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    return {
        activeFilter,
        activeCategory,
        sortBy,
        searchQuery,
        handleFilterChange,
        handleCategoryChange,
        handleSortChange,
        handleSearchChange,
    };
}