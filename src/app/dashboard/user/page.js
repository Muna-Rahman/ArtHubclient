"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

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
    <div className="min-h-screen bg-black text-white p-8 space-y-12">
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
            {!tier.active && <Button size="sm" className="w-full mt-4 bg-zinc-800 text-white">Upgrade via Stripe</Button>}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Purchase Log Ledger</h2>
        {loading ? (
          <div className="h-32 bg-zinc-900/50 animate-pulse rounded-2xl" />
        ) : (
          <Table aria-label="Purchase history tracking information panel table" className="text-zinc-300">
            <TableHeader>
              <TableColumn className="bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-800">Masterpiece Title</TableColumn>
              <TableColumn className="bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-800">Price Paid</TableColumn>
              <TableColumn className="bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-800">Transaction Timestamp</TableColumn>
            </TableHeader>
            <TableBody>
              {purchases.map((tx, idx) => (
                <TableRow key={idx} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors">
                  <TableCell className="font-semibold text-white">{tx.artworkTitle}</TableCell>
                  <TableCell className="text-orange-400 font-bold">${tx.amount}</TableCell>
                  <TableCell className="text-zinc-500 text-xs">{new Date(tx.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}