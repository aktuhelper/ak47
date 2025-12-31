const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function CategoryFilters({ activeCategory, onCategoryChange }) {
    const categories = [
        { id: 'academics', label: 'Academics' },
        { id: 'career', label: 'Career' },
        { id: 'college-life', label: 'College Life' },
   
        { id: 'general', label: 'General' },
    ];

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onCategoryChange(activeCategory === cat.label ? null : cat.label)}
                    className={cn(
                        "px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all",
                        activeCategory === cat.label
                            ? 'bg-blue-600 text-white'
                            : 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500'
                    )}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
}