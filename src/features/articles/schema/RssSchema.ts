// Schema and types for RSS articles
export interface Article {
    title: string;
    link: string;
    pubDate: string;
    description: string;
    source: string;
    image?: string | null;
}

export interface RSSItem {
    title: string;
    link: string;
    pubDate: string;
    description: string;
    image?: string | null;
}

export interface RSSSource {
    key: string;
    label: string;
}

export const RSS_SOURCES: RSSSource[] = [
    { key: "bonappetit", label: "Bon Appétit" },
    { key: "nononsense", label: "No Nonsense Cooking" },
];

// Pagination
export const ITEMS_PER_PAGE = 20; // Increased to show full pattern: Hero(5) + 3Cards + Banner + 3Cards + Banner + 3Cards + Banner
