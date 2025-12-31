import { ScopeFilters } from './ScopeFilters';
import { CategoryFilters } from './CategoryFilters';
import { SortDropdown } from './SortDropdown';
export function FilterBar({
    activeFilter,
    onFilterChange,
    activeCategory,
    onCategoryChange,
    sortBy,
    onSortChange,
    userBranch,
    userCourse
}) {
    return (
        <div className="mb-4 sm:mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <ScopeFilters
                    activeFilter={activeFilter}
                    onFilterChange={onFilterChange}
                    userBranch={userBranch}
                    userCourse={userCourse}
                />
                <div className="flex items-center gap-2">
                    <SortDropdown
                        sortBy={sortBy}
                        onSortChange={onSortChange}
                    />
                </div>
            </div>
            <CategoryFilters
                activeCategory={activeCategory}
                onCategoryChange={onCategoryChange}
            />
        </div>
    );
}