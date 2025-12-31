import { Flame, TrendingUp } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function FilterButtons({ activeFilter, onFilterChange }) {
    const filters = [
        { id: 'trending', label: 'Trending', icon: Flame },
        { id: 'hot', label: 'Hot Today', icon: TrendingUp },
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
    ];

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={cn(
                            "px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all flex items-center gap-1.5",
                            activeFilter === filter.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500'
                        )}
                    >
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
}