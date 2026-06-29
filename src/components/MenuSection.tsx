import React, { useState } from "react";
import { Search, Star, Clock, Flame, Plus, Filter, Sparkles, Heart } from "lucide-react";
import { motion } from "motion/react";
import { MenuItem } from "../types";

interface MenuSectionProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, quantity: number, instructions?: string) => void;
}

export default function MenuSection({ menuItems, onAddToCart }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [popularOnly, setPopularOnly] = useState<boolean>(false);
  const [customInstructions, setCustomInstructions] = useState<{ [key: string]: string }>({});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Categories list
  const categories = ["All", "Starters", "Main Course", "Desserts", "Drinks & Mocktails"];

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || item.isVegetarian;
    const matchesPopular = !popularOnly || item.isPopular;

    return matchesCategory && matchesSearch && matchesVeg && matchesPopular;
  });

  const handleQtyChange = (itemId: string, val: number) => {
    const newQty = Math.max(1, Math.min(10, val));
    setQuantities({ ...quantities, [itemId]: newQty });
  };

  const handleAddClick = (item: MenuItem) => {
    const qty = quantities[item.id] || 1;
    const inst = customInstructions[item.id] || "";
    onAddToCart(item, qty, inst);
    
    // Reset instructions & qty for that item
    setCustomInstructions({ ...customInstructions, [item.id]: "" });
    setQuantities({ ...quantities, [item.id]: 1 });
  };

  return (
    <section id="menu-section" className="py-10 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-12 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.08),transparent)] pointer-events-none" />
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              ROYAL FLAVOURS OF THE EMPIRE
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-slate-100">
              Savor the Taste of <span className="text-amber-500 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">True Royalty</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-md">
              Order fresh gourmet dishes curated by world-class chefs, and get them delivered hot, or pre-order to your table.
            </p>
          </div>
          <div className="w-full md:w-auto flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 max-w-sm">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60" 
                alt="Empire Culinary Special" 
                className="w-full object-cover h-48 md:h-56 filter brightness-95 hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-bold text-amber-400">
                ⭐ Chef's Premium Selection
              </div>
            </div>
          </div>
        </div>

        {/* Search, Filter & Categories Controls */}
        <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-6 mb-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            
            {/* Search Input */}
            <div className="relative flex-grow max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                id="menu-search-input"
                type="text"
                placeholder="Search imperial dishes, starters, mains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-500"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mr-2">
                <Filter className="w-3.5 h-3.5 text-amber-500" />
                FILTERS:
              </span>
              <button
                id="filter-veg-btn"
                onClick={() => setVegOnly(!vegOnly)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                  vegOnly
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${vegOnly ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-600'}`} />
                Pure Veg Only
              </button>
              <button
                id="filter-popular-btn"
                onClick={() => setPopularOnly(!popularOnly)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                  popularOnly
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-lg shadow-amber-500/5"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Popular Hits
              </button>
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {categories.map((category) => (
              <button
                key={category}
                id={`cat-${category.replace(/\s+/g, '-').toLowerCase()}-btn`}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  selectedCategory === category
                    ? "bg-amber-500 text-slate-950 font-extrabold border-amber-500 shadow-xl shadow-amber-500/10"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 border border-slate-900 rounded-3xl">
            <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-300">No Imperial Delicacies Found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              We couldn't find any dishes matching your filters or search terms. Try modifying your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const qty = quantities[item.id] || 1;
              return (
                <motion.div
                  key={item.id}
                  id={`menu-card-${item.id}`}
                  onMouseEnter={() => setHoveredCardId(item.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-amber-500/30 flex flex-col h-full relative"
                >
                  {/* Vegetarian/Non-veg Dot Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/90 backdrop-blur-md rounded-lg border border-slate-800 text-[10px] font-bold">
                    <span className={`w-2 h-2 rounded-full ${item.isVegetarian ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {item.isVegetarian ? "VEG" : "NON-VEG"}
                  </div>

                  {/* Rating / Popular Tag */}
                  {item.isPopular && (
                    <div className="absolute top-4 right-4 z-10 bg-amber-500 text-slate-950 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-lg shadow-md uppercase">
                      ★ POPULAR
                    </div>
                  )}

                  {/* Menu Image */}
                  <div className="relative overflow-hidden h-48 sm:h-52">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                      style={{
                        transform: hoveredCardId === item.id ? "scale(1.08)" : "scale(1)",
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-lg font-black text-amber-500">
                          ₹{item.price}
                        </span>
                      </div>

                      {/* Prep time and Rating Row */}
                      <div className="flex items-center gap-3 mb-3.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-slate-200">{item.rating}</span>
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.prepTime}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Quantity & Instructions Drawer style inside card */}
                    <div className="border-t border-slate-800/60 pt-4 mt-auto space-y-3.5">
                      {/* Special Instructions Input */}
                      <input
                        type="text"
                        placeholder="Any special instructions? (e.g. less spicy)"
                        value={customInstructions[item.id] || ""}
                        onChange={(e) => setCustomInstructions({ ...customInstructions, [item.id]: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 focus:outline-none focus:border-amber-500/50 placeholder:text-slate-600"
                      />

                      {/* Controls Row */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center border border-slate-800 bg-slate-950 rounded-lg p-1">
                          <button
                            onClick={() => handleQtyChange(item.id, qty - 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors text-sm font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-200">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleQtyChange(item.id, qty + 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors text-sm font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          id={`add-to-cart-btn-${item.id}`}
                          onClick={() => handleAddClick(item)}
                          className="flex-grow bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
