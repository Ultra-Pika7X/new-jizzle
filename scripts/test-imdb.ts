
import { getPopularIMDb, getPopularTVIMDb } from "../src/lib/imdb";

async function main() {
    console.log("Testing getPopularIMDb...");
    const movies = await getPopularIMDb();
    console.log(`Movies found: ${movies.length}`);
    if (movies.length > 0) {
        console.log("First movie:", JSON.stringify(movies[0], null, 2));
    }

    console.log("\nTesting getPopularTVIMDb...");
    const tv = await getPopularTVIMDb();
    console.log(`TV Shows found: ${tv.length}`);
    if (tv.length > 0) {
        console.log("First TV show:", JSON.stringify(tv[0], null, 2));
    }
}

main().catch(console.error);
