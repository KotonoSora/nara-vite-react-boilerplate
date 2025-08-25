export function TechAbout() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono">
      <div className="p-8 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="text-green-500 mb-2">$ cat about.txt</div>
            <h1 className="text-4xl font-bold mb-4">{">"} ABOUT_US.init()</h1>
            <div className="bg-black/50 rounded p-6 border border-green-500">
              <p className="text-green-300 leading-relaxed">
                // We are a collective of hackers, builders, and dreamers
                <br />
                // Crafting digital experiences that push the envelope
                <br />
                // Status: Currently accepting new challenges
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="border-l-2 border-green-500 pl-4">
              <h2 className="text-xl font-bold text-green-400 mb-2">
                function ourMission() {"{"}
              </h2>
              <p className="text-green-300 ml-4 mb-2">
                return "Building the future, one commit at a time";
              </p>
              <div className="text-green-400">{"}"}</div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-black/30 rounded border border-green-500/30 p-4">
                <div className="text-green-500 font-bold mb-2">
                  stack.tech[]
                </div>
                <ul className="text-green-300 text-sm space-y-1">
                  <li>• React.js / Next.js</li>
                  <li>• Node.js / Python</li>
                  <li>• AWS / Docker</li>
                  <li>• AI/ML Integration</li>
                </ul>
              </div>

              <div className="bg-black/30 rounded border border-green-500/30 p-4">
                <div className="text-green-500 font-bold mb-2">
                  team.values[]
                </div>
                <ul className="text-green-300 text-sm space-y-1">
                  <li>• Open Source Mindset</li>
                  <li>• Continuous Learning</li>
                  <li>• Clean Code Obsession</li>
                  <li>• User-First Thinking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
