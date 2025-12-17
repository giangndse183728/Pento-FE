'use client';

import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import ArticlesPage from "@/features/articles/components/ArticlesPage";
import { WhiteCard } from "@/components/decoration/WhiteCard";
import { ColorTheme } from "@/constants/color";
import { CusButton } from '@/components/ui/cusButton';
import { useArticles } from '@/features/articles/hooks/useRss';

export default function HomePage() {
    const { refetch, refetching } = useArticles();

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
