"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = () => {
    setLoading(true);
   
    Promise.all([
      fetch("http://localhost:5000/api/admin/analytics").then((res) => res.json()),
      fetch("http://localhost:5000/api/admin/users").then((res) => res.json())
    ])
      .then(([analyticsData, usersData]) => {
        if (analyticsData.success) setAnalytics(analyticsData);
        if (usersData.success) setUsers(usersData.users);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Administrative data linkage stream error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const changeRole = (userId, targetRole) => {
    fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: targetRole })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(`Account permissions successfully updated to ${targetRole}!`);
          fetchAdminData();
        }
      })
      .catch((err) => console.error("Error updating user role:", err));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4 text-zinc-500">
        <div className="w-10 h-10 border-4 border-t-orange-500 border-zinc-800 rounded-full animate-spin" />
        <p className="text-sm font-medium">Syncing Admin Hub Framework Logs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 space-y-12 font-sans">
      
   
      <div>
        <h1 className="text-3xl font-black tracking-tight">System Administrative Hub</h1>
        <p className="text-zinc-500 text-sm mt-1">Platform metric analytics telemetry monitoring and global access controls.</p>
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Verified Buyers", metric: analytics?.analytics?.totalUsers, color: "border-blue-500/20 text-blue-400" },
          { title: "Registered Artists", metric: analytics?.analytics?.totalArtists, color: "border-purple-500/20 text-purple-400" },
          { title: "Artworks Catalogued", metric: analytics?.analytics?.totalArtworksSold, color: "border-emerald-500/20 text-emerald-400" },
          { title: "Platform Gross Revenue", metric: `$${analytics?.analytics?.totalRevenue || 0}`, color: "border-orange-500/20 text-orange-400" },
        ].map((card, idx) => (
          <div key={idx} className={`bg-zinc-900/30 border p-6 rounded-2xl backdrop-blur-md ${card.color}`}>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{card.title}</p>
            <p className="text-3xl font-black mt-2">{card.metric || 0}</p>
          </div>
        ))}
      </div>


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