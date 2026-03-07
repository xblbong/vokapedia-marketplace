const CATEGORIES = [
  { name: "Semua", count: 20, active: true },
  { name: "Fashion", count: 6 },
  { name: "Aksesori", count: 2 },
  { name: "Kuliner", count: 4 },
  { name: "Interior & Dekor", count: 5 },
  { name: "Jasa Kreatif", count: 6 },
];

export default function FilterSidebar() {
  return (
    <aside className="w-full lg:w-[300px] flex flex-col gap-6">
      {/* Group 1: Program Studi */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <button className="w-full px-6 py-4 flex justify-between items-center bg-[#F1F1F1] font-bold text-[16px]">
          <div className="flex items-center gap-3">
             <span className="text-xl">🎓</span> Program Studi
          </div>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="black" strokeWidth="2"/></svg>
        </button>
        {/* List items Program Studi di sini... */}
      </div>

      {/* Group 2: Kategori */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <div className="px-6 py-4 bg-[#F1F1F1] font-bold text-[16px] flex items-center gap-3 border-b border-gray-200">
           <span className="text-xl">🏷️</span> Kategori
        </div>
        <div className="flex flex-col">
          {CATEGORIES.map((cat, i) => (
            <button 
              key={i} 
              className={`px-6 py-4 flex justify-between text-[14px] transition-all border-l-4 ${
                cat.active ? "border-[#0062FF] bg-blue-50 font-bold text-[#0062FF]" : "border-transparent text-[#8F8F8F] hover:bg-gray-50"
              }`}
            >
              <span>{cat.name} ({cat.count})</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}