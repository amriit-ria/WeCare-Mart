import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, MOCK_REVIEWS } from '../data/products';
import { 
  Heart, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Laptop, 
  Shirt, 
  Home as HomeIcon, 
  Flame, 
  Sparkle, 
  Dumbbell, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  BadgePercent
} from 'lucide-react';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

const HERO_PROMOS = [
  {
    title: "Eco-Pure Living",
    subtitle: "Modernist Home Appliances",
    desc: "Breathe, filter, and curate your personal dwelling with 20% off our PureAura Smart clean air collection.",
    cta: "Shop Clean Living",
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=650",
    color: "bg-emerald-950",
    badge: "Limited Saving Offer",
    categoryTab: "Home & Kitchen"
  },
  {
    title: "Symphonic Focus",
    subtitle: "Premium Acoustics",
    desc: "Immerse your ears in the AeroSound Max Pro array. Gold-standard gold-tuned Active Noise Cancellation.",
    cta: "Explore Premium Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=650",
    color: "bg-neutral-900",
    badge: "Hot Bestseller",
    categoryTab: "Electronics"
  },
  {
    title: "Organic Balance",
    subtitle: "Active Wellness Gear",
    desc: "Step onto natural materials. Fully biodegradable anti-slip tree rubber mats now available for your flow.",
    cta: "Improve Your Practice",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=650",
    color: "bg-sky-950",
    badge: "Eco-Friendly Selection",
    categoryTab: "Sports"
  }
];

