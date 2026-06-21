"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ArtworkDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(false);

  useEffect(() => {
    setLoading(true);
    setErrorState(false);
    
    
    fetch("/api/artworks")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.artworks) {
          const found = data.artworks.find((item) => item._id === id);
          if (found) {
            setArtwork(found);
          } else {
            setErrorState(true);
          }
        } else {
          setErrorState(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch operational error:", err);
        setErrorState(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4 text-zinc-500">
        <div className="w-12 h-12 border-4 border-t-orange-500 border-zinc-800 rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide">Syncing Gallery Asset Specifications dynamically...</p>
      </div>
    );
  }

 
  if (errorState || !artwork) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-md border border-dashed border-zinc-800 p-10 rounded-3xl">
          <h2 className="text-2xl font-black text-zinc-300">Artwork Not Found</h2>
          <p className="text-zinc-500 text-sm">The item index identifier is invalid, or the product record does not exist on your live cloud database cluster.</p>
          <Button as={Link} href="/browse" className="bg-zinc-900 text-white font-medium rounded-xl border border-zinc-800">
            Return to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 md:py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <Link href="/browse" className="text-zinc-500 hover:text-orange-500 transition-colors text-sm font-medium inline-flex items-center gap-2">
          ← Return to Exploration Matrix
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
        
          <div className="lg:col-span-7 bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative aspect-[4/3]">
            <img 
              src={artwork.image} 
              alt={artwork.title} 
              className="w-full h-full object-cover"
            />
          </div>

       
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-5 space-y-6"
          >
            <div className="space-y-3">
              <span className="px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                {artwork.category || "Fine Art"}
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">{artwork.title}</h1>
              
            
              <p className="text-zinc-400 font-medium text-sm">
                By{" "}
                <Link href={`/browse?search=${artwork.artistName}`} className="text-orange-400 hover:underline transition-all">
                  {artwork.artistName}
                </Link>
              </p>
              <p className="text-zinc-600 text-xs font-medium">Uploaded: {artwork.createdAt ? new Date(artwork.createdAt).toLocaleDateString() : "Recently"}</p>
            </div>

          
            <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Creator Narrative</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{artwork.description || "No descriptions provided by the host artist node for this composition entry."}</p>
            </div>

       
            <div className="border-y border-zinc-800/80 py-5 flex justify-between items-center">
              <div>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Acquisition Value</p>
                <p className="text-3xl font-black text-orange-400 mt-0.5">${artwork.price}</p>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Status</p>
                <span className="text-emerald-400 font-bold mt-1 text-xs bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block uppercase tracking-wider">Available</span>
              </div>
            </div>

            
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-base py-6 rounded-xl shadow-lg shadow-orange-500/10">
                Proceed to Stripe Checkout
              </Button>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
}