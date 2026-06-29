"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Input } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

export default function ArtworkDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  const [artwork, setArtwork] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false); // 🌟 Controls Form Conditionality
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  // Editing Sub-states
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const viewerEmail = session?.user?.email;

  const fetchArtworkDetails = async () => {
    if (!id) return;
    setLoading(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const [artData, comData] = await Promise.all([
        fetch(`${apiBaseUrl}/api/artworks/${id}`).then(r => r.json()),
        fetch(`${apiBaseUrl}/api/artworks/${id}/comments`).then(r => r.json())
      ]);

      if (artData.success) setArtwork(artData.artwork);
      if (comData.success) setComments(comData.comments);

      // Verify collector purchase records from the user profile purchase directory
      if (viewerEmail) {
        const purchasesRes = await fetch(`${apiBaseUrl}/api/user/purchases?email=${encodeURIComponent(viewerEmail)}`).then(r => r.json());
        if (purchasesRes.success && purchasesRes.history) {
          const match = purchasesRes.history.some(tx => tx.artworkId === id);
          setHasPurchased(match);
        }
      }
    } catch (err) {
      toast.error("Failed to compile canvas data matrices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworkDetails();
  }, [id, viewerEmail]);

  const handlePostComment = async (e) => {
    e.preventDefault();
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
        toast.success("Commentary statement saved!");
        setCommentText("");
        fetchArtworkDetails(); // Refresh view state
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Handshake refused.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSaveEditComment = async (commentId) => {
    if (!editText.trim()) return;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const res = await fetch(`${apiBaseUrl}/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText, userEmail: viewerEmail })
      }).then(r => r.json());

      if (res.success) {
        toast.success("Comment modified successfully!");
        setEditingCommentId(null);
        fetchArtworkDetails();
      }
    } catch {
      toast.error("Failed to alter text document.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Remove your comment permanently from this exhibition?")) return;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const res = await fetch(`${apiBaseUrl}/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: viewerEmail })
      }).then(r => r.json());

      if (res.success) {
        toast.success("Comment deleted.");
        fetchArtworkDetails();
      }
    } catch {
      toast.error("Purge instruction rejected.");
    }
  };

  const handleBuyNow = async () => {
    if (!session) return router.push("/login");
    setPurchasing(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const res = await fetch(`${apiBaseUrl}/api/payment/create-artwork-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerEmail: viewerEmail, buyerName: session.user.name, artworkId: id })
      }).then(r => r.json());
      if (res.success && res.url) window.location.href = res.url;
    } catch {
      toast.error("Stripe routing link error.");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading || sessionLoading) return <div className="p-12 text-center text-zinc-600">Syncing Masterpiece Profile Canvas Matrix...</div>;
  if (!artwork) return <div className="p-12 text-center text-zinc-500">Masterpiece missing.</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-1/2 rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-950">
          <img src={artwork.image} alt={artwork.title} className="w-full h-auto object-cover aspect-square" />
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-orange-500/10 text-orange-400 rounded-md uppercase tracking-wider">{artwork.category}</span>
            <h1 className="text-4xl font-black tracking-tight">{artwork.title}</h1>
            <p className="text-sm text-zinc-500">
              Composed by: <span onClick={() => router.push(`/?artist=${artwork.artistEmail}`)} className="text-orange-400 font-bold hover:underline cursor-pointer">{artwork.artistName}</span>
            </p>
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{artwork.description}</p>

          <Card className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-row items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase">Acquisition Value</p>
              <p className="text-3xl font-black text-orange-400 mt-1">${artwork.price}</p>
            </div>
            <span className="inline-block px-2.5 py-0.5 text-xs font-extrabold text-emerald-400 bg-emerald-500/10 rounded-full uppercase">Available</span>
          </Card>

          <Button onClick={handleBuyNow} disabled={purchasing || hasPurchased} className="w-full bg-orange-500 text-white font-bold py-6 rounded-xl disabled:opacity-40">
            {hasPurchased ? "You Own This Masterpiece" : purchasing ? "Spanning security link..." : "Proceed to Stripe Checkout"}
          </Button>
        </div>
      </div>

      {/* COMMENTARY SYSTEM GRID */}
      <div className="border-t border-zinc-900 pt-10 space-y-6 max-w-3xl">
        <h2 className="text-xl font-bold tracking-tight">Collector Discourse Discussion ({comments.length})</h2>
        
        {/* 🌟 CONDITIONAL COMMENT FORM DISPLAY RULES */}
        {hasPurchased ? (
          <form onSubmit={handlePostComment} className="flex gap-3">
            <Input placeholder="Share an analytical statement critique response..." value={commentText} onChange={e => setCommentText(e.target.value)} variant="bordered" className="text-white" required />
            <Button type="submit" disabled={submittingComment} className="bg-orange-500 text-white font-bold px-6 rounded-xl">Post comment</Button>
          </form>
        ) : (
          <div className="p-4 bg-zinc-950/40 border border-dashed border-zinc-900 rounded-xl text-xs text-zinc-500 italic">
            🔒 Commentary access restricted. Leaving a review requires an item purchase transaction log.
          </div>
        )}

        {/* FEED LOOP ROW CONTAINER */}
        <div className="space-y-4 divide-y divide-zinc-900">
          {comments.map((com) => {
            const isCommentOwner = viewerEmail && com.userEmail === viewerEmail;
            return (
              <div key={com._id} className="pt-4 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">{com.userName} {isCommentOwner && <span className="text-[10px] text-orange-400 font-mono ml-1">(You)</span>}</span>
                  <span className="text-zinc-600">{new Date(com.createdAt).toLocaleDateString()}</span>
                </div>

                {editingCommentId === com._id ? (
                  <div className="flex gap-2 items-center">
                    <Input size="sm" value={editText} onChange={e => setEditText(e.target.value)} variant="bordered" className="text-white" />
                    <Button size="sm" onClick={() => handleSaveEditComment(com._id)} className="bg-emerald-500 text-white font-bold">Save</Button>
                    <button onClick={() => setEditingCommentId(null)} className="text-xs text-zinc-500 ml-1 hover:underline">Cancel</button>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400 leading-relaxed">{com.comment}</p>
                )}

                {/* INLINE EDIT & DELETE OPERATORS FOR COMMENT OWNER */}
                {isCommentOwner && editingCommentId !== com._id && (
                  <div className="flex gap-3 text-[11px] font-bold text-zinc-600 pt-0.5">
                    <button onClick={() => { setEditingCommentId(com._id); setEditText(com.comment); }} className="hover:text-orange-400 transition-colors cursor-pointer">Edit</button>
                    <button onClick={() => handleDeleteComment(com._id)} className="hover:text-red-500 transition-colors cursor-pointer">Delete</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}