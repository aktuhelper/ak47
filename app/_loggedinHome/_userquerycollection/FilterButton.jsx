const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function FilterButton({ filter, isActive, onClick, badge }) {
    const Icon = filter.icon;

    return (
        <button
            onClick={onClick}
            className={cn(
                "px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium rounded-md transition-all duration-200 relative touch-manipulation",
                isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 active:text-zinc-900 dark:active:text-zinc-100 border border-zinc-200 dark:border-zinc-700 active:border-blue-400 dark:active:border-blue-500 sm:hover:text-zinc-900 sm:dark:hover:text-zinc-100 sm:hover:border-blue-400 sm:dark:hover:border-blue-500 sm:hover:shadow-sm'
            )}
        >
            <span className="flex items-center gap-0.5 sm:gap-1">
                {Icon && <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />}
                <span>{filter.label}</span>
                {badge !== null && badge !== undefined && badge > 0 && (
                    <span className={cn(
                        "ml-0.5 px-1 py-0.5 text-[9px] font-bold rounded-full leading-none flex-shrink-0",
                        isActive
                            ? "bg-white text-blue-600"
                            : "bg-red-500 text-white"
                    )}>
                        {badge > 99 ? '99+' : badge}
                    </span>
                )}
            </span>
        </button>
    );
}