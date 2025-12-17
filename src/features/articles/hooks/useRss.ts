import { useEffect, useState, useCallback, useRef } from "react";
import { fetchRSS } from "../services/rssService";
import { Article, RSSItem, RSS_SOURCES, ITEMS_PER_PAGE } from "../schema/RssSchema";

export function useArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
    const [loadingMore, setLoadingMore] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    // Fetch articles from all sources
    useEffect(() => {
        Promise.all(
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
        )
            .then((results) => {
                const all = results.flat();
                const sorted = all.sort(
                    (a, b) =>
                        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
                );
                setArticles(sorted);
            })
            .finally(() => setLoading(false));
    }, []);

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
    const gridArticles = articles.slice(5, displayCount);
    const hasMore = displayCount < articles.length;

    return {
        articles,
        loading,
        loadingMore,
        displayCount,
        loaderRef,
        heroArticle,
        sideArticles,
        gridArticles,
        hasMore,
    };
}
