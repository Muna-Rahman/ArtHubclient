"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ArtworkDetailsPage() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    fetch("/api/artworks")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.artworks) {
          const found = data.artworks.find((item) => item._id === id);
          if (found) {
            setArtwork(found);
          } else {
          
            setArtwork({
              _id: id,
              title: "Exquisite Composition",
              price: 350,
              artistName: "ArtHub Resident Creator",
              category: "painting",
              image: `https://picsum.photos/800/600?random=${id}`
            });
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
        Assembling master item definitions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        
      
        <div className="mb-8">
          <Link href="/browse" className="text-zinc-500 hover:text-orange-500 transition-colors text-sm flex items-center gap-2">
            ← Return to Exploration Matrix
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
        
          <div className="lg:col-span-7 bg-zinc-900/20 border border-zinc-800 rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center relative">
            <img 
              src={artwork?.image} 
              alt={artwork?.title} 
              className="w-full h-full object-cover"
            />
          </div>

         
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-3">
              <span className="px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                {artwork?.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{artwork?.title}</h1>
              <p className="text-zinc-400 font-medium">By <span className="text-zinc-200">{artwork?.artistName}</span></p>
            </div>

            <div className="border-y border-zinc-800/80 py-6 flex justify-between items-center">
              <div>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Valuation Price</p>
                <p className="text-3xl font-black text-orange-400 mt-1">${artwork?.price}</p>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Availability Status</p>
                <p className="text-emerald-400 font-bold mt-1 text-sm bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block">Ready to Secure</p>
              </div>
            </div>

            
            <div className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-base py-6 rounded-xl shadow-lg shadow-orange-500/10">
                Proceed to Checkout
              </Button>
              <Button variant="bordered" className="w-full border-zinc-800 hover:bg-zinc-900 text-zinc-300 font-medium py-6 rounded-xl">
                Inquire With Artist
              </Button>
            </div>

            {/* DISCUSSION FEED METRICS PLACEHOLDER */}
            <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wider">Public Collector Commentary</h3>
              <p className="text-zinc-500 text-xs">
                Authentication is required to drop feedback or view dynamic commentary feeds. Please authenticate via the entry panel.
              </p>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
}