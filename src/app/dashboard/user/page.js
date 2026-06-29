"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Card } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

function UserDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveSubscriptionTier, setLiveSubscriptionTier] = useState(null);

  const [newName, setNewName] = useState("");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [updatingName, setUpdatingName] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const userEmail = session?.user?.email;
  const userName = session?.user?.name || "Collector";
  const activeTier = liveSubscriptionTier || "free";

  useEffect(() => {
    if (!isPending) {
      if (!session || session?.user?.role !== "user") {
        window.location.href = "/login";
      } else {
        setNewName(session.user.name || "");
      }
    }
  }, [session, isPending]);

  // 🌟 BULLETPROOF DIRECT REDIRECT HANDLER (READS URL PARAMS TO FORCE DB SAVANCE)
  useEffect(() => {
    const paymentSuccess = searchParams.get("payment_success");
    const purchaseSuccess = searchParams.get("purchase_success");
    const urlTier = searchParams.get("tier");
    const urlArtworkId = searchParams.get("artworkId");
    const urlBuyerName = searchParams.get("buyerName");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Fallback 1: Force Subscription Upgrade Database Writes
    if (paymentSuccess === "true" && userEmail) {
      const targetTier = urlTier || "pro";

      fetch(`${apiBaseUrl}/api/payment/confirm-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, tier: targetTier }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setLiveSubscriptionTier(data.tier);
            toast.success(`Upgraded to ${data.tier.toUpperCase()} successfully!`);
          }
          router.replace("/dashboard/user");
        })
        .catch(() => router.replace("/dashboard/user"));
    }

    // Fallback 2: Force Artwork Purchase Database Writes (No longer requires empty sessionStorage)
    if (purchaseSuccess === "true" && userEmail && urlArtworkId) {
      fetch(`${apiBaseUrl}/api/payment/confirm-purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          buyerEmail: userEmail, 
          buyerName: decodeURIComponent(urlBuyerName || "Collector"), 
          artworkId: urlArtworkId 
        }),
      })
        .then((res) => res.json())
        .then(() => {
          toast.success("Artwork purchase logged into database!");
          // Instantly re-fetch purchase logs to populate dashboard view items
          return fetch(`${apiBaseUrl}/api/user/purchases?email=${encodeURIComponent(userEmail)}`);
        })
        .then((r) => r.json())
        .then((d) => { if (d.success) setPurchases(d.history || []); })
        .catch((err) => console.error("Error confirming fallback checkout:", err))
        .finally(() => router.replace("/dashboard/user"));
    }
  }, [searchParams, userEmail, router]);

  // Fetch live user status tier details on dashboard mount
  useEffect(() => {
    if (userEmail) {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      fetch(`${apiBaseUrl}/api/user/profile?email=${encodeURIComponent(userEmail)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user?.subscriptionTier) {
            setLiveSubscriptionTier(data.user.subscriptionTier);
          }
        })
        .catch(() => {});
    }
  }, [userEmail]);

  // Fetch historical purchase log array
  useEffect(() => {
    if (!userEmail) return;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    setLoading(true);

    fetch(`${apiBaseUrl}/api/user/purchases?email=${encodeURIComponent(userEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.history) {
          setPurchases(data.history);
        }
      })
      .catch((err) => console.error("Error fetching purchases:", err))
      .finally(() => setLoading(false));
  }, [userEmail]);

  const handleUpgrade = async (tierName, costAmount) => {
    if (!userEmail) return;
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiBaseUrl}/api/payment/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, tier: tierName, priceAmount: costAmount })
      });

      const data = await response.json();
      if (data.success && data.url) window.location.href = data.url;
    } catch (err) {
      toast.error("Stripe gateway routing failure.");
    }
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setUpdatingName(true);
    const { error } = await authClient.user.updateName({ name: newName });
    if (!error) { 
      toast.success("Name updated!"); 
      setTimeout(() => window.location.reload(), 1000); 
    }
    setUpdatingName(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setUpdatingPassword(true);
    const { error } = await authClient.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword, revokeOtherSessions: true });
    if (!error) { 
      toast.success("Password updated!"); 
      setPasswordForm({ currentPassword: "", newPassword: "" }); 
    }
    setUpdatingPassword(false);
  };

  if (isPending || !session || session?.user?.role !== "user") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-sans">
        <p className="text-lg font-semibold tracking-wide animate-pulse text-zinc-400">
          Verifying secure account credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 space-y-14 font-sans">
      
      <div>
        <h1 className="text-3xl font-black tracking-tight">User Operations Command</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Welcome back, {userName} — Account Membership Rank: <span className="text-orange-400 font-bold uppercase tracking-wider">{activeTier}</span>
        </p>
      </div>

      {/* PLANS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Free (Default)", limit: "3 Paintings", cost: "$0", keyName: "free" },
          { title: "Pro Upgrade", limit: "9 Paintings", cost: "$9.99/mo", keyName: "pro" },
          { title: "Premium VIP", limit: "Unlimited Paintings", cost: "$19.99/mo", keyName: "premium" },
        ].map((tier, i) => {
          const isCurrentlyActive = activeTier === tier.keyName;
          return (
            <div key={i} className={`p-6 rounded-2xl border flex flex-col justify-between ${isCurrentlyActive ? "border-orange-500 bg-orange-500/5" : "border-zinc-800 bg-zinc-900/20"}`}>
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{tier.title}</h3>
                  {isCurrentlyActive && <span className="text-xs bg-orange-500 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide animate-pulse">Active</span>}
                </div>
                <p className="text-2xl font-black mt-4 text-orange-400">{tier.cost}</p>
                <p className="text-zinc-500 text-xs mt-1">Limit Capacity: {tier.limit}</p>
              </div>
              
              {!isCurrentlyActive && (
                <Button 
                  size="sm" 
                  onClick={() => handleUpgrade(tier.keyName, tier.keyName === "pro" ? 9.99 : 19.99)}
                  className="w-full mt-6 bg-zinc-900 hover:bg-orange-600 border border-zinc-800 hover:border-orange-500 font-bold text-white rounded-xl transition-colors cursor-pointer"
                >
                  Upgrade via Stripe
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* THUMBNAILS MATRIX GALLERY */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Your Acquired Masterpiece Collection Gallery</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Visual exhibition of high-fidelity canvas layouts you currently own.</p>
        </div>

        {loading ? (
          <div className="p-8 text-zinc-600 text-sm animate-pulse">Mapping collection thumbnail objects...</div>
        ) : purchases.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {purchases.map((art, index) => (
              <Card key={index} className="bg-zinc-950 border border-zinc-900 overflow-hidden rounded-xl group hover:border-zinc-700 transition-all">
                <div className="aspect-square w-full relative bg-zinc-900 overflow-hidden">
                  <img 
                    src={art.image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500"} 
                    alt={art.artworkTitle} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <p className="font-bold text-sm text-white truncate">{art.artworkTitle}</p>
                  <p className="text-xs text-zinc-500">Acquired: {art.date ? new Date(art.date).toLocaleDateString() : "N/A"}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-12 border border-dashed border-zinc-800 bg-zinc-950/20 rounded-2xl text-center text-zinc-600 text-sm">
            No image canvas assets discovered in your collection directory files.
          </div>
        )}
      </div>

      {/* TABLE DATA LIST LEDGER */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Purchase Log Ledger</h2>
        <div className="w-full border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/20 backdrop-blur-md">
          <div className="grid grid-cols-12 bg-zinc-900/80 p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
            <div className="col-span-6">Masterpiece Title</div>
            <div className="col-span-3">Price Paid</div>
            <div className="col-span-3 text-right">Transaction Timestamp</div>
          </div>
          <div className="divide-y divide-zinc-900">
            {purchases.length > 0 ? (
              purchases.map((tx, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 items-center text-sm hover:bg-zinc-900/30 transition-colors">
                  <div className="col-span-6 font-semibold text-white truncate pr-2">{tx.artworkTitle}</div>
                  <div className="col-span-3 text-orange-400 font-bold">${tx.amount}</div>
                  <div className="col-span-3 text-zinc-500 text-xs text-right">
                    {tx.date ? new Date(tx.date).toLocaleDateString() : "N/A"}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-zinc-500 text-sm">No historical purchases listed.</div>
            )}
          </div>
        </div>
      </div>

      {/* SETTINGS CONTROLS */}
      <div className="space-y-4 border-t border-zinc-900 pt-10">
        <div>
          <h2 className="text-xl font-bold">Profile Identity Settings</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Modify workspace operational display parameters and security credentials.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <form onSubmit={handleUpdateName} className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Update Profile Name</h3>
            <Input label="Account Identity Username" value={newName} onChange={(e) => setNewName(e.target.value)} variant="bordered" required />
            <Button type="submit" size="sm" className="bg-orange-500 font-bold text-white rounded-lg">
              Save Identity Name
            </Button>
          </form>

          <form onSubmit={handleUpdatePassword} className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Modify Security Password</h3>
            <Input label="Current Password" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} variant="bordered" required />
            <Input label="New Secure Password" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} variant="bordered" required />
            <Button type="submit" size="sm" className="bg-zinc-900 border border-zinc-800 font-bold text-white rounded-lg">
              Modify Password
            </Button>
          </form>
        </div>
      </div>

    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black text-zinc-400">
        <p className="animate-pulse">Loading dashboard...</p>
      </div>
    }>
      <UserDashboard />
    </Suspense>
  );
}