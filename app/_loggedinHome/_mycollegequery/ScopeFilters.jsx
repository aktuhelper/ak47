import { FilterButton } from './FilterButton';
export function ScopeFilters({
    activeFilter,
    onFilterChange,
    userBranch,
    userCourse
}) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <FilterButton
                label="All"
                isActive={activeFilter === 'all'}
                onClick={() => onFilterChange('all')}
            />
            {userBranch && (
                <FilterButton
                    label={`Branch: ${userBranch} Only`}
                    isActive={activeFilter === 'branch'}
                    onClick={() => onFilterChange('branch')}
                />
            )}
            <FilterButton
                label={`${userCourse} Only`}
                isActive={activeFilter === 'course'}
                onClick={() => onFilterChange('course')}
            />
        </div>
    );
}