// features/articles/components/HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Article } from "../services/rssService";

interface HeroSectionProps {
    article: Article;
}

export default function HeroSection({ article }: HeroSectionProps) {
    return (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 shadow-lg border border-orange-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Hero Image */}
                {article.image && (
                    <div className="relative h-64 sm:h-80 lg:h-[400px] overflow-hidden">
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
                    </div>
                )}

                {/* Hero Content */}
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-white/80 to-transparent">
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                            ✨ Featured
                        </span>
                        <span className="inline-flex items-center px-3 py-1.5 bg-white/80 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                            {article.source}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                        <Link
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-orange-600 transition-colors duration-300"
                        >
                            {article.title}
                        </Link>
                    </h2>

                    {/* Description */}
                    {article.description && (
                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 line-clamp-3">
                            {article.description}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-orange-200/50">
                        <Link
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md"
                        >
                            Read Article
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                        {article.pubDate && (
                            <time className="text-sm text-gray-500 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(article.pubDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </time>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}