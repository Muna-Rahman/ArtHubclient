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
  
  // 📄 PAGINATION STATE CONTROL
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "all";
  const sortParam = searchParams.get("sort") || "newest";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";

  useEffect(() => {
    setLoading(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiBaseUrl}/api/artworks`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.artworks) {
          setArtworks(data.artworks);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Browse live channel error:", err);
        setLoading(false);
      });
  }, []);

  // 🔄 Reset pagination to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchParam, categoryParam, sortParam, minPriceParam, maxPriceParam]);

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
    // 🌟 SAFE NAVIGATIONAL FALLBACKS: Avoid runtime crashes if fields are missing
    const title = art.title || "";
    const artistName = art.artistName || "";
    const category = art.category || "";

    const matchesSearch =
      title.toLowerCase().includes(searchParam.toLowerCase()) ||
      artistName.toLowerCase().includes(searchParam.toLowerCase());
      
    // 🌟 BULLETPROOF REVERSE SUBSTRING MATCHING
    // Ensures "Painting" or "Digital Art" entries match option values like "painting" or "digital"
    const matchesCategory =
      categoryParam === "all" || 
      category.toLowerCase().trim().includes(categoryParam.toLowerCase().trim()) ||
      categoryParam.toLowerCase().trim().includes(category.toLowerCase().trim());
    
    const price = parseFloat(art.price) || 0;
    const matchesMinPrice = minPriceParam === "" || price >= parseFloat(minPriceParam);
    const matchesMaxPrice = maxPriceParam === "" || price <= parseFloat(maxPriceParam);

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (sortParam === "price-low") return a.price - b.price;
    if (sortParam === "price-high") return b.price - a.price;
    if (sortParam === "newest") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    return 0;
  });

  // 🧮 PAGINATION MATRICES
  const totalPages = Math.ceil(sortedArtworks.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedArtworks = sortedArtworks.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-7xl mx-auto space-y-10">

        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Explore Masterpieces</h1>
          <p className="text-zinc-500 text-sm mt-1">Discover elite compositions from creators globally.</p>
        </div>

        {/* CONTROLS BAR */}
        <div className="space-y-4 bg-zinc-900/40 p-5 border border-zinc-800 rounded-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-zinc-800/50">
            <Input
              type="number"
              label="Min Price ($)"
              value={minPriceParam}
              onChange={(e) => updateParams("minPrice", e.target.value)}
              variant="bordered"
              size="sm"
              className="text-white"
            />
            <Input
              type="number"
              label="Max Price ($)"
              value={maxPriceParam}
              onChange={(e) => updateParams("maxPrice", e.target.value)}
              variant="bordered"
              size="sm"
              className="text-white"
            />
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
        ) : paginatedArtworks.length > 0 ? (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {paginatedArtworks.map((art) => (
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

            {/* 📟 INTERACTIVE PAGINATION CONTROLS BAR */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-8 border-t border-zinc-900">
                <Button
                  size="sm"
                  variant="bordered"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-xl font-medium disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1.5">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isActive = currentPage === pageNumber;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-9 h-9 text-xs font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isActive
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                            : "bg-zinc-900/50 text-zinc-400 border border-zinc-800/60 hover:border-zinc-600 hover:text-white"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <Button
                  size="sm"
                  variant="bordered"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-xl font-medium disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-3xl max-w-xl mx-auto space-y-3">
            <h3 className="text-xl font-bold text-zinc-300">No Masterpieces Found</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              We couldn&apos;t find any artwork records matching your filter settings. Try adjustments or clear search parameters!
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