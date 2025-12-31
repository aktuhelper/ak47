// components/LoadingState.jsx
export default function LoadingState() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-lg text-zinc-600 dark:text-zinc-400">
                    Loading your queries...
                </span>
            </div>
        </div>
    );
}