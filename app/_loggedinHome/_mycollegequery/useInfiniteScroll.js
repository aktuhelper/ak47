import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll({ loading, hasMore, onLoadMore }) {
    const observerTarget = useRef(null);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            onLoadMore();
        }
    }, [loading, hasMore, onLoadMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px'
            }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMore]);

    return observerTarget;
}