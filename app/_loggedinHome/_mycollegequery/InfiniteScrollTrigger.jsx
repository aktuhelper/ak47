export function InfiniteScrollTrigger({
    observerRef,
    hasMore,
    loading,
    queriesCount
}) {
    if (hasMore) {
        return (
            <div
                ref={observerRef}
                className="py-8 text-center"
                style={{ minHeight: '100px' }}
            >
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="text-sm text-zinc-400">Scroll to load more</div>
                )}
            </div>
        );
    }

    if (!hasMore && queriesCount > 0) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No more queries to load
                </p>
            </div>
        );
    }

    return null;
}