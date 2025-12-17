import { Article } from "../schema/RssSchema";

export type { Article };

export async function fetchRSS(source: string): Promise<Article[]> {
    const res = await fetch(`/api/articles?source=${source}`);
    if (!res.ok) throw new Error("Failed to fetch RSS");
    return res.json();
}
