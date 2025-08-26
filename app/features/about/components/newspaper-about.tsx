export function NewspaperAbout() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto py-12">
        <header className="border-b-4 border-black mb-8 pb-4">
          <h1 className="text-6xl font-black text-center tracking-tight">
            COMPANY TIMES
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Est. 2020 • About Our Story
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-black mb-4 border-b-2 border-gray-300 pb-2">
              THE MAIN STORY
            </h2>
            <p className="text-gray-800 leading-relaxed mb-4 text-justify">
              <span className="float-left text-6xl font-bold leading-none pr-2">
                W
              </span>
              e started with a simple idea: technology should work for people,
              not against them. What began as a small team of dreamers has grown
              into a company that serves thousands of clients worldwide.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Our approach combines traditional values with cutting-edge
              innovation, creating solutions that stand the test of time while
              pushing boundaries in their respective fields.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-gray-300 p-4">
              <h3 className="font-bold text-lg mb-2">QUICK FACTS</h3>
              <ul className="text-sm space-y-1">
                <li>• Founded: 2020</li>
                <li>• Employees: 50+</li>
                <li>• Locations: Global</li>
                <li>• Projects: 1000+</li>
              </ul>
            </div>

            <div className="bg-gray-100 p-4">
              <h3 className="font-bold mb-2">BREAKING NEWS</h3>
              <p className="text-sm text-gray-700">
                Company announces record growth and expansion into new markets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
