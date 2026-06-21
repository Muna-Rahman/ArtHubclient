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
    bgImage: "https://plus.unsplash.com/premium_photo-1669533188185-65e346a34190?q=80&w=871&auto=format&fit=crop",
    cta: "Browse Artworks"
  },
  {
    title: "Empower Independent Creators",
    tagline: "Support artists directly with secure transactional pipelines and clear profile structures.",
    bgImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1600",
    cta: "Meet Artists"
  },
  {
    title: "Exhibit Unique Digital Masterpieces",
    tagline: "From classic oil compositions to modern AI and algorithmic generative UI concepts.",
    bgImage: "https://plus.unsplash.com/premium_photo-1663937576055-a1d89f3895ca?q=80&w=870&auto=format&fit=crop",
    cta: "Explore Digital"
  }
];

export default function HomePage() {
  const [featuredArt, setFeaturedArt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch("/api/artworks?limit=6")
      .then((res) => res.json())
      .then((data) => {
        if (data.artworks && data.artworks.length > 0) {
          setFeaturedArt(data.artworks);
        } else {
          setFeaturedArt([
            { _id: "m1", title: "Neon Horizon", price: 250, artistName: "A. Chowdhury", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600" },
            { _id: "m2", title: "Ethereal Echoes", price: 420, artistName: "S. Miah", image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600" },
            { _id: "m3", title: "Abstract Serenity", price: 180, artistName: "R. Rahman", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600" },
            { _id: "m4", title: "Shattered Light", price: 310, artistName: "A. Chowdhury", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600" },
            { _id: "m5", title: "Cybernetic Genesis", price: 550, artistName: "S. Miah", image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600" },
            { _id: "m6", title: "Timeless Fluidity", price: 290, artistName: "R. Rahman", image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=600" }
          ]);
        }
        setLoading(false);
      })
      .catch(() => {
        setFeaturedArt([
          { _id: "m1", title: "Neon Horizon", price: 250, artistName: "A. Chowdhury", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600" },
          { _id: "m2", title: "Ethereal Echoes", price: 420, artistName: "S. Miah", image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600" },
          { _id: "m3", title: "Abstract Serenity", price: 180, artistName: "R. Rahman", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600" }
        ]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const topArtists = [
    { id: "1", name: "A Chowdhury", sales: "42 Sales", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
    { id: "2", name: "S Miah", sales: "38 Sales", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
    { id: "3", name: "R Rahman", sales: "31 Sales", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" }
  ];

  const categories = [
    { name: "Painting", slug: "painting", count: "120+ Pieces", bg: "bg-orange-500/10 text-orange-500 border border-orange-500/20" },
    { name: "Digital Art", slug: "digital", count: "340+ Pieces", bg: "bg-blue-500/10 text-blue-500 border border-blue-500/20" },
    { name: "Sculpture", slug: "sculpture", count: "45+ Pieces", bg: "bg-purple-500/10 text-purple-500 border border-purple-500/20" },
    { name: "Photography", slug: "photography", count: "90+ Pieces", bg: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
      
      
      <section className="relative h-[80vh] flex items-center justify-center border-b border-zinc-800 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url(${bannerSlides[currentSlide].bgImage})` }}
          />
        </AnimatePresence>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-xl">
                {bannerSlides[currentSlide].title}
              </h1>
              <p className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
                {bannerSlides[currentSlide].tagline}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Button 
              as={Link} 
              href="/browse" 
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-lg shadow-orange-500/20"
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
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-orange-500" : "w-2 bg-zinc-600"}`}
            />
          ))}
        </div>
      </section>

    
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
              <div key={i} className="h-80 w-full bg-zinc-900 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredArt.length > 0 && featuredArt.map((art) => (
              <motion.div key={art._id} variants={fadeInUp} whileHover={{ y: -8 }} className="h-full">
                <div className="border border-zinc-800 bg-zinc-900/40 backdrop-blur-md rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-zinc-700">
                  <div className="relative overflow-hidden group h-64 w-full bg-zinc-800">
                    <img
                      alt={art.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      src={art.image}
                    />
                  </div>
                  <div className="flex flex-col items-start p-5 space-y-2 flex-grow justify-between bg-zinc-950/90">
                    <div className="w-full">
                      <div className="flex justify-between w-full items-center">
                        <h3 className="font-bold text-lg truncate pr-2 text-white">{art.title}</h3>
                        <span className="text-orange-400 font-bold">${art.price}</span>
                      </div>
                      <p className="text-zinc-500 text-xs truncate w-full mt-1">By {art.artistName}</p>
                    </div>
                    <Button as={Link} href={`/artworks/${art._id}`} fullWidth size="sm" className="bg-zinc-800 text-white font-medium mt-4 rounded-xl hover:bg-zinc-700">
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

     
      <section className="bg-zinc-900/30 border-y border-zinc-800/80 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Top Creators This Week</h2>
            <p className="text-zinc-500 text-sm mt-1">Based on global marketplace transactional sales volume</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {topArtists.map((artist) => (
              <motion.div key={artist.id} variants={fadeInUp} whileHover={{ scale: 1.02 }}>
                <div className="bg-zinc-900/40 border border-zinc-800/60 p-6 flex items-center space-x-4 rounded-2xl backdrop-blur-sm">
                  <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-full border border-orange-500/30">
                    <img 
                      src={artist.avatar} 
                      alt={artist.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{artist.name}</h3>
                    <p className="text-zinc-400 text-sm font-medium">{artist.sales}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    
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