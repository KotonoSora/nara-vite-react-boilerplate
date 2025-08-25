export function PlayfulAbout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <div className="p-8 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Hey there! 👋
            </h1>
            <p className="text-xl text-gray-700">
              We're the team that makes cool stuff happen ✨
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Creative</h3>
              <p className="text-gray-600">
                We think outside the box, then redesign the box
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Fast</h3>
              <p className="text-gray-600">
                Lightning speed delivery without compromising quality
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Passionate
              </h3>
              <p className="text-gray-600">
                We love what we do, and it shows in our work
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
