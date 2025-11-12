export async function fetchRSS(source: string) {
    const res = await fetch(`/api/articles?source=${source}`);
    if (!res.ok) throw new Error("Failed to fetch RSS");
    return res.json();
}
