import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4 text-center font-sans">
      <h1 className="text-6xl font-black text-orange-500">404</h1>
      <h2 className="text-xl font-bold">Masterpiece Path Missing</h2>
      <p className="text-zinc-500 text-sm max-w-sm">The requested URL cannot be resolved from platform clusters.</p>
      <Link href="/browse" className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-white hover:bg-zinc-800 transition-colors">
        Return to Catalog
      </Link>
    </div>
  );
}