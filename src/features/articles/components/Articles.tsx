"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { fetchRSS } from "../services/rssService";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Article {
    title: string;
    link: string;
    pubDate: string;
    description: string;
    source: string;
    image?: string | null;
}

interface RSSItem {
    title: string;
    link: string;
    pubDate: string;
    description: string;
    image?: string | null;
}

const SOURCES = [
    { key: "bonappetit", label: "Bon Appétit" },
    { key: "nononsense", label: "No Nonsense Cooking" },
];

const ITEMS_PER_PAGE = 9;

export default function Articles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
    const [loadingMore, setLoadingMore] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        Promise.all(
            SOURCES.map((s) =>
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

    // Infinite scroll with Intersection Observer
    const loadMore = useCallback(() => {
        if (displayCount >= articles.length) return;

        setLoadingMore(true);
        // Simulate smooth loading
        setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, articles.length));
            setLoadingMore(false);
        }, 300);
    }, [displayCount, articles.length]);

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

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 rounded-xl h-48 mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Separate hero article from the rest
    const heroArticle = articles[0];
    const gridArticles = articles.slice(1, displayCount);
    const hasMore = displayCount < articles.length;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Hero Article - Featured */}
            {heroArticle && (
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Hero Image */}
                        {heroArticle.image && (
                            <div className="relative h-72 lg:h-96">
                                <Image
                                    src={heroArticle.image}
                                    alt={heroArticle.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden" />
                            </div>
                        )}

                        {/* Hero Content */}
                        <div className="p-6 lg:p-8 flex flex-col justify-center">
                            <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full w-fit mb-4">
                                ✨ Featured • {heroArticle.source}
                            </span>
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3 leading-tight">
                                <Link
                                    href={heroArticle.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-orange-600 transition-colors"
                                >
                                    {heroArticle.title}
                                </Link>
                            </h2>
                            {heroArticle.description && (
                                <p className="text-gray-600 mb-4 line-clamp-3">{heroArticle.description}</p>
                            )}
                            <div className="flex items-center justify-between pt-4 border-t border-orange-200">
                                <Link
                                    href={heroArticle.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-orange-600 font-medium hover:underline"
                                >
                                    Read Full Article →
                                </Link>
                                {heroArticle.pubDate && (
                                    <time className="text-sm text-gray-500">
                                        {new Date(heroArticle.pubDate).toLocaleDateString()}
                                    </time>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Section Title */}
            <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold text-gray-800">Latest Articles</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                <span className="text-sm text-gray-500">
                    Showing {Math.min(displayCount, articles.length)} of {articles.length}
                </span>
            </div>

            {/* Bento Grid Articles - Uniform Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridArticles.map((article, i) => (
                    <article
                        key={i}
                        className={cn(
                            "group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100",
                            "hover:shadow-lg hover:border-orange-200 transition-all duration-300",
                            "flex flex-col",
                            "animate-in fade-in slide-in-from-bottom-4 duration-500"
                        )}
                        style={{ animationDelay: `${(i % ITEMS_PER_PAGE) * 50}ms` }}
                    >
                        {/* Article Image */}
                        {article.image ? (
                            <div className="relative h-44 overflow-hidden">
                                <Image
                                    src={article.image}
                                    alt={article.title || 'Article image'}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    loading={i < 6 ? "eager" : "lazy"}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ) : (
                            <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <span className="text-4xl">📰</span>
                            </div>
                        )}

                        {/* Article Content */}
                        <div className="p-4 flex flex-col flex-1">
                            {/* Source Badge */}
                            <span className="text-xs font-medium text-orange-600 mb-2">
                                {article.source}
                            </span>

                            {/* Title */}
                            <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                <Link
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {article.title}
                                </Link>
                            </h4>

                            {/* Description */}
                            {article.description && (
                                <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-3">
                                    {article.description}
                                </p>
                            )}

                            {/* Date */}
                            {article.pubDate && (
                                <time className="text-xs text-gray-400 mt-auto">
                                    {new Date(article.pubDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </time>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            {/* Infinite Scroll Loader */}
            {hasMore && (
                <div
                    ref={loaderRef}
                    className="flex justify-center py-8"
                >
                    {loadingMore ? (
                        <div className="flex items-center gap-3 text-gray-500">
                            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            <span>Loading more articles...</span>
                        </div>
                    ) : (
                        <div className="h-8" />
                    )}
                </div>
            )}

            {/* End Message */}
            {!hasMore && articles.length > ITEMS_PER_PAGE && (
                <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">
                        ✓ You've seen all {articles.length} articles
                    </p>
                </div>
            )}
        </div>
    );
}
