"use client";

export default function ErrorBoundary({ error, reset }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4 text-center font-sans">
      <h2 className="text-xl font-black text-red-500">PlatformHandshake Runtime Error</h2>
      <p className="text-zinc-500 text-sm max-w-md">{error.message || "An unexpected network state dropped out."}</p>
      <button onClick={() => reset()} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600">
        Reset Workspace State
      </button>
    </div>
  );
}