"use client";

import React, { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";

export default function ArtistDashboard() {
  const artistEmail = "artist1@arthub.com"; 
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); 

  const [formData, setFormData] = useState({ 
    title: "", 
    price: "", 
    category: "painting", 
    description: "", 
    image: "" 
  });

  const fetchArtworks = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/artist/artworks?email=${artistEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.artworks) setArtworks(data.artworks);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchArtworks(); }, []);


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    
  
    const uploadPayload = new FormData();
    uploadPayload.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: uploadPayload,
      });
      const data = await response.json();

      if (data.success) {
     
        setFormData((prev) => ({ ...prev, image: data.data.url }));
      } else {
        alert("Failed to store asset to imgBB infrastructure cluster.");
      }
    } catch (err) {
      console.error("Hosting channel upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddArtwork = (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please wait for the artwork image file upload process to complete.");
      return;
    }

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
    });
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    fetch(`http://localhost:5000/api/artworks/${id}`, { method: "DELETE" })
      .then(() => fetchArtworks());
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans">
      
   
      <div className="lg:col-span-5 space-y-6 bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl h-fit">
        <div>
          <h2 className="text-xl font-black">Publish New Composition</h2>
          <p className="text-zinc-500 text-xs mt-1">Upload files, append prices, and classify category mediums.</p>
        </div>
        <form onSubmit={handleAddArtwork} className="space-y-4">
          <Input label="Artwork Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} variant="bordered" required />
          <Input label="Acquisition Price ($)" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} variant="bordered" required />
          
       
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Artwork Media File</label>
            <div className="border border-dashed border-zinc-800 bg-zinc-900/30 p-4 rounded-xl flex flex-col items-center justify-center text-center relative hover:border-zinc-700 transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
                required={!formData.image}
              />
              {uploading ? (
                <p className="text-orange-400 text-sm font-semibold animate-pulse">Uploading asset files to CDN...</p>
              ) : formData.image ? (
                <div className="flex items-center gap-3">
                  <img src={formData.image} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-zinc-800" />
                  <p className="text-emerald-400 text-xs font-bold">✓ Asset File Ready</p>
                </div>
              ) : (
                <p className="text-zinc-500 text-xs">Click or drag canvas asset image here to upload</p>
              )}
            </div>
          </div>

          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm text-white focus:outline-none">
            <option value="painting">Painting</option>
            <option value="digital">Digital Art</option>
            <option value="sculpture">Sculpture</option>
            <option value="photography">Photography</option>
          </select>
          <textarea placeholder="Write artist narrative commentary statement specifications..." className="w-full bg-transparent border border-zinc-800 p-3 rounded-xl text-sm h-24 text-white focus:outline-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <Button type="submit" disabled={uploading} className="w-full bg-orange-500 font-bold text-white py-6 rounded-xl disabled:opacity-40">
            Publish Asset
          </Button>
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
                    <button onClick={() => handleDelete(art._id)} className="px-3 py-1.5 bg-red-950/40 hover:bg-red-950 text-red-400 border border-red-900/30 rounded-xl text-xs font-medium transition-colors cursor-pointer">Delete</button>
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