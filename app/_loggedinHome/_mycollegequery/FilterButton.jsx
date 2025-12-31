const cn = (...classes) => classes.filter(Boolean).join(' ');

export function FilterButton({ label, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all",
                isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500'
            )}
        >
            {label}
        </button>
    );
}


