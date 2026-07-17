"use client";

import { useState } from "react";
import { Play, Info, Star } from "lucide-react";
import { cn } from "@/lib/utils";

function MovieGrid({ items }: { items: any[] }) {
    if (items.length === 0) {
        return <p className="text-muted-foreground text-sm text-center py-10">Nothing here yet!</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((movie: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-2">
                    <a 
                        href={movie.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative flex flex-col aspect-video md:aspect-[2/3] rounded-md overflow-hidden bg-muted transition-all duration-300 hover:scale-105 hover:z-10 shadow-lg cursor-pointer border border-border"
                    >
                        {/* Movie Image */}
                        <img 
                            src={movie.imageUrl} 
                            alt={movie.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-40"
                        />
                        
                        {/* Hover Overlay Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-t from-black via-black/80 to-transparent">
                            <h3 className="font-bold text-lg leading-tight mb-2 text-white">{movie.title}</h3>
                            
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center justify-center bg-white text-black rounded-full w-8 h-8">
                                    <Play className="w-4 h-4 ml-1" />
                                </div>
                                <div className="flex items-center justify-center border-2 border-gray-400 text-gray-400 rounded-full w-8 h-8 hover:border-white hover:text-white transition-colors">
                                    <Info className="w-4 h-4" />
                                </div>
                                {movie.rating && (
                                    <div className="ml-auto flex items-center gap-1 text-sm font-semibold text-yellow-400">
                                        <Star className="w-3.5 h-3.5 fill-yellow-400" />
                                        {movie.rating}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-2">
                                {movie.tags?.map((tag: string, tagIdx: number) => (
                                    <span key={tagIdx} className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                                        {tagIdx > 0 && <span className="w-1 h-1 rounded-full bg-gray-500"></span>}
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            
                            <p className="text-xs text-gray-400 line-clamp-3">
                                {movie.description}
                            </p>
                        </div>
                    </a>
                    <h3 className="font-semibold text-sm text-foreground px-1 truncate">{movie.title}</h3>
                </div>
            ))}
        </div>
    );
}

export function MovieTabs({ movies, series, anime = [] }: { movies: any[], series: any[], anime?: any[] }) {
    const [activeTab, setActiveTab] = useState<"movies" | "series" | "anime">("movies");

    return (
        <div className="flex flex-col gap-6 mt-4 w-full">
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={() => setActiveTab("movies")}
                    className={cn(
                        "px-6 py-2 rounded-full font-medium transition-all text-sm",
                        activeTab === "movies" 
                            ? "bg-primary text-primary-foreground shadow-md" 
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                >
                    Movies
                </button>
                <button
                    onClick={() => setActiveTab("series")}
                    className={cn(
                        "px-6 py-2 rounded-full font-medium transition-all text-sm",
                        activeTab === "series" 
                            ? "bg-primary text-primary-foreground shadow-md" 
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                >
                    TV Series
                </button>
                <button
                    onClick={() => setActiveTab("anime")}
                    className={cn(
                        "px-6 py-2 rounded-full font-medium transition-all text-sm",
                        activeTab === "anime" 
                            ? "bg-primary text-primary-foreground shadow-md" 
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                >
                    Anime
                </button>
            </div>

            <div className="mt-4">
                {activeTab === "movies" && <MovieGrid items={movies} />}
                {activeTab === "series" && <MovieGrid items={series} />}
                {activeTab === "anime" && <MovieGrid items={anime} />}
            </div>
        </div>
    );
}
