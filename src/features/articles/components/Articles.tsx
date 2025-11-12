"use client";

import { useEffect, useState } from "react";
import { fetchRSS } from "../services/rssService";
import Image from "next/image";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import type { ReactNode } from 'react';

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

// Helper function to determine grid span classes
const getSpanClass = (index: number): string => {
    if (index % 5 === 0) return "col-span-2 row-span-2";
    if (index % 8 === 3) return "row-span-2";
    if (index % 12 === 6) return "col-span-2";
    return "";
};

export default function Articles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all(
            SOURCES.map((s) =>
                fetchRSS(s.key)
                    .then((items: RSSItem[]) => {
                        console.log(`Received items for ${s.key}:`, items);
                        return items.map((item: RSSItem) => ({
                            ...item,
                            source: s.label,
                        }));
                    })
                    .catch((error) => {
                        console.error(`Error fetching ${s.key}:`, error);
                        return [] as Article[];
                    })
            )
        )
            .then((results) => {
                const all = results.flat();
                console.log('All articles:', all);
                const sorted = all.sort(
                    (a, b) =>
                        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
                );
                setArticles(sorted);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return <p className="text-gray-600 italic">Loading recipes & food news...</p>;

    return (
        <BentoGrid className="max-w-7xl mx-auto">
            {articles.map((article, i) => (
                <BentoGridItem
                    key={i}
                    className={getSpanClass(i)}
                    header={
                        <div className="space-y-4">
                            {article.image && (
                                <div className="relative w-full h-48">
                                    <Image
                                        src={article.image}
                                        alt={article.title || 'Article image'}
                                        className="object-cover rounded-lg"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        loading={i < 4 ? "eager" : "lazy"}
                                    />
                                </div>
                            )}
                        </div>
                    }
                    icon={<span className="text-xs text-gray-500">{article.source}</span>}
                    description={<p className="text-sm text-gray-600 line-clamp-3">{article.description}</p>}
                    title={
                        <>
                            <h4 className="text-lg font-semibold">
                                <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                    {article.title}
                                </a>
                            </h4>
                            {article.pubDate && (
                                <p className="text-xs text-gray-400">
                                    {new Date(article.pubDate).toLocaleDateString()}
                                </p>
                            )}
                        </>
                    }
                />
            ))}
        </BentoGrid>
    );
}
