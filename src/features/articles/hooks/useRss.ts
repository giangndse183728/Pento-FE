import { useEffect, useState, useCallback, useRef } from "react";
import { fetchRSS } from "../services/rssService";
import { Article, RSSItem, RSS_SOURCES, ITEMS_PER_PAGE } from "../schema/RssSchema";

// Helper to detect if URL is a video
function isVideoUrl(url?: string | null): boolean {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

export function useArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
    const [loadingMore, setLoadingMore] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    // Fetch articles from all sources
    const fetchArticles = useCallback(async (isRefetch = false) => {
        if (isRefetch) {
            setRefetching(true);
        } else {
            setLoading(true);
        }

        try {
            const results = await Promise.all(
                RSS_SOURCES.map((s) =>
                    fetchRSS(s.key)
                        .then((items: RSSItem[]) => {
                            return items.map((item: RSSItem) => ({
                                ...item,
                                source: s.label,
                            }));
                        })
                        .catch(() => [] as Article[])
                )
            );

            const all = results.flat();

            // Sort by date first
            const sortedByDate = all.sort(
                (a, b) =>
                    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
            );

            // Prioritize videos for the hero section - videos come first, then by date
            const sorted = sortedByDate.sort((a, b) => {
                const aHasVideo = isVideoUrl(a.image);
                const bHasVideo = isVideoUrl(b.image);

                if (aHasVideo && !bHasVideo) return -1;
                if (!aHasVideo && bHasVideo) return 1;
                return 0; // Keep date order for same type
            });

            setArticles(sorted);

            // Reset display count when refetching
            if (isRefetch) {
                setDisplayCount(ITEMS_PER_PAGE);
            }
        } finally {
            setLoading(false);
            setRefetching(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    // Refetch function for manual refresh
    const refetch = useCallback(() => {
        fetchArticles(true);
    }, [fetchArticles]);

    // Load more articles
    const loadMore = useCallback(() => {
        if (displayCount >= articles.length) return;

        setLoadingMore(true);
        // Simulate smooth loading
        setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, articles.length));
            setLoadingMore(false);
        }, 300);
    }, [displayCount, articles.length]);

    // Infinite scroll with Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingMore && displayCount < articles.length) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [loadMore, loadingMore, displayCount, articles.length]);

    // Separate articles for different sections
    const heroArticle = articles[0];
    const sideArticles = articles.slice(1, 5);
    const hasMore = displayCount < articles.length;

    return {
        articles,
        loading,
        refetching,
        loadingMore,
        displayCount,
        loaderRef,
        heroArticle,
        sideArticles,
        hasMore,
        refetch,
    };
}
