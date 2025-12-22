function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      {/* 1. Testing standard utilities and rounded corners */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
        
        {/* 2. Testing Text colors and Font weight */}
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Tailwind <span className="text-blue-600">v4</span> Check
        </h1>

        <p className="text-slate-600 leading-relaxed">
          If this box is white, centered, and has a soft shadow, Tailwind is correctly processing your files.
        </p>

        {/* 3. Testing Hover states and Transitions */}
        <button className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg shadow-blue-500/30">
          Interactive Button
        </button>

        {/* 4. Testing Arbitrary values (The "Checkmate" test) */}
        <div className="flex gap-2">
          <div className="h-4 w-full bg-[#38bdf8] rounded-full"></div>
          <div className="h-4 w-full bg-[#818cf8] rounded-full"></div>
          <div className="h-4 w-full bg-[#c084fc] rounded-full"></div>
        </div>

        <p className="text-xs text-center text-slate-400 font-mono">
          Build Status: <span className="text-green-500 animate-pulse">Running</span>
        </p>
      </div>
    </div>
  );
}

export default App
