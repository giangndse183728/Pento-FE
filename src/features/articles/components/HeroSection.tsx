// features/articles/components/HeroSection.tsx
"use client";

import Image from "next/image";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import Link from "next/link";
import { Article } from "../services/rssService";

interface HeroSectionProps {
    article: Article;
}

export default function HeroSection({ article }: HeroSectionProps) {
    return (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 p-8 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Hero Image */}
                {article.image && (
                    <div className="relative h-96 rounded-xl overflow-hidden">
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                )}

                {/* Hero Content */}
                <div className="space-y-4">
                    <span className="inline-block px-3 py-1 bg-white/80 text-xs font-semibold text-gray-700 rounded-full">
                        {article.source}
                    </span>
                    <h2 className="text-3xl font-bold text-gray-800 leading-tight">
                        <Link
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-orange-600 transition-colors"
                        >
                            {article.title}
                        </Link>
                    </h2>
                    {article.description && (
                        <p className="text-gray-600 leading-relaxed">{article.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <Link
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-orange-600 hover:underline"
                        >
                            Read More
                        </Link>
                        {article.pubDate && (
                            <time className="text-sm text-gray-500">
                                {new Date(article.pubDate).toLocaleDateString()}
                            </time>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}