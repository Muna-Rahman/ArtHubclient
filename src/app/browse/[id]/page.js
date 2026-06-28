"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button, Card, Input } from "@heroui/react"; 
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

export default function ArtworkDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // 🌟 SECURITY & SESSION INITIALIZATION
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  const [artwork, setArtwork] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const viewerEmail = session?.user?.email;

  const fetchArtworkAndComments = async () => {
    if (!id) return;
    setLoading(true);
    // 🌟 FIX: Uniform Environmental Routing API Rule Setup
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const [artData, comData] = await Promise.all([
        fetch(`${apiBaseUrl}/api/artworks/${id}`).then(r => r.json()),
        fetch(`${apiBaseUrl}/api/artworks/${id}/comments`).then(r => r.json())
      ]);

      if (artData.success) setArtwork(artData.artwork);
      if (comData.success) setComments(comData.comments);
    } catch (err) {
      console.error("Error pulling masterpiece context:", err);
      toast.error("Failed to sync structural artwork dataset properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworkAndComments();
  }, [id]);

  // 🌟 ACTION: NATIVE COMMENTARY TRANSMISSION PIPELINE
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!session) return toast.error("Please log into your account to share comments.");
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const res = await fetch(`${apiBaseUrl}/api/artworks/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: session.user.name || "Collector",
          userEmail: viewerEmail,
          text: commentText
        })
      }).then(r => r.json());

      if (res.success) {
        toast.success("Commentary statement logged!");
        setCommentText("");
        // Instantly sync comment directory arrays
        const update = await fetch(`${apiBaseUrl}/api/artworks/${id}/comments`).then(r => r.json());
        if (update.success) setComments(update.comments);
      }
    } catch (err) {
      console.error("Comment submission failure:", err);
      toast.error("Comment delivery handshake refused.");
    } finally {
      setSubmittingComment(false);
    }
  };

  // 🌟 ACTION: STRIPE ACQUISITION CHECKOUT GENERATOR
  const handleBuyNow = async () => {
    if (!session) {
      toast.error("Please sign in to your account to purchase artworks.");
      return router.push("/login");
    }

    setPurchasing(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const response = await fetch(`${apiBaseUrl}/api/payment/create-artwork-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerEmail: viewerEmail,
          buyerName: session.user.name || "Collector",
          artworkId: id,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.url) {
        sessionStorage.setItem("pending_artwork_purchase", JSON.stringify({
          artworkId: id,
          buyerName: session.user.name || "Collector",
        }));
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Could not spin up payment portal instance.");
      }
    } catch (err) {
      console.error("Checkout link crash:", err);
      toast.error("Payment routing network handshake failure.");
    } finally {
      setPurchasing(false);
    }
  };

  // 🌟 ACTION: INLINE ARTIST PURGE REMOVAL CONTROLLER
  const handleDeleteArtwork = async () => {
    if (!confirm("Are you absolute certain you want to universally remove this composition?")) return;
    
    setDeleting(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const response = await fetch(`${apiBaseUrl}/api/artworks/${id}`, { method: "DELETE" });
      const data = await response.json();
      
      if (data.success) {
        toast.success("Masterpiece removed successfully from marketplace archives.");
        router.push("/browse");
      }
    } catch (err) {
      console.error("Error purging composition record:", err);
      toast.error("Universal deletion procedure failed.");
    } finally {
      setDeleting(false);
    }
  };

  // 🧱 SKELETON LOADING FRAMEWORK STATE
  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 md:p-16 flex flex-col md:flex-row gap-12 font-sans animate-pulse">
        <div className="w-full md:w-1/2 aspect-square bg-zinc-900 rounded-3xl" />
        <div className="w-full md:w-1/2 space-y-6 py-4">
          <div className="h-8 w-2/3 bg-zinc-900 rounded-xl" />
          <div className="h-4 w-1/3 bg-zinc-900 rounded-xl" />
          <div className="h-24 w-full bg-zinc-900 rounded-2xl" />
          <div className="h-12 w-1/2 bg-zinc-900 rounded-xl" />
        </div>
      </div>
    );
  }

  // ❌ RECORD NOT FOUND FALLBACK LAYER
  if (!artwork) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4 font-sans">
        <h2 className="text-xl font-bold text-zinc-400">Masterpiece Missing From Catalog</h2>
        <p className="text-zinc-600 text-sm">The item layout requested could not be resolved from cluster collections.</p>
        <Button size="sm" className="bg-zinc-900 text-white border border-zinc-800" onClick={() => router.push("/browse")}>
          Return to Marketplace
        </Button>
      </div>
    );
  }

  const isOwner = viewerEmail && artwork.artistEmail === viewerEmail;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans max-w-6xl mx-auto space-y-12">
      
      {/* UPPER CONTAINER: DETAILS MATRIX */}
      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* LEFT CANVAS LAYOUT */}
        <div className="w-full md:w-1/2 rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-950">
          <img 
            src={artwork.image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800"} 
            alt={artwork.title} 
            className="w-full h-auto object-cover aspect-square"
          />
        </div>

        {/* RIGHT METRICS LOGIC ROW */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-orange-500/10 text-orange-400 rounded-md uppercase tracking-wider">
              {artwork.category || "Unclassified"}
            </span>
            <h1 className="text-4xl font-black tracking-tight">{artwork.title}</h1>
            
            {/* 🌟 FIX: ARTIST NAME ANCHOR CLICKABLE WITH TARGETED FILTER REDIRECT */}
            <p className="text-sm text-zinc-500">
              Composed by:{" "}
              <span 
                onClick={() => router.push(`/?artist=${artwork.artistEmail}`)} 
                className="text-orange-400 font-bold hover:underline cursor-pointer transition-all"
              >
                {artwork.artistName || "Exhibited Creator"}
              </span>
              {isOwner && <span className="ml-2 text-xs text-orange-500 font-mono">(Your Production)</span>}
            </p>
          </div>

          <div className="h-[1px] w-full bg-zinc-900" />

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Creator Narrative Commentary</h3>
            <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
              {artwork.description || "No narrative statement supplied for this configuration."}
            </p>
          </div>

          <Card className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-row items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Acquisition Value</p>
              <p className="text-3xl font-black text-orange-400 mt-1">${artwork.price}</p>
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Status State</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-extrabold text-emerald-400 bg-emerald-500/10 rounded-full uppercase tracking-wider">
                Available
              </span>
            </div>
          </Card>

          {/* PRIVILEGED BUTTON MATRIX */}
          <div className="space-y-3">
            {isOwner ? (
              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 font-bold text-zinc-300 border border-zinc-800 py-6 rounded-xl transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/artist?edit=${artwork._id}`)}
                >
                  Edit Studio Asset
                </Button>
                <Button 
                  className="flex-1 bg-red-950/40 hover:bg-red-950 text-red-400 border border-red-900/30 font-bold py-6 rounded-xl transition-colors cursor-pointer"
                  onClick={handleDeleteArtwork}
                  disabled={deleting}
                >
                  {deleting ? "Purging File..." : "Delete Masterpiece"}
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleBuyNow}
                disabled={purchasing}
                className="w-full bg-orange-500 hover:bg-orange-600 py-6 font-bold text-white text-base rounded-xl transition-all shadow-lg cursor-pointer disabled:opacity-50"
              >
                {purchasing ? "Spanning secure network link..." : "Proceed to Stripe Checkout"}
              </Button>
            )}
            
            <p className="text-center text-[11px] text-zinc-600 font-medium">
              Published on catalog infrastructure: {artwork.createdAt ? new Date(artwork.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* 🌟 NEW FEATURE: FULL-SPECTRUM COMMENTS CONTEXT ENGINE */}
      <div className="border-t border-zinc-900 pt-10 space-y-6 max-w-3xl">
        <h2 className="text-xl font-bold tracking-tight">Community Commentary Discourse ({comments.length})</h2>
        
        <form onSubmit={handlePostComment} className="flex gap-3">
          <Input 
            placeholder="Share an analytical critique response expression statement..." 
            value={commentText} 
            onChange={e => setCommentText(e.target.value)} 
            variant="bordered" 
            className="text-white" 
            required 
          />
          <Button type="submit" disabled={submittingComment} className="bg-orange-500 text-white font-bold px-6 rounded-xl">Post</Button>
        </form>

        <div className="space-y-4 divide-y divide-zinc-900">
          {comments.length > 0 ? (
            comments.map((com, index) => (
              <div key={index} className="pt-4 space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">{com.userName}</span>
                  <span className="text-zinc-600">{new Date(com.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{com.text}</p>
              </div>
            ))
          ) : (
            <p className="text-zinc-600 text-sm italic pt-2">No statements supplied for this canvas piece yet.</p>
          )}
        </div>
      </div>

    </div>
  );
}