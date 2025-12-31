export function QueryGrid({
    queries,
    userData,
    onAnswerAdded,
    onStatsChange,
    QueryCardComponent
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {queries.map((query) => (
                <QueryCardComponent
                    key={query.id}
                    query={query}
                    userData={userData}
                    onAnswerAdded={onAnswerAdded}
                    onStatsChange={onStatsChange}
                />
            ))}
        </div>
    );
}