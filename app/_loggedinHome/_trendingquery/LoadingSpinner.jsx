export default function LoadingSpinner({ variant = 'default', message }) {
    if (variant === 'inline') {
        return (
            <div className="flex items-center justify-center gap-2 text-zinc-600 dark:text-zinc-400">
                <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                {message && <span className="text-sm">{message}</span>}
            </div>
        );
    }

    if (variant === 'full') {
        return (
            <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                    <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    {message && <p className="text-zinc-600 dark:text-zinc-400">{message}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    );
}