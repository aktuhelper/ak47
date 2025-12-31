// components/EmptyState.jsx
import { MessageCircle } from 'lucide-react';

export default function EmptyState({ searchQuery, activeCategory, activeFilter }) {
    const hasFilters = searchQuery || activeCategory || activeFilter !== 'all';

    return (
        <div className="text-center py-16">
            <div className="max-w-md mx-auto">
                <MessageCircle className="h-16 w-16 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    No queries found
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    {hasFilters
                        ? 'Try adjusting your filters or search terms.'
                        : 'You haven\'t posted any queries yet. Start by asking your first question!'}
                </p>
            </div>
        </div>
    );
}