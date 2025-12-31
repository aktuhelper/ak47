export function LoadingSpinner({ text = 'Loading more queries...' }) {
    return (
        <div className="flex items-center justify-center gap-2 text-zinc-600 dark:text-zinc-400">
            <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">{text}</span>
        </div>
    );
}