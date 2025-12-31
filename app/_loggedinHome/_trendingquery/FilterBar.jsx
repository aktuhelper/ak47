import FilterButtons from './FilterButtons';
import SortDropdown from './SortDropdown';
import CategoryFilters from './CategoryFilters';

export default function FilterBar({
    activeFilter,
    onFilterChange,
    activeCategory,
    onCategoryChange,
    sortBy,
    onSortChange
}) {
    return (
        <div className="mb-4 sm:mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <FilterButtons
                    activeFilter={activeFilter}
                    onFilterChange={onFilterChange}
                />
                <SortDropdown
                    sortBy={sortBy}
                    onSortChange={onSortChange}
                />
            </div>

            <CategoryFilters
                activeCategory={activeCategory}
                onCategoryChange={onCategoryChange}
            />
        </div>
    );
}