import Articles from "@/features/articles/components/Articles";

export default function HomePage() {
    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-6">Cooking & Food News</h1>
            <Articles />
        </main>
    );
}
