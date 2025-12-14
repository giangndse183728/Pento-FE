import Articles from "@/features/articles/components/Articles";
import { WhiteCard } from "@/components/decoration/WhiteCard";
import { ColorTheme } from "@/constants/color";

export default function HomePage() {
    return (
        <main className="p-8">
            <div className="sticky top-0 z-20 w-screen -mx-8 -mt-8">
                {/* Header Section */}
                <WhiteCard
                    className="w-screen py-12 flex flex-col items-center justify-center text-center rounded-b-[80px] !bg-white/20 pt-0"
                >
                    <h1 className="text-4xl md:text-5xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                        Cooking & Food News
                    </h1>
                    <h2 className="text-lg md:text-xl mt-2" style={{ color: ColorTheme.blueGray }}>
                        Stay updated with the latest food news
                    </h2>
                </WhiteCard>
            </div>
            <Articles />
        </main>
    );
}
