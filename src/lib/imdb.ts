import * as cheerio from "cheerio";

const SEARCH_API = "https://imdb.iamidiotareyoutoo.com/search";

export async function getPopularIMDb() {
    try {
        const res = await fetch("https://www.imdb.com/chart/moviemeter/", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            },
            next: { revalidate: 3600 }
        });

        if (!res.ok) throw new Error("Failed to fetch IMDb chart");

        const html = await res.text();
        const $ = cheerio.load(html);
        const script = $("#__NEXT_DATA__").html();

        if (!script) {
            console.error("IMDb: __NEXT_DATA__ script not found");
            return [{
                id: 'error-script',
                title: 'Script Not Found',
                media_type: 'movie',
                overview: `HTML Length: ${html.length}. Status: ${res.status}`
            }];
        }

        const data = JSON.parse(script);
        const edges = data.props?.pageProps?.pageData?.chartTitles?.edges || [];

        return edges.map((edge: any) => {
            const node = edge.node;
            return {
                id: node.id,
                title: node.titleText?.text,
                poster_path: node.primaryImage?.url,
                backdrop_path: node.primaryImage?.url, // Use poster as backdrop fallback
                release_date: node.releaseYear?.year?.toString(),
                vote_average: node.ratingsSummary?.aggregateRating || 0,
                overview: "No description available.",
                media_type: "movie"
            };
        });
    } catch (err: any) {
        console.error("IMDb Scraper Error:", err);
        return [{
            id: 'error',
            title: 'Error Loading Data',
            media_type: 'movie',
            overview: `Error: ${err.message}`
        }];
    }
}

export async function getPopularTVIMDb() {
    try {
        const res = await fetch("https://www.imdb.com/chart/tvmeter/", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            },
            next: { revalidate: 3600 }
        });

        if (!res.ok) throw new Error("Failed to fetch IMDb TV chart");

        const html = await res.text();
        const $ = cheerio.load(html);
        const script = $("#__NEXT_DATA__").html();

        if (!script) return [];

        const data = JSON.parse(script);
        const edges = data.props?.pageProps?.pageData?.chartTitles?.edges || [];

        return edges.map((edge: any) => {
            const node = edge.node;
            return {
                id: node.id,
                name: node.titleText?.text,
                poster_path: node.primaryImage?.url,
                backdrop_path: node.primaryImage?.url,
                first_air_date: node.releaseYear?.year?.toString(),
                vote_average: node.ratingsSummary?.aggregateRating || 0,
                overview: "No description available.",
                media_type: "tv"
            };
        });
    } catch (err) {
        console.error("IMDb TV Scraper Error:", err);
        return [];
    }
}

export async function searchIMDb(query: string) {
    try {
        const res = await fetch(`${SEARCH_API}?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (!data.ok) return [];

        return (data.description || []).map((item: any) => ({
            id: item["#IMDB_ID"],
            title: item["#TITLE"],
            poster_path: item["#IMG_POSTER"],
            backdrop_path: item["#IMG_POSTER"],
            release_date: item["#YEAR"]?.toString(),
            vote_average: 0,
            overview: `Starring: ${item["#ACTORS"]}`,
            media_type: item["#IMDB_ID"]?.startsWith("tt") ? "movie" : "tv" // Simplistic
        }));
    } catch (err) {
        console.error("IMDb Search Error:", err);
        return [];
    }
}

export async function getIMDbDetails(id: string) {
    // We'll use the search API with the specific ID if possible, 
    // or just return basic info from our scraping if we had it.
    // The ianidiotareyoutoo API has a search by tt ID.
    try {
        const res = await fetch(`${SEARCH_API}?tt=${id}`);
        const data = await res.json();
        if (!data.short) return null;

        const s = data.short;
        return {
            id: id,
            title: s.name,
            name: s.name,
            poster_path: s.image,
            backdrop_path: s.image,
            overview: s.description,
            vote_average: s.aggregateRating?.ratingValue || 0,
            release_date: s.datePublished,
            genres: s.genre?.map((g: string) => ({ name: g })),
            runtime: s.duration ? parseInt(s.duration.replace("PT", "").replace("M", "")) : 0,
            recommendations: { results: [] }
        };
    } catch (err) {
        console.error("IMDb Detail Error:", err);
        return null;
    }
}
