'use client';

import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import ArticlesPage from "@/features/articles/components/ArticlesPage";
import { WhiteCard } from "@/components/decoration/WhiteCard";
import { ColorTheme } from "@/constants/color";
import { CusButton } from '@/components/ui/cusButton';
import { useArticles } from '@/features/articles/hooks/useRss';
import '@/styles/loading-screen.css';

export default function HomePage() {
    const { loading, refetch, refetching } = useArticles();

    // Show loading screen while RSS is being fetched
    if (loading) {
        return (
            <div
                className="fixed inset-0 z-[1000] flex items-center justify-center bg-white"
                aria-live="polite"
                aria-busy={true}
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="loader">
                        <div className="bar1"></div>
                        <div className="bar2"></div>
                        <div className="bar3"></div>
                        <div className="bar4"></div>
                        <div className="bar5"></div>
                        <div className="bar6"></div>
                        <div className="bar7"></div>
                        <div className="bar8"></div>
                        <div className="bar9"></div>
                    </div>
                    <span className="text-black/90 text-sm font-primary">Loading articles...</span>
                </div>
            </div>
        );
    }

    return (
        <main className="p-8">
            <div className="sticky top-0 z-20 w-screen -mx-8 -mt-8">
                {/* Header Section */}
                <div className="relative">

                    <WhiteCard
                        className="w-screen py-12 flex flex-col items-center justify-center text-center rounded-b-[80px] !bg-white/20 pt-0"
                    >
                        <h1 className="text-4xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                            Cooking & Food News
                        </h1>
                        <h2 className="text-lg mt-2" style={{ color: ColorTheme.blueGray }}>
                            Stay updated with the latest food news
                        </h2>
                    </WhiteCard>
                </div>
            </div>

            <ArticlesPage />
        </main>
    );
}
