import { NextResponse } from "next/server";
import Parser from "rss-parser";

interface FeedItem {
    title?: string;
    link?: string;
    pubDate?: string;
    contentSnippet?: string;
    content?: string;
    contentEncoded?: string;
    enclosure?: { url?: string };
    image?: { url?: string };
    "media:content"?: { $?: { url?: string } };
    "media:thumbnail"?: { $?: { url?: string } };
}

const parser: Parser<unknown, FeedItem> = new Parser({
    customFields: {
        item: [
            ["media:content", "media:content"],
            ["media:thumbnail", "media:thumbnail"],
            ["content:encoded", "contentEncoded"],
            ["image", "image"],
        ],
    },
});

const feedMap: Record<string, string> = {
    bonappetit: "https://www.bonappetit.com/feed/rss",
    nononsense: "https://nononsense.cooking/rss/feed.en-US.xml",
};

// Extract <img src="..."> from HTML content
function extractImage(html?: string): string | null {
    if (!html) return null;
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return match ? match[1] : null;
}

// Fetch OG:image from the linked article (used for No Nonsense Cooking)
async function fetchOGImage(url?: string): Promise<string | null> {
    if (!url) return null;
    try {
        const res = await fetch(url);
        const html = await res.text();
        const match = html.match(
            /<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/
        );
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");

    async function fetchFeed(sourceKey: string, feedUrl: string) {
        const feed = await parser.parseURL(feedUrl);

        const items = await Promise.all(
            feed.items.slice(0, 10).map(async (item: FeedItem) => {
                let image =
                    item["media:thumbnail"]?.$?.url ||
                    item["media:content"]?.$?.url ||
                    item.enclosure?.url ||
                    item.image?.url ||
                    extractImage(item.contentEncoded) ||
                    extractImage(item.content) ||
                    extractImage(item.contentSnippet) ||
                    null;


                if (!image && sourceKey === "nononsense") {
                    image = await fetchOGImage(item.link);
                }

                return {
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    description: item.contentSnippet || item.content,
                    image,
                    source: sourceKey,
                };
            })
        );

        return items;
    }

    try {
        if (source && feedMap[source]) {
            const items = await fetchFeed(source, feedMap[source]);
            return NextResponse.json(items);
        }

        const allFeeds = await Promise.all(
            Object.entries(feedMap).map(([key, url]) => fetchFeed(key, url))
        );

        const combined = allFeeds.flat();
        return NextResponse.json(combined);
    } catch (error) {
        console.error("RSS fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch RSS" }, { status: 500 });
    }
}
