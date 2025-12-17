"use client";

import HeroSection from "./HeroSection";
import BannerSection from "./BannerSection";
import ArticlesSection from "./ArticlesSection";
import { useArticles } from "../hooks/useRss";
import { ColorTheme } from "@/constants/color";

export default function ArticlesPage() {
    const {
        articles,
        loading,
        loadingMore,
        displayCount,
        loaderRef,
        heroArticle,
        sideArticles,
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

    // Articles after FIRST hero section (starting from index 5)
    const remainingArticles = articles.slice(5, displayCount);
    const groups: Array<{ type: 'cards' | 'banner' | 'hero'; startIndex: number; count: number }> = [];

    let currentIndex = 0;
    while (currentIndex < remainingArticles.length) {
        const cardsCount = Math.min(3, remainingArticles.length - currentIndex);
        if (cardsCount > 0) {
            groups.push({
                type: 'cards',
                startIndex: 5 + currentIndex,
                count: cardsCount
            });
            currentIndex += cardsCount;
        }

        // Add 1 banner if there's another article
        if (currentIndex < remainingArticles.length) {
            groups.push({
                type: 'banner',
                startIndex: 5 + currentIndex,
                count: 1
            });
            currentIndex += 1;
        }

        // Add 1 hero section if there are 5 more articles
        if (currentIndex + 4 < remainingArticles.length) {
            groups.push({
                type: 'hero',
                startIndex: 5 + currentIndex,
                count: 5
            });
            currentIndex += 5;
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-16 ">
            {/* FIRST Hero Section - Featured + Side Articles */}
            {heroArticle && sideArticles.length > 0 ? (
                <HeroSection
                    featuredArticle={heroArticle}
                    sideArticles={sideArticles}
                />
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading hero section...</p>
                </div>
            )}

            {/* Repeating Pattern: 3 Article Cards → Banner → Hero */}
            {groups.map((group, idx) => {
                console.log(`🎯 Rendering group ${idx}:`, group);
                return (
                    <div key={idx} className="space-y-8">
                        {group.type === 'cards' ? (
                            <>
                                {/* Section Title for Articles */}
                                <div className="flex justify-center">
                                    <h2 className="text-3xl font-bold uppercase" style={{ color: ColorTheme.darkBlue }}>What to read</h2>
                                </div>

                                <ArticlesSection
                                    articles={articles.slice(group.startIndex, group.startIndex + group.count)}
                                    startIndex={group.startIndex}
                                />
                            </>
                        ) : group.type === 'banner' ? (
                            <>
                                {/* Section Title for Banner */}
                                <div className="flex justify-center">
                                    <h2 className="text-3xl font-bold uppercase" style={{ color: ColorTheme.darkBlue }}>Trending now</h2>
                                </div>

                                {console.log(`   → Banner group ${idx}, article ${group.startIndex}`)}
                                <BannerSection article={articles[group.startIndex]} />
                            </>
                        ) : (
                            <>
                                {/* Section Title for Repeating Hero */}
                                <div className="flex justify-center">
                                    <h2 className="text-3xl font-bold uppercase" style={{ color: ColorTheme.darkBlue }}>Editor's Pick</h2>
                                </div>

                                <HeroSection
                                    featuredArticle={articles[group.startIndex]}
                                    sideArticles={articles.slice(group.startIndex + 1, group.startIndex + 5)}
                                />
                            </>
                        )}
                    </div>
                );
            })}

            {/* Loading More Indicator */}
            {hasMore && (
                <div ref={loaderRef} className="flex justify-center py-12">
                    {loadingMore ? (
                        <div className="flex items-center gap-2 text-gray-500">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-600 rounded-full animate-spin" />
                            <span>Loading more articles...</span>
                        </div>
                    ) : (
                        <div className="text-gray-400 text-sm">Scroll for more</div>
                    )}
                </div>
            )}

            {/* End Message */}
            {!hasMore && articles.length > 5 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">You've reached the end of the articles</p>
                </div>
            )}
        </div>
    );
}
