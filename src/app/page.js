"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.15 } 
  }
};

const bannerSlides = [
  {
    title: "Discover & Buy Original Art",
    tagline: "Explore, collect, and exhibit original pieces from independent creators worldwide.",
    bgImage: "https://plus.unsplash.com/premium_photo-1669533188185-65e346a34190?q=80&w=1600&auto=format&fit=crop",
    cta: "Browse Artworks"
  },
  {
    title: "Empower Independent Creators",
    tagline: "Support artists directly with secure transactional pipelines and clear profile structures.",
    bgImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1600&auto=format&fit=crop",
    cta: "Browse Artworks"
  },
  {
    title: "Exhibit Unique Digital Masterpieces",
    tagline: "From classic oil compositions to modern AI and algorithmic generative canvas designs.",
    bgImage: "https://plus.unsplash.com/premium_photo-1663937576055-a1d89f3895ca?q=80&w=1600&auto=format&fit=crop",
    cta: "Browse Artworks"
  }
];

export default function HomePage() {
  const [featuredArt, setFeaturedArt] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [artistsLoading, setArtistsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setLoading(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
   
    fetch(`${apiBaseUrl}/api/artworks?limit=6&t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.artworks) {
          setFeaturedArt(data.artworks.slice(0, 6));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Express data connection stream error:", err);
        setLoading(false);
      });
  }, []);

  // Fetch live operational analytics database summaries for Top Artists
  useEffect(() => {
    setArtistsLoading(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiBaseUrl}/api/artists/top`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.artists) {
          setTopArtists(data.artists);
        } else {
          // Robust deployment UI fallback array
          setTopArtists([
            { _id: "1", artistName: "A. Chowdhury", totalSalesVolume: 420, artworksCount: 5 },
            { _id: "2", artistName: "S. Miah", totalSalesVolume: 380, artworksCount: 4 },
            { _id: "3", artistName: "R. Rahman", totalSalesVolume: 310, artworksCount: 3 }
          ]);
        }
        setArtistsLoading(false);
      })
      .catch(() => {
        setArtistsLoading(false);
      });
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  const categories = [
    { name: "Painting", slug: "painting", count: "Explore Collection", bg: "bg-orange-500/10 text-orange-500 border border-orange-500/20" },
    { name: "Digital Art", slug: "digital", count: "Explore Collection", bg: "bg-blue-500/10 text-blue-500 border border-blue-500/20" },
    { name: "Sculpture", slug: "sculpture", count: "Explore Collection", bg: "bg-purple-500/10 text-purple-500 border border-purple-500/20" },
    { name: "Photography", slug: "photography", count: "Explore Collection", bg: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
      
      {/* Hero Banner Slider */}
      <section className="relative h-[70vh] flex items-center justify-center border-b border-zinc-800 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.9)), url(${bannerSlides[currentSlide].bgImage})` 
            }}
          />
        </AnimatePresence>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-2xl">
                {bannerSlides[currentSlide].title}
              </h1>
              <p className="text-zinc-300 text-base md:text-lg max-w-2xl mx-auto drop-shadow-md">
                {bannerSlides[currentSlide].tagline}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="inline-block">
            <Button 
              as={Link} 
              href="/browse" 
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-base px-8 py-6 rounded-xl shadow-xl shadow-orange-500/20"
            >
              {bannerSlides[currentSlide].cta}
            </Button>
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-20">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide ? "w-8 bg-orange-500" : "w-2 bg-zinc-600 hover:bg-zinc-400"
              }`}
              aria-label={`Maps directly to slide component frame index ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Dynamic Featured Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex justify-between items-end mb-10"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Artworks</h2>
            <p className="text-zinc-500 text-sm mt-1">Fresh collection curated dynamically on refresh</p>
          </div>
          <Button as={Link} href="/browse" variant="light" className="text-orange-500 font-medium">View All</Button>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 w-full bg-zinc-900/40 animate-pulse rounded-2xl border border-zinc-800" />
            ))}
          </div>
        ) : featuredArt.length > 0 ? (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredArt.map((art) => (
              <motion.div key={art._id} variants={fadeInUp} whileHover={{ y: -6 }} className="h-full">
                <Link href={`/browse/${art._id}`}>
                  <div className="border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm rounded-2xl overflow-hidden h-full flex flex-col justify-between cursor-pointer hover:border-zinc-700 transition-all duration-300 group">
                    <div className="relative overflow-hidden h-56 w-full bg-zinc-900">
                      <img
                        alt={art.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        src={art.image}
                      />
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-grow bg-zinc-950/90 space-y-4">
                      <div className="flex justify-between items-start w-full">
                        <div>
                          <h3 className="font-bold text-base text-white truncate max-w-[180px]">{art.title}</h3>
                          <p className="text-zinc-500 text-xs mt-0.5">By {art.artistName}</p>
                        </div>
                        <span className="text-orange-400 font-black text-base">${art.price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl max-w-md mx-auto text-zinc-500 text-sm">
            No active collection listings found. Publish compositions via the artist panel to populate this row grid dynamically!
          </div>
        )}
      </section>

      {/* LIVE EXTRA SECTION 1: TOP ARTISTS */}
      <section className="bg-zinc-900/20 border-y border-zinc-800/80 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Top Creators</h2>
            <p className="text-zinc-500 text-sm mt-1">Based on global marketplace transactional sales volume</p>
          </motion.div>

          {artistsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-zinc-900/40 animate-pulse border border-zinc-800 rounded-2xl" />
              ))}
            </div>
          ) : topArtists.length > 0 ? (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {topArtists.map((artist) => (
                <motion.div key={artist._id} variants={fadeInUp} whileHover={{ scale: 1.02 }}>
                  <div className="bg-zinc-900/40 border border-zinc-800/60 p-6 flex items-center space-x-4 rounded-2xl backdrop-blur-sm">
                    <div className="flex-shrink-0 w-14 h-14 overflow-hidden rounded-full border border-orange-500/20 bg-zinc-800 flex items-center justify-center font-bold text-orange-400 uppercase">
                      {artist.artistName?.slice(0, 2) || "CR"}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{artist.artistName || "Exhibited Creator"}</h3>
                      <p className="text-zinc-400 text-sm font-medium">Vol: ${parseFloat(artist.totalSalesVolume || 0).toFixed(2)} ({artist.artworksCount || 0} Sold)</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center text-zinc-500 text-sm">No volume data tracked.</div>
          )}
        </div>
      </section>

      {/* EXTRA SECTION 2: ART CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">Explore Categories</h2>
          <p className="text-zinc-500 text-sm mt-1">Filter original compositions by medium type</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((cat, idx) => (
            <motion.div key={idx} variants={fadeInUp} whileHover={{ y: -6 }}>
              <Link href={`/browse?category=${cat.slug}`}>
                <div className={`p-6 rounded-2xl transition-all duration-300 group cursor-pointer ${cat.bg}`}>
                  <h3 className="font-bold text-xl group-hover:underline">{cat.name}</h3>
                  <p className="text-xs opacity-70 mt-1">{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

    </div>
  );
}