export default function HomeView() {
  const { navigateTo, setSelectedCategory, searchQuery, setSearchQuery } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance slides periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(idx => (idx + 1) % HERO_PROMOS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide(idx => (idx + 1) % HERO_PROMOS.length);
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide(idx => (idx - 1 + HERO_PROMOS.length) % HERO_PROMOS.length);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    navigateTo('shop');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('shop');
  };

  const trendingProducts = PRODUCTS.filter(p => p.isTrending);

  const categoryCards = [
    { name: 'Electronics', icon: Laptop, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { name: 'Fashion', icon: Shirt, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { name: 'Home & Kitchen', icon: HomeIcon, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { name: 'Beauty', icon: Sparkle, color: 'text-rose-600 bg-rose-50 border-rose-100' },
    { name: 'Sports', icon: Dumbbell, color: 'text-sky-600 bg-sky-50 border-sky-100' },
  ];

  return (
    <div id="home-view-container" className="flex flex-col gap-12 sm:gap-16 pb-16">
      
      {/* 1. Hero Promo section */}
      <section id="hero-slider" className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative h-[480px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-xl border border-neutral-100 flex flex-col md:flex-row">
          
          {/* Slide backgrounds */}
          <div className={`absolute inset-0 -z-10 ${HERO_PROMOS[activeSlide].color} transition-all duration-700`} />
          
          {/* Info Side */}
          <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-white relative z-10 bg-gradient-to-r from-black/50 via-black/25 to-transparent h-full">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 w-fit mb-4 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{HERO_PROMOS[activeSlide].badge}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2 font-sans">
              {HERO_PROMOS[activeSlide].title}
            </h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-emerald-400 font-sans mb-4">
              {HERO_PROMOS[activeSlide].subtitle}
            </h2>
            <p className="text-neutral-200 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
              {HERO_PROMOS[activeSlide].desc}
            </p>

            <button
              id={`hero-cta-btn-${activeSlide}`}
              onClick={() => {
                setSelectedCategory(HERO_PROMOS[activeSlide].categoryTab);
                navigateTo('shop');
              }}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 text-sm tracking-wide shadow-md transition-all duration-200 w-fit self-start active:scale-95 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              <span>{HERO_PROMOS[activeSlide].cta}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Graphic Side */}
          <div className="hidden md:block md:w-1/2 relative h-full">
            <img
              src={HERO_PROMOS[activeSlide].image}
              alt={HERO_PROMOS[activeSlide].title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center transform transition-transform duration-1000 scale-102"
            />
            {/* Soft geometric mask */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/45 to-transparent pointer-events-none" />
          </div>

          {/* Navigation Arrows */}
          <button
            id="hero-prev-slide"
            onClick={handlePrevSlide}
            className="absolute left-4 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 border border-white/10 hover:bg-white text-white hover:text-neutral-950 transition-all z-20 backdrop-blur-sm"
            aria-label="Previous Promo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            id="hero-next-slide"
            onClick={handleNextSlide}
            className="absolute right-4 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 border border-white/10 hover:bg-white text-white hover:text-neutral-950 transition-all z-20 backdrop-blur-sm"
            aria-label="Next Promo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {HERO_PROMOS.map((_, idx) => (
              <button
                id={`hero-dot-${idx}`}
                key={idx}
                onClick={(e) => { e.stopPropagation(); setActiveSlide(idx); }}
                className={`h-2 transition-all rounded-full ${
                  activeSlide === idx ? 'w-6 bg-emerald-500' : 'w-2 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Brand Promo Ribbon */}
      <section id="promo-banner" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-6">
        <div className="bg-emerald-50 border border-emerald-100/60 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-emerald-800 text-center md:text-left flex-col md:flex-row">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <BadgePercent className="h-7 w-7" />
            </span>
            <div>
              <h3 className="font-extrabold text-lg">Grand Opening Promo Code</h3>
              <p className="text-sm text-emerald-700 mt-0.5">Apply code <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold text-xs">WECARE10</span> during checkout for an instant 10% discount on all items.</p>
            </div>
          </div>
          <button 
            id="promo-apply-cta"
            onClick={() => { setSelectedCategory(null); navigateTo('shop'); }}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-bold shadow-sm transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <span>Activate Offer</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* 3. Search Bar for Products */}
      <section id="search-section" className="mx-auto w-full max-w-2xl px-4 sm:px-6">
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-sans tracking-tight">Need something specific?</h2>
          <p className="text-sm text-neutral-500 mt-1">Search through our ethically certified premium inventory.</p>
        </div>
        <form onSubmit={handleSearchSubmit} className="relative shadow-md shadow-neutral-100/70 rounded-2xl">
          <input
            id="home-search-input"
            type="text"
            placeholder="Type speaker, headphones, skin, body wash, organic blank..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm rounded-2xl border border-neutral-200/80 bg-white px-6 py-4 pl-12 pr-28 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-sans"
          />
          <Search className="absolute left-4.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <button
            id="home-search-submit"
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-xs transition-colors shadow-sm"
          >
            Find Products
          </button>
        </form>
      </section>

      {/* 4. Departments / Categories Section */}
      <section id="departments-section" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-neutral-100 pb-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Shop by Departments</h2>
            <p className="text-sm text-neutral-500 mt-1">Sustainably sourced and meticulously tested merchandise.</p>
          </div>
          <button 
            id="departments-view-all"
            onClick={() => { setSelectedCategory(null); navigateTo('shop'); }}
            className="text-emerald-600 hover:text-emerald-700 font-bold text-sm flex items-center gap-0.5 hover:underline"
          >
            <span>See Catalog</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categoryCards.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <button
                id={`category-tile-${cat.name}`}
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border border-neutral-100 bg-white shadow-sm hover:shadow-md hover:border-neutral-200 transition-all duration-200 group text-center"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110 shadow-sm border ${cat.color}`}>
                  <IconComponent className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-neutral-800 group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Trending / Best-selling Products Section */}
      <section id="trending-section" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-neutral-100 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Flame className="h-4.5 w-4.5 fill-emerald-600" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Best-Selling Trends</h2>
              <p className="text-sm text-neutral-500 mt-1">Loved by thousands, optimized for lifetime performance.</p>
            </div>
          </div>
          <button 
            id="trending-view-all"
            onClick={() => { setSelectedCategory(null); navigateTo('shop'); }}
            className="text-emerald-600 hover:text-emerald-700 font-bold text-sm flex items-center gap-0.5 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {trendingProducts.slice(0, 4).map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 6. Customer Reviews section */}
      <section id="reviews-section" className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight font-sans">
              Echoes of Customer Satisfaction
            </h2>
            <p className="text-sm text-neutral-500 mt-2 max-w-md mx-auto">
              Real reviews from real buyers sharing their healthy living transformations with WeCare Mart.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {MOCK_REVIEWS.map((review) => (
              <div
                id={`customer-testimonial-${review.id}`}
                key={review.id}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-200/40 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-4 text-amber-400">
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  
                  <p className="text-sm text-neutral-600 leading-relaxed italic mb-6">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-50 pt-4 mt-auto">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-extrabold text-xs">
                      {review.userName.charAt(0)}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-800">{review.userName}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mt-0.5">
                        <CheckCircle2 className="h-3 w-3" /> Certified Buyer
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-medium font-mono">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
