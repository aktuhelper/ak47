// components/FilterBar.jsx
import FilterButton from './FilterButton';
import SortDropdown from './SortDropdown';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function FilterBar({
    filters,
    categories,
    activeFilter,
    setActiveFilter,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy
}) {
    return (
        <div className="mb-4 sm:mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                {/* Status Filters - 2x2 grid on small screens, horizontal on larger */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap lg:flex-nowrap items-center gap-2">
                    {filters.map((filter) => (
                        <FilterButton
                            key={filter.id}
                            filter={filter}
                            isActive={activeFilter === filter.id}
                            onClick={() => {
                                setActiveFilter(filter.id);
                                setActiveCategory(null);
                            }}
                            badge={filter.badge}
                        />
                    ))}
                </div>

                {/* Sort Dropdown - Only show when NOT on personal/sent queries tab */}
                {activeFilter !== 'personal-query' && activeFilter !== 'sent-queries' && (
                    <div className="flex items-center gap-2 lg:flex-shrink-0">
                        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
                    </div>
                )}
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            // ✅ FIXED: Use cat.id instead of cat.label
                            setActiveCategory(activeCategory === cat.id ? null : cat.id);
                        }}
                        className={cn(
                            "px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all",
                            // ✅ FIXED: Compare with cat.id instead of cat.label
                            activeCategory === cat.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500'
                        )}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
}