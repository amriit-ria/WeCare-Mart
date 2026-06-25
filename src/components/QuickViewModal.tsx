import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../types';
import { X, Star, ShoppingCart, Check, Heart, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function QuickViewModal() {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist 
  } = useApp();

  const [activeImage, setActiveImage] = useState(quickViewProduct?.image || '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Synchronize active image with product change
  useEffect(() => {
    if (quickViewProduct) {
      setActiveImage(quickViewProduct.image);
      setQuantity(1);
      setAdded(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isSaved = isInWishlist(product.id);
  const hasDiscount = product.originalPrice ? product.originalPrice > product.price : false;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) 
    : 0;

  const handleAdd = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewProduct(null); // Close modal automatically for neat UX
    }, 1500);
  };

  const handleQtyChange = (val: number) => {
    const newVal = val;
    if (newVal < 1) return;
    if (newVal > product.stock) return;
    setQuantity(newVal);
  };

  return (
    <AnimatePresence>
      <div 
        id="quickview-overlay" 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md overflow-y-auto"
        onClick={() => setQuickViewProduct(null)}
      >
        <motion.div
          id="quickview-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col md:flex-row max-h-[90vh] md:max-h-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Trigger Button */}
          <button
            id="close-quick-view"
            onClick={() => setQuickViewProduct(null)}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100/80 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors backdrop-blur-sm"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Column: Media Stage */}
          <div className="w-full md:w-1/2 bg-neutral-50 p-6 flex flex-col justify-center items-center gap-4">
            <div className="relative aspect-square w-full max-w-[340px] rounded-2xl overflow-hidden bg-white border border-neutral-100 shadow-sm flex items-center justify-center">
              <img
                src={activeImage || undefined}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              {hasDiscount && (
                <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Gallery Selector thumbs */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto max-w-[340px]">
                {product.gallery.map((img, idx) => (
                  <button
                    id={`quick-view-thumb-${idx}`}
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`h-14 w-14 rounded-xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all ${
                      activeImage === img ? 'border-emerald-600 scale-102 ring-2 ring-emerald-500/10' : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <img 
                      src={img || undefined} 
                      alt={`${product.name} thumb ${idx}`} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Buying controls & Description */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2 pr-12">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  {product.category}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-3">
                {product.name}
              </h2>

              {/* Star rating summaries */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-neutral-600 font-mono">
                  {product.rating} / 5.0 ({product.reviewCount} customer reviews)
                </span>
              </div>

              {/* Pricing & Stock section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 bg-neutral-50 p-3 sm:p-4 rounded-2xl border border-neutral-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-neutral-900 font-sans">
                    {formatPrice(product.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-neutral-400 line-through font-mono">
                      {formatPrice(product.originalPrice!)}
                    </span>
                  )}
                </div>

                {/* Highly Prominent Stock Badge */}
                {product.stock > 0 ? (
                  product.stock <= 5 ? (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl animate-pulse flex items-center gap-1.5 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                      Only {product.stock} left!
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-150/50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0 font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {product.stock} Units In Stock
                    </span>
                  )
                ) : (
                  <span className="text-xs font-bold text-neutral-500 bg-neutral-100 border border-neutral-200/50 px-3 py-1.5 rounded-xl shrink-0">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Bio brief */}
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Specs previews */}
              <div className="border-t border-neutral-100 pt-5 mb-6">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Key Details</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  {product.specifications.slice(0, 4).map((spec, i) => (
                    <div key={i} className="flex justify-between border-b border-neutral-50 py-1.5">
                      <span className="text-neutral-500 font-medium">{spec.label}</span>
                      <span className="text-neutral-800 font-semibold text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selector quantity and add buttons */}
            <div className="mt-auto pt-4 border-t border-neutral-100 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Quantity</span>
                <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                  <button
                    id="quickview-qty-decrease"
                    onClick={() => handleQtyChange(quantity - 1)}
                    disabled={product.stock <= 0}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none transition-colors disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-semibold font-mono text-neutral-800">{quantity}</span>
                  <button
                    id="quickview-qty-increase"
                    onClick={() => handleQtyChange(quantity + 1)}
                    disabled={product.stock <= 0}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none transition-colors disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  id="quickview-add-to-cart"
                  onClick={handleAdd}
                  disabled={product.stock <= 0 || added}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold shadow-md transition-all duration-300 ${
                    added
                      ? 'bg-emerald-600 text-white shadow-emerald-605/10'
                      : product.stock <= 0
                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10 hover:shadow-lg'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Item Added To Cart!</span>
                    </>
                  ) : product.stock <= 0 ? (
                    <span>Temporarily Out Of Stock</span>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add To Cart • {formatPrice(product.price * quantity)}</span>
                    </>
                  )}
                </button>

                <button
                  id="quickview-wishlist"
                  onClick={toggleWishlist.bind(null, product)}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${
                    isSaved 
                      ? 'border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100' 
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-500 hover:text-neutral-900'
                  }`}
                  title={isSaved ? "Saved in wish list" : "Add to wish list"}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
