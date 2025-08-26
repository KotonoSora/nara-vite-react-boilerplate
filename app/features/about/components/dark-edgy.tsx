export function DarkAbout() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto py-20">
        <h1 className="text-6xl font-black mb-8">
          WE ARE <span className="text-red-500">DIFFERENT</span>
        </h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              We don't follow trends. We create them.
            </p>
            <p className="text-gray-400">
              Disrupting industries since day one with bold ideas and fearless
              execution.
            </p>
          </div>
          <div className="border-l border-red-500 pl-6">
            <h2 className="text-2xl font-bold mb-4">Our Philosophy</h2>
            <p className="text-gray-300">
              Break things. Build better things. Repeat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
