"use client";

import React, { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";

export default function ArtistDashboard() {
  const artistEmail = "artist1@arthub.com"; 
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({ title: "", price: "", category: "painting", description: "", image: "" });

  const fetchArtworks = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/artist/artworks?email=${artistEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.artworks) {
          setArtworks(data.artworks);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching artist portfolio:", err);
        setLoading(false);
      });
  };

  useEffect(() => { 
    fetchArtworks(); 
  }, []);

  const handleAddArtwork = (e) => {
    e.preventDefault();
    const payload = { ...formData, artistName: "A. Chowdhury", artistEmail };
    
    fetch("http://localhost:5000/api/artworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then((res) => res.json())
    .then(() => {
      alert("Composition successfully published to live marketplace catalog cluster!");
      setFormData({ title: "", price: "", category: "painting", description: "", image: "" });
      fetchArtworks();
    })
    .catch((err) => console.error("Error adding artwork:", err));
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    fetch(`http://localhost:5000/api/artworks/${id}`, { method: "DELETE" })
      .then(() => fetchArtworks())
      .catch((err) => console.error("Error deleting artwork:", err));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
      

      <div className="lg:col-span-5 space-y-6 bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl h-fit">
        <div>
          <h2 className="text-xl font-black">Publish New Composition</h2>
          <p className="text-zinc-500 text-xs mt-1">Upload files, append prices, and classify category mediums.</p>
        </div>
        <form onSubmit={handleAddArtwork} className="space-y-4">
          <Input label="Artwork Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} variant="bordered" required />
          <Input label="Acquisition Price ($)" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} variant="bordered" required />
          <Input label="Image Thumbnail Link URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} variant="bordered" required />
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm text-white focus:outline-none">
            <option value="painting">Painting</option>
            <option value="digital">Digital Art</option>
            <option value="sculpture">Sculpture</option>
            <option value="photography">Photography</option>
          </select>
          <textarea placeholder="Write artist narrative commentary statement specifications..." className="w-full bg-transparent border border-zinc-800 p-3 rounded-xl text-sm h-24 text-white focus:outline-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <Button type="submit" className="w-full bg-orange-500 font-bold text-white py-6 rounded-xl">Publish Asset</Button>
        </form>
      </div>

    
      <div className="lg:col-span-7 space-y-6">
        <h2 className="text-xl font-bold">Your Exhibited Gallery Portfolio</h2>
        
        <div className="w-full border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/20 backdrop-blur-md">
    
          <div className="grid grid-cols-12 bg-zinc-900/80 p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
            <div className="col-span-3">Preview</div>
            <div className="col-span-4">Title</div>
            <div className="col-span-3">Valuation</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

       
          {loading ? (
            <div className="p-8 text-center text-zinc-500 text-sm animate-pulse">Syncing catalog data streams...</div>
          ) : artworks.length > 0 ? (
            <div className="divide-y divide-zinc-900">
              {artworks.map((art) => (
                <div key={art._id} className="grid grid-cols-12 p-4 items-center text-sm hover:bg-zinc-900/30 transition-colors">
                  <div className="col-span-3">
                    <img src={art.image} alt={art.title} className="w-12 h-12 object-cover rounded-xl border border-zinc-800" />
                  </div>
                  <div className="col-span-4 font-bold text-white truncate pr-2">{art.title}</div>
                  <div className="col-span-3 text-orange-400 font-black">${art.price}</div>
                  <div className="col-span-2 text-center">
                    <button 
                      onClick={() => handleDelete(art._id)} 
                      className="px-3 py-1.5 bg-red-950/40 hover:bg-red-950 text-red-400 border border-red-900/30 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 text-sm">No artworks listed in your portfolio gallery yet.</div>
          )}
        </div>
      </div>

    </div>
  );
}