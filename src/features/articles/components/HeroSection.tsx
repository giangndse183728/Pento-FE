// features/articles/components/HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Article } from "../services/rssService";

interface HeroSectionProps {
    featuredArticle: Article;
    sideArticles: Article[];
}

export default function HeroSection({ featuredArticle, sideArticles }: HeroSectionProps) {
    return (
        <section className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left - Featured Article with Image */}
                <div className="relative h-[500px] lg:h-[600px] overflow-hidden group rounded-lg">
                    {featuredArticle.image ? (
                        <Image
                            src={featuredArticle.image}
                            alt={featuredArticle.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                            <span className="text-8xl">🍳</span>
                        </div>
                    )}

                    {/* Overlay Card at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 shadow-xl max-w-xl">
                            {/* Category Label */}
                            <span
                                className="text-xs font-bold tracking-wider uppercase"
                                style={{ color: '#e53e3e' }}
                            >
                                {featuredArticle.source}
                            </span>

                            {/* Title */}
                            <h2 className="text-xl font-bold text-gray-900 mt-2 mb-2 leading-tight">
                                <Link
                                    href={featuredArticle.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-orange-600 transition-colors"
                                >
                                    {featuredArticle.title}
                                </Link>
                            </h2>

                            {/* Duration/Date */}
                            {featuredArticle.pubDate && (
                                <time className="text-sm text-gray-500">
                                    {new Date(featuredArticle.pubDate).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </time>
                            )}

                            {/* Description */}
                            {featuredArticle.description && (
                                <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                                    {featuredArticle.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right - 2x2 Grid of Articles */}
                <div className="grid grid-cols-2 gap-4">
                    {sideArticles.slice(0, 4).map((article, index) => (
                        <Link
                            key={index}
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col"
                        >
                            {/* Article Image */}
                            <div className="relative h-36 lg:h-40 overflow-hidden rounded-lg">
                                {article.image ? (
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                        <span className="text-4xl">📰</span>
                                    </div>
                                )}
                            </div>

                            {/* Article Info - White Card */}
                            <div className="mt-3 p-3 bg-white rounded-lg shadow-sm flex flex-col">
                                {/* Category */}
                                <span
                                    className="text-xs font-bold tracking-wider uppercase"
                                    style={{ color: '#e53e3e' }}
                                >
                                    {article.source}
                                </span>

                                {/* Title */}
                                <h3 className="text-sm lg:text-base font-bold text-gray-900 mt-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                    {article.title}
                                </h3>

                                {/* Duration/Date */}
                                {article.pubDate && (
                                    <time className="text-xs text-gray-500 mt-1">
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
            </div>
        </section>
    );
}