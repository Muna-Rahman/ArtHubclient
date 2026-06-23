"use client";

import React, { useState, useEffect } from "react";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    Promise.all([
      fetch("http://localhost:5000/api/admin/analytics").then(res => res.json()),
      fetch("http://localhost:5000/api/admin/users").then(res => res.json())
    ]).then(([analyticsData, usersData]) => {
      if (analyticsData.success) setAnalytics(analyticsData.analytics);
      if (usersData.success) setUsers(usersData.users);
      setLoading(false);
    });
  }, []);

  const changeRole = (userId, targetRole) => {
    fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: targetRole })
    }).then(() => {
      alert("User access security privileges updated successfully!");
      window.location.reload();
    });
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Syncing Admin Hub Infrastructure Data Streams...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight">System Administrative Core Node</h1>
        <p className="text-zinc-500 text-sm mt-1">Global marketplace analytics monitoring, role allocation, and tracking systems.</p>
      </div>

    
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Buyers Verified", metric: analytics?.totalUsers, color: "text-blue-400" },
          { title: "Active Artists Registered", metric: analytics?.totalArtists, color: "text-purple-400" },
          { title: "Artworks Catalogued & Sold", metric: analytics?.totalArtworksSold, color: "text-emerald-400" },
          { title: "Platform Cumulative Revenue", metric: `$${analytics?.totalRevenue}`, color: "text-orange-400" },
        ].map((card, idx) => (
          <div key={idx} className="bg-zinc-950/60 border border-zinc-900 p-6 rounded-2xl shadow-xl">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">{card.title}</p>
            <p className={`text-3xl font-black mt-2 ${card.color}`}>{card.metric || 0}</p>
          </div>
        ))}
      </div>

    
      <div className="space-y-4">
        <h2 className="text-xl font-bold">User System Account Registry</h2>
        <Table aria-label="Admin global user account registration tracking interface">
          <TableHeader>
            <TableColumn className="bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-800">Profile Name</TableColumn>
            <TableColumn className="bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-800">Email Address Address</TableColumn>
            <TableColumn className="bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-800">Allocated Role Privilege</TableColumn>
            <TableColumn className="bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-800 text-center">Revoke / Reassign Role Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((usr) => (
              <TableRow key={usr._id} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors">
                <TableCell className="font-bold text-white">{usr.name}</TableCell>
                <TableCell className="text-zinc-400">{usr.email}</TableCell>
                <TableCell className="uppercase text-xs tracking-widest font-bold text-orange-400">{usr.role || "user"}</TableCell>
                <TableCell className="flex justify-center gap-2">
                  <Button size="sm" className="bg-zinc-900 text-xs text-zinc-300 rounded-xl" onClick={() => changeRole(usr._id, "user")}>Set User</Button>
                  <Button size="sm" className="bg-zinc-900 text-xs text-amber-500 rounded-xl" onClick={() => changeRole(usr._id, "artist")}>Set Artist</Button>
                  <Button size="sm" className="bg-zinc-900 text-xs text-red-400 rounded-xl" onClick={() => changeRole(usr._id, "admin")}>Set Admin</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}