import { DATA } from "@/data/resume";
import Link from "next/link";
import { ChevronLeft, Play, Info, Star } from "lucide-react";

async function getMovies() {
    const apiKey = process.env.TMDB_API_KEY;
    
    // Fallback to static data if no API key is provided
    if (!apiKey) {
        return DATA.movies?.map(m => ({ ...m, isTVShow: (m.tags as readonly string[])?.includes("TV Show") || (m.tags as readonly string[])?.includes("Series") })) || [];
    }

    try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error("Failed to fetch TMDB");
        const data = await res.json();
        
        // Map TMDB structure to our app's structure
        return data.results.slice(0, 24).map((movie: any) => ({
            title: movie.title || movie.name,
            description: movie.overview,
            imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image",
            tags: ["Trending", movie.media_type === 'tv' ? "TV Show" : "Movie"],
            link: `https://www.themoviedb.org/${movie.media_type || 'movie'}/${movie.id}`,
            rating: movie.vote_average ? movie.vote_average.toFixed(1) : null,
            releaseDate: movie.release_date || movie.first_air_date,
            isTVShow: movie.media_type === 'tv'
        }));
    } catch (e) {
        console.error("TMDB fetch failed:", e);
        return DATA.movies?.map(m => ({ ...m, isTVShow: (m.tags as readonly string[])?.includes("TV Show") || (m.tags as readonly string[])?.includes("Series") })) || [];
    }
}

import { MovieTabs } from "@/components/movie-tabs";

export default async function NetflixPage() {
    const allItems = await getMovies();
    
    const movies = allItems.filter((item: any) => !item.isTVShow);
    const series = allItems.filter((item: any) => item.isTVShow);

    return (
        <div className="flex flex-col min-h-screen pb-24 bg-background">
            <div className="w-[95%] max-w-[1200px] mx-auto p-6 md:p-10 flex flex-col gap-10">
                {/* Back Button */}
                <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="flex flex-col gap-y-8 mt-4">
                    
                    {/* Centered Pill Badge Header */}
                    <div className="flex flex-col gap-y-4 items-center justify-center">
                        <div className="flex items-center w-full">
                            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
                            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
                                <span className="text-background text-sm font-medium">My Vibe</span>
                            </div>
                            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
                        </div>
                        <div className="flex flex-col gap-y-3 items-center justify-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center">
                                Movies & Series I'm Watching
                            </h2>
                            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center max-w-2xl">
                                A collection of movies and shows that match my current vibe.
                            </p>
                        </div>
                    </div>

                    <MovieTabs movies={movies} series={series} />
                </div>
            </div>
        </div>
    );
}
