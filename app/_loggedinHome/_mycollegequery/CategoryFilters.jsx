import { FilterButton } from './FilterButton';
const CATEGORIES = [
    { id: 'academics', label: 'Academic' },
    { id: 'career', label: 'Career' },
    { id: 'college-life', label: 'College Life' },
    { id: 'general', label: 'General Query' },
];

export function CategoryFilters({ activeCategory, onCategoryChange }) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => (
                <FilterButton
                    key={cat.id}
                    label={cat.label}
                    isActive={activeCategory === cat.id}
                    onClick={() => onCategoryChange(cat.id)}
                />
            ))}
        </div>
    );
}