import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ChevronRight, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';

export default function WishlistView() {
  const { wishlist, toggleWishlist, addToCart, navigateTo, setSelectedCategory } = useApp();

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
  };

  if (wishlist.length === 0) {
    return (
      <div id="wishlist-empty-view" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center pb-24">
        <div className="max-w-md mx-auto bg-neutral-50/50 rounded-3xl border border-dashed border-neutral-200 p-8 sm:p-12 flex flex-col items-center justify-center shadow-inner">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-rose-500/80 mb-6">
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500/10 animate-pulse" />
          </span>
          <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight mb-2">Your Wishlist is Bare</h2>
          <p className="text-sm text-neutral-500 leading-relaxed mb-8">
            Keep track of items you adore! Toggle the heart buttons on cards to store them safely inside this custom dashboard.
          </p>
          <button
            id="wishlist-empty-shop-now"
            onClick={() => { setSelectedCategory(null); navigateTo('shop'); }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 text-sm transition-all shadow-md active:scale-95"
          >
            <span>Browse Products Now</span>
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="wishlist-page-wrapper" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
      
      <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mb-8 flex items-center gap-3">
        <Heart className="h-7 w-7 text-rose-500 fill-rose-550/20" /> Saved Favorites ({wishlist.length})
      </h1>

      {/* Grid listing */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlist.map((product) => {
          const isSale = product.originalPrice ? product.originalPrice > product.price : false;
          return (
            <div
              id={`wishlist-item-card-${product.id}`}
              key={product.id}
              onClick={() => navigateTo('product-details', product.id)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-150 bg-white shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
                />

                {/* Remove button */}
                <button
                  id={`wishlist-remove-${product.id}`}
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-neutral-400 hover:text-rose-500 shadow transition-transform hover:scale-110 active:scale-95 duration-200 z-10"
                  title="Remove from favorites"
                >
                  <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                </button>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{product.category}</span>
                <h3 className="text-sm font-bold text-neutral-800 group-hover:text-emerald-600 transition-colors mt-1 mb-2 leading-tight truncate">
                  {product.name}
                </h3>

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-neutral-50 pt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-neutral-900">${product.price.toFixed(2)}</span>
                    {isSale && (
                      <span className="text-[10px] text-neutral-400 line-through font-mono">${product.originalPrice!.toFixed(2)}</span>
                    )}
                  </div>

                  <button
                    id={`wishlist-add-to-cart-${product.id}`}
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.stock <= 0}
                    className="flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[10px] font-extrabold transition-colors bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                  >
                    <ShoppingCart className="h-3 w-3" />
                    <span>Grab</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        id="wishlist-back-to-catalog"
        onClick={() => { setSelectedCategory(null); navigateTo('shop'); }}
        className="flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors w-fit mt-10"
      >
        <ArrowLeft className="h-4 w-4" /> Continue Browsing Catalog
      </button>

    </div>
  );
}
