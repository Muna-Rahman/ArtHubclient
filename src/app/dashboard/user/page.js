"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";

export default function UserDashboard() {
  const mockUserEmail = "buyer@example.com"; 
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/user/purchases?email=${mockUserEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPurchases(data.history);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-12 font-sans">
      <div>
        <h1 className="text-3xl font-black tracking-tight">User Operations Command</h1>
        <p className="text-zinc-500 text-sm mt-1">Manage acquired artworks, view tier subscriptions, and modify configurations.</p>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Free (Default)", limit: "3 Paintings", cost: "$0", active: true },
          { title: "Pro Upgrade", limit: "9 Paintings", cost: "$9.99/mo", active: false },
          { title: "Premium VIP", limit: "Unlimited Paintings", cost: "$19.99/mo", active: false },
        ].map((tier, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${tier.active ? "border-orange-500 bg-orange-500/5" : "border-zinc-800 bg-zinc-900/20"}`}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">{tier.title}</h3>
              {tier.active && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">Active</span>}
            </div>
            <p className="text-2xl font-black mt-4 text-orange-400">{tier.cost}</p>
            <p className="text-zinc-500 text-xs mt-1">Limit Capacity: {tier.limit}</p>
            {!tier.active && <Button size="sm" className="w-full mt-4 bg-zinc-800 text-white rounded-xl">Upgrade via Stripe</Button>}
          </div>
        ))}
      </div>

     
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Purchase Log Ledger</h2>
        
        <div className="w-full border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/20 backdrop-blur-md">
          {/* Table Header Row Layout */}
          <div className="grid grid-cols-12 bg-zinc-900/80 p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
            <div className="col-span-6">Masterpiece Title</div>
            <div className="col-span-3">Price Paid</div>
            <div className="col-span-3 text-right">Transaction Timestamp</div>
          </div>

         
          {loading ? (
            <div className="p-8 text-center text-zinc-500 text-sm animate-pulse">Syncing user ledger transactions...</div>
          ) : purchases.length > 0 ? (
            <div className="divide-y divide-zinc-900">
              {purchases.map((tx, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 items-center text-sm hover:bg-zinc-900/30 transition-colors">
                  <div className="col-span-6 font-semibold text-white truncate pr-2">{tx.artworkTitle}</div>
                  <div className="col-span-3 text-orange-400 font-bold">${tx.amount}</div>
                  <div className="col-span-3 text-zinc-500 text-xs text-right">{new Date(tx.date).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 text-sm">No acquired masterpieces found in your collection history log.</div>
          )}
        </div>
      </div>
    </div>
  );
}