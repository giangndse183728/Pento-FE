"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import HeroSection from "./HeroSection";
import { useArticles } from "../hooks/useRss";
import { ITEMS_PER_PAGE } from "../schema/RssSchema";

export default function Articles() {
    const {
        articles,
        loading,
        loadingMore,
        displayCount,
        loaderRef,
        heroArticle,
        sideArticles,
        gridArticles,
        hasMore,
    } = useArticles();

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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Hero Section - Featured + Side Articles */}
            {heroArticle && (
                <HeroSection
                    featuredArticle={heroArticle}
                    sideArticles={sideArticles}
                />
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
