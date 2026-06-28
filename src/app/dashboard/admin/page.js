"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]); 
  const [allArtworks, setAllArtworks] = useState([]); // 🌟 Added Universal Artwork Catalog State
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    // 🌟 FIX: Dynamic Environment API Injection Rule Mapping
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    try {
      const [analyticsData, usersData, transactionsData, artworksData] = await Promise.all([
        fetch(`${apiBaseUrl}/api/admin/analytics`).then((res) => res.json()),
        fetch(`${apiBaseUrl}/api/admin/users`).then((res) => res.json()),
        fetch(`${apiBaseUrl}/api/admin/transactions`).then((res) => res.json()),
        fetch(`${apiBaseUrl}/api/artworks`).then((res) => res.json()) // 🌟 Fetch universal artwork portfolio
      ]);

      if (analyticsData.success) setAnalytics(analyticsData);
      if (usersData.success) setUsers(usersData.users);
      if (transactionsData.success) setTransactions(transactionsData.transactions);
      if (artworksData.success) setAllArtworks(artworksData.artworks);
    } catch (err) {
      console.error("Administrative data linkage stream error:", err);
      toast.error("Administrative telemetry synchronization stream interrupted.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🌟 FIX: REINFORCED SECURITY ADMIN AUTH GATE LUATION GUARD
    const enforceAdminAuthenticationGuard = async () => {
      try {
        const { authClient } = await import("@/lib/auth-client");
        const activeSession = await authClient.getSession();
        
        if (!activeSession?.data || activeSession?.data?.user?.role !== "admin") {
          toast.error("Access Denied: Administrative credentials missing.");
          window.location.href = "/login";
        } else {
          fetchAdminData();
        }
      } catch (err) {
        console.error("Auth Guard Failure:", err);
        window.location.href = "/login";
      }
    };
    
    enforceAdminAuthenticationGuard();
  }, []);

  const changeRole = (userId, targetRole) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiBaseUrl}/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: targetRole })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // 🌟 FIX: Modernized Toast replacement instead of standard alerts
          toast.success(`Account privileges updated to ${targetRole}!`);
          fetchAdminData();
        }
      })
      .catch((err) => {
        console.error("Error updating user role:", err);
        toast.error("Failed to alter document privilege matrices.");
      });
  };

  // 🌟 FIX: universal admin purge catalog execution action
  const handleAdminPurgeArtwork = (artworkId) => {
    if (!confirm("Are you absolute certain you want to universally delete this composition from the platform catalog?")) return;
    
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiBaseUrl}/api/artworks/${artworkId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Composition successfully purged universally.");
          fetchAdminData();
        }
      })
      .catch((err) => {
        console.error("Error running admin purge macro:", err);
        toast.error("Universal deletion procedure failed.");
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4 text-zinc-500">
        <div className="w-10 h-10 border-4 border-t-orange-500 border-zinc-800 rounded-full animate-spin" />
        <p className="text-sm font-medium">Syncing Admin Hub Framework Logs...</p>
      </div>
    );
  }

  // Map and sort historical transactions timeline nodes to feed into Recharts Area
  const processedChartTimelineDataset = [...transactions]
    .slice(0, 8)
    .reverse()
    .map((tx) => ({
      timestamp: tx.date ? new Date(tx.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Acquisition",
      Revenue: tx.amount || 0,
    }));

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 space-y-12 font-sans">
      
      {/* HEADER ROW */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">System Administrative Hub</h1>
        <p className="text-zinc-500 text-sm mt-1">Platform metric analytics telemetry monitoring and global access controls.</p>
      </div>

      {/* TETELEMETRY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Verified Buyers", metric: analytics?.analytics?.totalUsers, color: "border-blue-500/20 text-blue-400" },
          { title: "Registered Artists", metric: analytics?.analytics?.totalArtists, color: "border-purple-500/20 text-purple-400" },
          { title: "Artworks Sold", metric: analytics?.analytics?.totalArtworksSold, color: "border-emerald-500/20 text-emerald-400" },
          { title: "Platform Gross Revenue", metric: `$${analytics?.analytics?.totalRevenue || 0}`, color: "border-orange-500/20 text-orange-400" },
        ].map((card, idx) => (
          <div key={idx} className={`bg-zinc-900/30 border p-6 rounded-2xl backdrop-blur-md ${card.color}`}>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{card.title}</p>
            <p className="text-3xl font-black mt-2">{card.metric || 0}</p>
          </div>
        ))}
      </div>

      {/* 🌟 FIX: FULL RECHARTS PLATFORM FINANCIAL TIMELINE GRAPH */}
      <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-4">
        <div>
          <h2 className="text-lg font-bold">Platform Revenue Generation Timeline</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Asynchronous metrics charting subscription tier activations and item checkouts.</p>
        </div>
        <div className="w-full h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedChartTimelineDataset}>
              <defs>
                <linearGradient id="adminChartRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
              <XAxis dataKey="timestamp" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "12px", color: "#fff" }} />
              <Area type="monotone" dataKey="Revenue" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#adminChartRevGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🌟 FIX: MANAGE ALL ARTWORKS TABLE MATRIX INDEX */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Global Masterpiece Catalog Index</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Universally inspect and delete active exhibited media canvas entries from repository servers.</p>
        </div>

        <div className="w-full border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/20">
          <div className="grid grid-cols-12 bg-zinc-900/80 p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
            <div className="col-span-4">Artwork Composition</div>
            <div className="col-span-4">Artist Contact Profile</div>
            <div className="col-span-2">Market Valuation</div>
            <div className="col-span-2 text-center">Global Privilege Action</div>
          </div>
          <div className="divide-y divide-zinc-900">
            {allArtworks.length > 0 ? (
              allArtworks.map((art) => (
                <div key={art._id} className="grid grid-cols-12 p-4 text-sm items-center hover:bg-zinc-900/30 transition-colors">
                  <div className="col-span-4 font-bold text-white truncate pr-2">{art.title}</div>
                  <div className="col-span-4 text-zinc-400 font-mono truncate pr-2">{art.artistEmail}</div>
                  <div className="col-span-2 text-orange-400 font-black">${art.price}</div>
                  <div className="col-span-2 text-center">
                    <button 
                      onClick={() => handleAdminPurgeArtwork(art._id)} 
                      className="px-3 py-1 bg-red-950/40 hover:bg-red-950 border border-red-900/30 text-red-400 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Purge
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-zinc-600 text-sm">No catalog items catalogued inside cluster array collection.</div>
            )}
          </div>
        </div>
      </div>

      {/* CATEGORY METRIC MAP project HOOKS */}
      <div className="bg-zinc-900/10 border border-zinc-900 p-6 rounded-2xl space-y-6">
        <div>
          <h2 className="text-lg font-bold">Category Density Chart Overview</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Live visualization of item allocations calculated from MongoDB aggregates.</p>
        </div>
        
        <div className="space-y-4 max-w-2xl">
          {analytics?.categoriesChart && analytics.categoriesChart.length > 0 ? (
            analytics.categoriesChart.map((cat, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold uppercase text-zinc-400 tracking-wider">
                  <span>{cat._id || "Unclassified Medium"}</span>
                  <span className="text-white font-bold">{cat.count} Units</span>
                </div>
                <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min((cat.count / 20) * 100, 100)}%` }} 
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 text-sm italic">Insufficient dataset arrays found to render map projections.</p>
          )}
        </div>
      </div>

      {/* FINANCIAL LEDGER AUDIT MATRIX */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Global Platform Financial Ledger</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Audit track all subscription tier memberships and masterpiece acquisitions across the cluster.</p>
        </div>

        <div className="w-full border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/20">
          <div className="grid grid-cols-12 bg-zinc-900/80 p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
            <div className="col-span-3">Event Type</div>
            <div className="col-span-4">Account Context</div>
            <div className="col-span-2">Amount (USD)</div>
            <div className="col-span-3 text-right">Timestamp</div>
          </div>

          <div className="divide-y divide-zinc-900">
            {transactions.length > 0 ? (
              transactions.map((tx, idx) => {
                const isItemPurchase = tx.type === "purchase" || tx.artworkTitle;
                return (
                  <div key={idx} className="grid grid-cols-12 p-4 items-center text-sm hover:bg-zinc-900/30 transition-colors">
                    <div className="col-span-3">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                        isItemPurchase ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {isItemPurchase ? "Masterpiece Purchase" : "Plan Upgrade"}
                      </span>
                    </div>
                    <div className="col-span-4 text-zinc-300 truncate pr-2">
                      {isItemPurchase ? `${tx.buyerName} ➔ ${tx.artworkTitle}` : tx.userEmail}
                    </div>
                    <div className="col-span-2 font-black text-orange-400">
                      ${tx.amount}
                    </div>
                    <div className="col-span-3 text-zinc-500 text-xs text-right">
                      {tx.date ? new Date(tx.date).toLocaleString() : "N/A"}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-zinc-600 text-sm">No historical platform revenue actions logged.</div>
            )}
          </div>
        </div>
      </div>

      {/* USER ACCOUNT REGISTRY PRIVILEGES CONTROLLER */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">User System Account Registry</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Alter database document access privileges dynamically on demand.</p>
        </div>

        <div className="w-full border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/20">
          <div className="grid grid-cols-12 bg-zinc-900/80 p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
            <div className="col-span-3">Profile Name</div>
            <div className="col-span-4">Email Address</div>
            <div className="col-span-2">Active Privilege</div>
            <div className="col-span-3 text-center">Reassign Role Privilege Matrix Actions</div>
          </div>

          <div className="divide-y divide-zinc-900">
            {users.map((usr) => (
              <div key={usr._id} className="grid grid-cols-12 p-4 items-center text-sm hover:bg-zinc-900/30 transition-colors">
                <div className="col-span-3 font-bold text-white truncate pr-2">{usr.name || "Anonymous"}</div>
                <div className="col-span-4 text-zinc-400 truncate pr-2">{usr.email}</div>
                <div className="col-span-2">
                  <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full uppercase tracking-wider ${
                    usr.role === "admin" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                    usr.role === "artist" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                    "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}>
                    {usr.role || "user"}
                  </span>
                </div>
                <div className="col-span-3 flex justify-center gap-1.5">
                  <button onClick={() => changeRole(usr._id, "user")} className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold rounded-lg border border-zinc-800 transition-colors cursor-pointer">Buyer</button>
                  <button onClick={() => changeRole(usr._id, "artist")} className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-amber-400 rounded-lg border border-zinc-800 transition-colors cursor-pointer">Artist</button>
                  <button onClick={() => changeRole(usr._id, "admin")} className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-red-400 rounded-lg border border-zinc-800 transition-colors cursor-pointer">Admin</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}