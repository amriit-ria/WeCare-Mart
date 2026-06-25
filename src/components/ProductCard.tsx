import React, { useState } from 'react';
import { Product, formatPrice } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Heart, Eye, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateTo, 
    setQuickViewProduct 
  } = useApp();

  const [addedTemp, setAddedTemp] = useState(false);
  const isSaved = isInWishlist(product.id);
  const hasDiscount = product.originalPrice ? product.originalPrice > product.price : false;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setAddedTemp(true);
    setTimeout(() => setAddedTemp(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleCardClick = () => {
    navigateTo('product-details', product.id);
  };

  // Star rating builder
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <div key={i} className="relative inline-block">
            <Star className="h-3.5 w-3.5 text-neutral-300" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="h-3.5 w-3.5 text-neutral-300" />);
      }
    }
    return stars;
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-neutral-200 hover:shadow-lg hover:shadow-neutral-100/60 cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Promo Tags / Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
          {hasDiscount && (
            <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-sm">
              Save {discountPercent}%
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-sm">
              Only {product.stock} Left!
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-full bg-neutral-600 px-2.5 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-sm">
              Sold Out
            </span>
          )}
          {product.isTrending && (
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Action Button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={handleWishlist}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 text-neutral-500 hover:text-rose-500 z-10"
          aria-label="Toggle saves in Wishlist"
        >
          <Heart 
            className={`h-4 w-4 transition-all ${
              isSaved ? 'fill-rose-500 text-rose-500 scale-110' : 'text-neutral-600 group-hover/btn:text-rose-500'
            }`} 
          />
        </button>

        {/* Floating Quick Action Overlay (Desktop Only) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            id={`quick-view-${product.id}`}
            onClick={handleQuickView}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-neutral-800 hover:text-emerald-600 hover:bg-emerald-50 hover:scale-110 active:scale-95 transition-all duration-200"
            title="Quick View Product"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info details panel */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1.5 block">
          {product.category}
        </span>
        
        <h3 className="line-clamp-1 text-sm font-semibold text-neutral-800 group-hover:text-emerald-600 transition-colors mb-1.5">
          {product.name}
        </h3>

        {/* Star Rating Reviews lines */}
        <div className="flex items-center gap-1.5 mb-3.5">
          <div className="flex items-center font-mono">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-neutral-50 pt-3.5">
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-neutral-950 font-sans">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through font-mono leading-none mt-0.5">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>

          <button
            id={`add-to-cart-card-${product.id}`}
            disabled={product.stock <= 0}
            onClick={handleAddToCart}
            className={`flex h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 text-xs font-bold transition-all duration-300 shadow-sm ${
              addedTemp
                ? 'bg-emerald-600 text-white shadow-emerald-600/10'
                : product.stock <= 0
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200/50'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:shadow-emerald-600/10'
            }`}
          >
            {addedTemp ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : product.stock <= 0 ? (
              <span>Out of stock</span>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
