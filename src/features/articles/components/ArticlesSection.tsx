"use client";

import Image from "next/image";
import Link from "next/link";
import { Article } from "../schema/RssSchema";

// Helper to detect if URL is a video
function isVideoUrl(url: string): boolean {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

interface ArticlesSectionProps {
    articles: Article[];
    startIndex?: number;
}

export default function ArticlesSection({ articles, startIndex = 0 }: ArticlesSectionProps) {
    const displayArticles = articles.slice(0, 3);

    if (displayArticles.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayArticles.map((article, i) => (
                <Link
                    key={article.link}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col"
                >
                    {/* Article Image/Video */}
                    <div className="relative h-50 lg:h-70 overflow-hidden rounded-lg">
                        {article.image ? (
                            isVideoUrl(article.image) ? (
                                <video
                                    src={article.image}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            )
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <span className="text-4xl">📰</span>
                            </div>
                        )}
                    </div>

                    {/* Article Info - White Card */}
                    <div className="mt-3 p-3 bg-white rounded-lg shadow-sm flex flex-col h-30">
                        {/* Category */}
                        <span
                            className="text-xs font-bold tracking-wider uppercase"
                            style={{ color: '#769FCD' }}
                        >
                            {article.source}
                        </span>

                        {/* Title */}
                        <h3 className="text-sm lg:text-base font-bold text-gray-900 mt-1 line-clamp-2 group-hover:text-[#769FCD] transition-colors">
                            {article.title}
                        </h3>

                        {/* Date */}
                        {article.pubDate && (
                            <time className="text-xs text-gray-500 mt-auto">
                                {new Date(article.pubDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </time>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}
