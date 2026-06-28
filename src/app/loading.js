export default function GlobalLoadingSpinner() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-t-orange-500 border-zinc-800 rounded-full animate-spin" />
      <p className="text-sm font-semibold tracking-wide text-zinc-500 animate-pulse">Synchronizing ArtHub Assets...</p>
    </div>
  );
}