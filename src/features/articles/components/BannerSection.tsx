// features/articles/components/BannerSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Article } from "../schema/RssSchema";

// Helper to detect if URL is a video
function isVideoUrl(url?: string | null): boolean {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

interface BannerSectionProps {
    article: Article;
}

export default function BannerSection({ article }: BannerSectionProps) {
    return (
        <section className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                {/* Left - Featured Image/Video */}
                <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
                    {article.image ? (
                        isVideoUrl(article.image) ? (
                            <video
                                src={article.image}
                                className="w-full h-full object-cover"
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
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        )
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                            <span className="text-8xl">🍳</span>
                        </div>
                    )}
                </div>

                {/* Right - Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                    {/* Source Badge */}
                    <span
                        className="text-sm font-bold tracking-wider uppercase mb-4"
                        style={{ color: '#769FCD' }}
                    >
                        {article.source}
                    </span>

                    {/* Title */}
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        <Link
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#769FCD] transition-colors"
                        >
                            {article.title}
                        </Link>
                    </h2>

                    {/* Description */}
                    {article.description && (
                        <p className="text-base lg:text-lg text-gray-600 mb-6 line-clamp-4">
                            {article.description}
                        </p>
                    )}

                    {/* Date */}
                    {article.pubDate && (
                        <time className="text-sm text-gray-500">
                            {new Date(article.pubDate).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </time>
                    )}

                    {/* Read More Link */}
                    <Link
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center text-[#769FCD] font-semibold hover:text-[#769FCD] transition-colors group"
                    >
                        Read Full Article
                        <svg
                            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
