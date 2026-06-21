"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Input } from "@heroui/react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "all";
  const sortParam = searchParams.get("sort") || "newest";

  useEffect(() => {
    setLoading(true);
    fetch("/api/artworks?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.artworks && data.artworks.length > 0) {
          setArtworks(data.artworks);
        } else {
          setArtworks([
            { _id: "m1", title: "Neon Horizon", price: 250, artistName: "A. Chowdhury", category: "digital", image: "https://picsum.photos/600/400?random=1" },
            { _id: "m2", title: "Ethereal Echoes", price: 420, artistName: "S. Miah", category: "painting", image: "https://picsum.photos/600/400?random=2" },
            { _id: "m3", title: "Abstract Serenity", price: 180, artistName: "R. Rahman", category: "painting", image: "https://picsum.photos/600/400?random=3" },
            { _id: "m4", title: "Shattered Light", price: 310, artistName: "A. Chowdhury", category: "sculpture", image: "https://picsum.photos/600/400?random=4" },
            { _id: "m5", title: "Cybernetic Genesis", price: 550, artistName: "S. Miah", category: "digital", image: "https://picsum.photos/600/400?random=5" },
            { _id: "m6", title: "Timeless Fluidity", price: 290, artistName: "R. Rahman", category: "photography", image: "https://picsum.photos/600/400?random=6" }
          ]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/browse?${params.toString()}`);
  };

  const filteredArtworks = artworks.filter((art) => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchParam.toLowerCase()) ||
      art.artistName.toLowerCase().includes(searchParam.toLowerCase());
    const matchesCategory = categoryParam === "all" || art.category === categoryParam;
    return matchesSearch && matchesCategory;
  });

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (sortParam === "price-low") return a.price - b.price;
    if (sortParam === "price-high") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Explore Masterpieces</h1>
          <p className="text-zinc-500 text-sm mt-1">Discover elite compositions from creators globally.</p>
        </div>

    
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-zinc-900/40 p-4 border border-zinc-800 rounded-2xl backdrop-blur-md">
          <div className="md:col-span-6">
            <Input
              type="text"
              label="Search artwork or artist..."
              value={searchParam}
              onChange={(e) => updateParams("search", e.target.value)}
              className="w-full text-white"
              variant="bordered"
            />
          </div>
          
          <div className="md:col-span-3 flex flex-col justify-center">
            <select
              value={categoryParam}
              onChange={(e) => updateParams("category", e.target.value)}
              className="w-full h-[56px] px-3 bg-transparent border-2 border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 text-sm focus:outline-none transition-colors duration-200 cursor-pointer"
            >
              <option value="all" className="bg-zinc-900 text-white">All Categories</option>
              <option value="painting" className="bg-zinc-900 text-white">Painting</option>
              <option value="digital" className="bg-zinc-900 text-white">Digital Art</option>
              <option value="sculpture" className="bg-zinc-900 text-white">Sculpture</option>
              <option value="photography" className="bg-zinc-900 text-white">Photography</option>
            </select>
          </div>

          
          <div className="md:col-span-3 flex flex-col justify-center">
            <select
              value={sortParam}
              onChange={(e) => updateParams("sort", e.target.value)}
              className="w-full h-[56px] px-3 bg-transparent border-2 border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 text-sm focus:outline-none transition-colors duration-200 cursor-pointer"
            >
              <option value="newest" className="bg-zinc-900 text-white">Newest First</option>
              <option value="price-low" className="bg-zinc-900 text-white">Price: Low to High</option>
              <option value="price-high" className="bg-zinc-900 text-white">Price: High to Low</option>
            </select>
          </div>
        </div>

      
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border border-zinc-800 bg-zinc-900/20 rounded-2xl h-80 w-full animate-pulse flex flex-col justify-between p-4">
                <div className="h-44 bg-zinc-800 rounded-xl w-full" />
                <div className="h-4 bg-zinc-800 rounded w-2/3 mt-2" />
                <div className="h-3 bg-zinc-800 rounded w-1/2 mt-1" />
              </div>
            ))}
          </div>
        ) : sortedArtworks.length > 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {sortedArtworks.map((art) => (
              <motion.div key={art._id} variants={fadeInUp} whileHover={{ y: -6 }}>
                <Link href={`/browse/${art._id}`}>
                  <div className="border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer hover:border-zinc-700 transition-all duration-300 group">
                    <div className="relative h-40 md:h-48 w-full overflow-hidden bg-zinc-800">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-grow bg-zinc-950/90">
                      <div>
                        <h3 className="font-bold text-sm md:text-base text-white truncate">{art.title}</h3>
                        <p className="text-zinc-500 text-xs truncate mt-0.5">By {art.artistName}</p>
                      </div>
                      <div className="flex justify-between items-center w-full mt-4 pt-2 border-t border-zinc-800/60">
                        <span className="text-orange-400 font-extrabold text-sm md:text-base">${art.price}</span>
                        <span className="text-zinc-600 text-xs font-semibold uppercase tracking-wider">{art.category || "art"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-3xl max-w-xl mx-auto space-y-3">
            <h3 className="text-xl font-bold text-zinc-300">No Masterpieces Found</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              We couldn't find any artwork records matching your filter settings. Try adjustments or clear search parameters!
            </p>
            <Button 
              size="sm" 
              className="bg-zinc-800 text-zinc-300 font-medium rounded-xl mt-2"
              onClick={() => router.push("/browse")}
            >
              Reset Filters
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function BrowseArtworksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
        Syncing exploration grids...
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}