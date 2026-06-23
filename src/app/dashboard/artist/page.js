"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

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
        if (data.artworks) setArtworks(data.artworks);
        setLoading(false);
      });
  };

  useEffect(() => { fetchArtworks(); }, []);

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
    });
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    fetch(`http://localhost:5000/api/artworks/${id}`, { method: "DELETE" })
      .then(() => fetchArtworks());
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
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm">
            <option value="painting">Painting</option>
            <option value="digital">Digital Art</option>
            <option value="sculpture">Sculpture</option>
            <option value="photography">Photography</option>
          </select>
          <textarea placeholder="Write artist narrative commentary statement specifications..." className="w-full bg-transparent border border-zinc-800 p-3 rounded-xl text-sm h-24" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <Button type="submit" className="w-full bg-orange-500 font-bold text-white">Publish Asset</Button>
        </form>
      </div>

     
      <div className="lg:col-span-7 space-y-6">
        <h2 className="text-xl font-bold">Your Exhibited Gallery Portfolio</h2>
        {loading ? (
          <div className="h-48 bg-zinc-900/40 animate-pulse rounded-2xl" />
        ) : (
          <Table aria-label="Artist collection management ledger layout">
            <TableHeader>
              <TableColumn className="bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-800">Thumbnail Preview</TableColumn>
              <TableColumn className="bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-800">Title</TableColumn>
              <TableColumn className="bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-800">Valuation</TableColumn>
              <TableColumn className="bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-800 text-center">Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {artworks.map((art) => (
                <TableRow key={art._id} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors">
                  <TableCell><img src={art.image} alt="preview" className="w-12 h-12 object-cover rounded-lg" /></TableCell>
                  <TableCell className="font-bold text-white">{art.title}</TableCell>
                  <TableCell className="text-orange-400 font-black">${art.price}</TableCell>
                  <TableCell className="text-center">
                    <Button size="sm" onClick={() => handleDelete(art._id)} className="bg-red-950 text-red-400 border border-red-900/30">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}