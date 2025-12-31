import QueryCardFull from '../querycard';
import LoadingSpinner from './LoadingSpinner';

export default function QueriesGrid({
    queries,
    userData,
    onQueryUpdate,
    observerTarget,
    hasMore,
    loading
}) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {queries.map((query) => (
                    <QueryCardFull
                        key={query.documentId || query.id}
                        query={query}
                        userData={userData}
                        onAnswerAdded={onQueryUpdate}
                        onStatsChange={onQueryUpdate}
                    />
                ))}
            </div>

            {/* Infinite scroll trigger */}
            {hasMore && (
                <div
                    ref={observerTarget}
                    className="py-8 text-center"
                    style={{ minHeight: '100px' }}
                >
                    {loading ? (
                        <LoadingSpinner variant="inline" message="Loading more queries..." />
                    ) : (
                        <div className="text-sm text-zinc-400">Scroll to load more</div>
                    )}
                </div>
            )}

            {!hasMore && !loading && (
                <div className="text-center py-8">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No more queries to load</p>
                </div>
            )}
        </>
    );
}