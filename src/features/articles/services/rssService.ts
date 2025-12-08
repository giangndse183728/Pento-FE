export type Article = {
    title: string;
    link: string;
    source: string;
    description: string;
    image?: string | null;
    pubDate: string;
};

export async function fetchRSS(source: string): Promise<Article[]> {
    const res = await fetch(`/api/articles?source=${source}`);
    if (!res.ok) throw new Error("Failed to fetch RSS");
    return res.json();
}
