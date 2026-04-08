export default function Home() {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 font-sans">
        <div className="bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
            CodeVault
          </h1>
          <p className="text-lg text-slate-300">
            Tailwind v4 is officially online.
          </p>
        </div>
      </div>
  );
}