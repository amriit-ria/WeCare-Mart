import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { SlidersHorizontal, Search, Star, SortAsc, HelpCircle, X } from 'lucide-react';
import ProductCard from './ProductCard';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 15,
    },
  },
};

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating';

export default function ShopView() {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory 
  } = useApp();

  const [maxPrice, setMaxPrice] = useState<number>(250);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports'];

  // Handle entire filter-indexing logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category Match
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }
      // Price Match
      if (product.price > maxPrice) {
        return false;
      }
      // Rating Match
      if (product.rating < minRating) {
        return false;
      }
      // Search Box Match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesSubcat = product.subCategory?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesDesc && !matchesCat && !matchesSubcat) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      // Sort logic
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // 'popular' defaults to descending review volume or custom trends
      return (b.isTrending ? 2 : 1) - (a.isTrending ? 2 : 1) || b.reviewCount - a.reviewCount;
    });
  }, [selectedCategory, maxPrice, minRating, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setMaxPrice(250);
    setMinRating(0);
    setSortBy('popular');
  };

  return (
    <div id="shop-page-wrapper" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
      
      {/* 1. Header with search reporting */}
      <section className="mb-8 border-b border-neutral-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">Catalog Shop</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {searchQuery 
              ? `Search coordinates reporting "${searchQuery}" • ` 
              : selectedCategory 
              ? `${selectedCategory} Collection • ` 
              : 'All Merchandise Collection • '
            } {filteredProducts.length} premium products ready
          </p>
        </div>

        {/* Search refinement bar */}
        <div className="relative w-full max-w-xs md:self-end">
          <input
            id="shop-inline-search"
            type="text"
            placeholder="Type keyword filters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 pl-10 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
          />
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </section>

      {/* 2. Primary layout grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Aspect: Filters section wrapper */}
        <aside className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Mobile Filters Toggle trigger */}
          <button 
            id="mobile-filters-toggle"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between lg:hidden w-full bg-neutral-100 p-3.5 rounded-xl font-bold text-xs text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            <span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Filters & Departments</span>
            <span className="bg-neutral-200 text-neutral-800 px-2.5 py-0.5 rounded-full text-[10px]">{filteredProducts.length} Items</span>
          </button>

          {/* Collapsible Container (Open on large, conditional on small) */}
          <div className={`${showFilters ? 'flex' : 'hidden lg:flex'} flex-col gap-6 border border-neutral-150/60 rounded-2xl p-5 bg-white shadow-sm`}>
            
            {/* Dept Selector */}
            <div className="border-b border-neutral-100 pb-5">
              <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-widest mb-3.5">Department</h3>
              <div className="flex flex-col gap-2">
                <button
                  id="dept-all-merchandise"
                  onClick={() => setSelectedCategory(null)}
                  className={`text-left text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === null 
                      ? 'bg-emerald-50 text-emerald-700 font-extrabold' 
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <span>All Departments</span>
                </button>
                {categories.map((cat) => (
                  <button
                    id={`dept-tile-${cat}`}
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === cat 
                        ? 'bg-emerald-50 text-emerald-700 font-extrabold' 
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Cap selector */}
            <div className="border-b border-neutral-100 pb-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-widest">Price Limit</h3>
                <span className="text-xs font-mono font-bold text-neutral-800">${maxPrice}</span>
              </div>
              <input
                id="price-range-slider"
                type="range"
                min="20"
                max="250"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 font-mono mt-1">
                <span>$20</span>
                <span>$250 max</span>
              </div>
            </div>

            {/* Rating Filter index */}
            <div className="border-b border-neutral-100 pb-5">
              <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-widest mb-3">Customer Rating</h3>
              <div className="flex flex-col gap-2">
                {[0, 4.5, 4.7, 4.8].map((rating) => (
                  <button
                    id={`rating-filter-${rating}`}
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`flex items-center gap-2 text-xs font-semibold py-1.5 px-2 rounded-lg text-left transition-colors ${
                      minRating === rating 
                        ? 'bg-emerald-50 text-emerald-700 font-extrabold' 
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} 
                        />
                      ))}
                    </div>
                    <span>{rating === 0 ? 'All Ratings' : `${rating}+ Stars`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order parameters */}
            <div>
              <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-widest mb-3">Sort Order</h3>
              <select
                id="shop-sort-criteria"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full text-xs rounded-lg border border-neutral-250 p-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="popular">Our Popular Suggestions</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated Collection</option>
              </select>
            </div>

            {/* Reset Filters CTA */}
            <button
              id="reset-filter-cta"
              onClick={handleResetFilters}
              className="w-full py-2 border-2 border-dashed border-neutral-250 text-neutral-500 hover:text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all"
            >
              Clear Filter Set
            </button>
          </div>
        </aside>

        {/* Right Aspect: Catalog Listing Grid */}
        <main className="lg:col-span-9 flex-1">
          {filteredProducts.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div id="no-shop-products" className="py-20 text-center bg-neutral-50/50 rounded-3xl border border-dashed border-neutral-200 p-8 flex flex-col items-center justify-center max-w-lg mx-auto mt-12">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100/80 text-neutral-500 mb-5">
                <HelpCircle className="h-7 w-7 text-neutral-400" />
              </span>
              <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight mb-2">No Matching Products Found</h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                We couldn't locate any products matching your specific combinations of filters, categories, and keyword query.
              </p>
              <button
                id="empty-results-clear-filters"
                onClick={handleResetFilters}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 text-xs transition-colors shadow-sm active:scale-95"
              >
                Restore Standard View
              </button>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
