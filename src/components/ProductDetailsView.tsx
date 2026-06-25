import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { formatPrice } from '../types';
import { 
  Star, 
  ShoppingCart, 
  Check, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  X, 
  ArrowLeft, 
  ThumbsUp, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LocalReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
}

export default function ProductDetailsView() {
  const { 
    selectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateTo 
  } = useApp();

  const [activeImage, setActiveImage] = useState(selectedProduct?.image || '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  
  // Custom reviews list in state so users can add their own in real-time
  const [reviews, setReviews] = useState<LocalReview[]>([]);

  // Review Form state
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Synchronize on active item load
  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(selectedProduct.image);
      setQuantity(1);
      setAdded(false);
      setReviewSubmitted(false);
      
      // Seed some realistic reviews matching this category
      const categoriesReviewTemplates: Record<string, LocalReview[]> = {
        'Electronics': [
          {
            id: 'el-r1',
            userName: 'Marcus Sterling',
            rating: 5,
            date: 'May 14, 2026',
            comment: 'Stunning performance. Truly gold-standard acoustic levels and noise canceling that blanks out heavy city trains. Battery lasts forever.',
            likes: 12
          },
          {
            id: 'el-r2',
            userName: 'Aria Thompson',
            rating: 4.5,
            date: 'June 02, 2026',
            comment: 'Highly polished build is modern and lightweight. High response connectivity matches perfectly. Only wish the carrying case was a bit more compact.',
            likes: 4
          }
        ],
        'Fashion': [
          {
            id: 'fa-r1',
            userName: 'Julian Vance',
            rating: 5,
            date: 'April 28, 2026',
            comment: 'Exceptional craftsmanship. The leather smells genuine and has starting gaining a gorgeous dark patina. Laptop fits comfortably in its wool wrap.',
            likes: 21
          },
          {
            id: 'fa-r2',
            userName: 'Kaitlyn Mercer',
            rating: 5,
            date: 'May 19, 2026',
            comment: 'Fits true to structural descriptions. Single seamless Knit is extremely breezy. Almost feels like walking on air pods. Highly premium feeling.',
            likes: 8
          }
        ],
        'Home & Kitchen': [
          {
            id: 'ho-r1',
            userName: 'Lars Christensen',
            rating: 5,
            date: 'June 08, 2026',
            comment: 'An aesthetic coffee masterpiece. Stoneware conducts temperatures evenly through drip channels. Looks amazing on Walnut and glass countertops.',
            likes: 14
          },
          {
            id: 'ho-r2',
            userName: 'Sarah Lin',
            rating: 4.5,
            date: 'May 24, 2026',
            comment: 'Smart air filters changed our household quality in days. Quiet sleeping acoustics are completely whisper-tone. Extremely simple wifi sync.',
            likes: 19
          }
        ],
        'Beauty': [
          {
            id: 'be-r1',
            userName: 'Olivia Sterling',
            rating: 5,
            date: 'June 11, 2026',
            comment: 'Incredible skin quenching depth. Dewy satin finishes that stay non-greasy or non-comedogenic. My dry skin patches cleared up after three trials.',
            likes: 31
          },
          {
            id: 'be-r2',
            userName: 'Noel Gallagher',
            rating: 4.5,
            date: 'June 01, 2026',
            comment: 'Washes away impurities without stripped dry spots. German-chamomile leaf smell makes morning hot baths seem like luxury organic spring coordinates.',
            likes: 2
          }
        ],
        'Sports': [
          {
            id: 'sp-r1',
            userName: 'Coach Brandon',
            rating: 5,
            date: 'June 05, 2026',
            comment: 'Perfect active density blocks. Grid align lines are clear and highly functional for maintaining posture coordinates. Truly non-slip rubber.',
            likes: 15
          },
          {
            id: 'sp-r2',
            userName: 'Tessa Brooks',
            rating: 4.8,
            date: 'May 12, 2026',
            comment: 'Dumbbells hexagonal edges protect flooring blocks. High knurl chrome handle grip fits the palms naturally, staying completely slips-free.',
            likes: 7
          }
        ]
      };

      const seedReviews = categoriesReviewTemplates[selectedProduct.category] || [
        {
          id: 'def-r1',
          userName: 'Jamie Watson',
          rating: 5,
          date: 'May 10, 2026',
          comment: 'Outstanding quality and very fast shipping. WeCare Mart is now my default web merchant. Exceeded all core expectations!',
          likes: 3
        }
      ];

      setReviews(seedReviews);
    }
  }, [selectedProduct]);

  if (!selectedProduct) {
    return (
      <div className="py-20 text-center text-sm text-neutral-500">
        No product selected. Please return home or visit the Shop all page.
      </div>
    );
  }

  const product = selectedProduct;
  const isSaved = isInWishlist(product.id);
  const hasDiscount = product.originalPrice ? product.originalPrice > product.price : false;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) 
    : 0;

  const handleQtyChange = (val: number) => {
    if (val < 1 || val > product.stock) return;
    setQuantity(val);
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    navigateTo('checkout');
  };

  // Upvote/like a review
  const handleLikeReview = (id: string) => {
    if (likedReviews.includes(id)) return;
    setLikedReviews(prev => [...prev, id]);
    setReviews(prev => 
      prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r)
    );
  };

  // Add guest review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const now = new Date();
    const dateFormatted = `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    const newlyCreated: LocalReview = {
      id: `custom-r-${Math.random()}`,
      userName: newReview.name,
      rating: newReview.rating,
      date: dateFormatted,
      comment: newReview.comment,
      likes: 0
    };

    setReviews(prev => [newlyCreated, ...prev]);
    setReviewSubmitted(true);
    setNewReview({ name: '', rating: 5, comment: '' });
    
    // Auto clear success notice in 5s
    setTimeout(() => setReviewSubmitted(false), 5000);
  };

  return (
    <div id="pdp-page-wrapper" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24">
      
      {/* 1. Back button navigation path */}
      <button
        id="pdp-back-cta"
        onClick={() => navigateTo('shop')}
        className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-neutral-700 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Complete Catalog
      </button>

      {/* 2. Main details grid layout */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 mb-16">
        
        {/* Left column: gallery */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-150/60 shadow-sm flex items-center justify-center">
            <img
              src={activeImage || undefined}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center transition-all duration-300"
            />
            {hasDiscount && (
              <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1.5 text-xs font-black text-white uppercase shadow">
                Save {discountPercent}%
              </span>
            )}
            {product.isTrending && (
              <span className="absolute left-4 bottom-4 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-black text-white uppercase tracking-wider">
                Certified Best Seller
              </span>
            )}
          </div>

          {/* Sub Gallery thumbs indicator */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1">
              {product.gallery.map((img, i) => (
                <button
                  id={`pdp-thumb-${i}`}
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`h-16 w-16 rounded-xl overflow-hidden border-2 bg-white shrink-0 transition-transform hover:scale-[1.03] ${
                    activeImage === img ? 'border-emerald-600 ring-2 ring-emerald-500/10' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <img src={img || undefined} alt={`${product.name} thumb ${i}`} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: buy details specs */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="font-mono text-xs font-bold text-emerald-600 uppercase tracking-widest">{product.category} {product.subCategory && ` / ${product.subCategory}`}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-none mb-4">{product.name}</h1>

            {/* Star average indicators */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold font-mono text-neutral-700">
                {product.rating} / 5.0 ({reviews.length + product.reviewCount} total buyer reviews)
              </span>
            </div>

            {/* Price tag & Stock dashboard */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-neutral-50 px-4 py-4 rounded-2xl border border-neutral-100">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-neutral-950 font-sans">{formatPrice(product.price)}</span>
                {hasDiscount && (
                  <span className="text-sm sm:text-base text-neutral-400 line-through font-mono">{formatPrice(product.originalPrice!)}</span>
                )}
              </div>

              {/* Highly Prominent Stock Badge */}
              {product.stock > 0 ? (
                product.stock <= 5 ? (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl animate-pulse flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                    Only {product.stock} units left!
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-150/50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0 font-mono self-start sm:self-auto shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {product.stock} Units In Stock
                  </span>
                )
              ) : (
                <span className="text-xs font-bold text-neutral-500 bg-neutral-100 border border-neutral-200/50 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto">
                  Sold Out
                </span>
              )}
            </div>

            {/* Description Copy long form */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Product Overview</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{product.fullDescription}</p>
            </div>

            {/* Spec list tables */}
            <div className="mb-8 border-t border-neutral-100 pt-6">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Complete Specifications</h3>
              <div className="max-w-xl grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between border-b border-neutral-50 py-2 pr-4">
                    <span className="text-neutral-550 font-semibold">{spec.label}</span>
                    <span className="text-neutral-800 font-extrabold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action form buy selectors */}
          <div className="border-t border-neutral-100 pt-6 flex flex-col gap-4">
            
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Quantity</span>
              <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                <button
                  id="pdp-qty-decrease"
                  onClick={() => handleQtyChange(quantity - 1)}
                  disabled={product.stock <= 0}
                  className="px-3.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold font-mono text-neutral-800">{quantity}</span>
                <button
                  id="pdp-qty-increase"
                  onClick={() => handleQtyChange(quantity + 1)}
                  disabled={product.stock <= 0 || quantity >= product.stock}
                  className="px-3.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none transition-colors disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="pdp-add-to-cart"
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || added}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm ${
                  added
                    ? 'bg-emerald-600 text-white shadow-emerald-500/10'
                    : product.stock <= 0
                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-950 hover:border-emerald-300'
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Added To Cart!</span>
                  </>
                ) : product.stock <= 0 ? (
                  <span>Out of stock</span>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>

              <button
                id="pdp-buy-now"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/15 font-bold rounded-xl text-xs transition-colors hover:shadow-lg disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
              >
                Buy Now (Instantly checkout)
              </button>

              <button
                id="pdp-wishlist-toggle"
                onClick={() => toggleWishlist(product)}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all ${
                  isSaved 
                    ? 'border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 shadow-sm' 
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-500 hover:text-neutral-900'
                }`}
                title="Wishlist toggle saves"
              >
                <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-rose-500 text-rose-500 animate-scale-in' : ''}`} />
              </button>
            </div>

            {/* Quick Guarantees bar */}
            <div className="grid grid-cols-3 gap-3 text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-4 text-center">
              <span className="flex flex-col items-center gap-1 bg-neutral-50 rounded-xl p-2.5 border border-dashed border-neutral-100"><Truck className="h-4.5 w-4.5 text-emerald-600" /> Free Shipping</span>
              <span className="flex flex-col items-center gap-1 bg-neutral-50 rounded-xl p-2.5 border border-dashed border-neutral-100"><ShieldCheck className="h-4.5 w-4.5 text-emerald-600" /> Secure Payment</span>
              <span className="flex flex-col items-center gap-1 bg-neutral-50 rounded-xl p-2.5 border border-dashed border-neutral-100"><RotateCcw className="h-4.5 w-4.5 text-emerald-600" /> 30 Day Returns</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Customer Reviews list + Write A Review Form (Craft bonus) */}
      <section id="pdp-reviews-box" className="border-t border-neutral-150 pt-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Left: feedback form */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-neutral-200/60 p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-emerald-600 animate-pulse" /> Write a Review
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                Have you purchased this WeCare {product.category.toLowerCase()} item? Share your wellness journey.
              </p>

              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="review-name" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Your Name</label>
                  <input
                    id="review-name"
                    type="text"
                    required
                    placeholder="E.g., Clara o."
                    value={newReview.name}
                    onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-lg border border-neutral-250 px-3 py-1.5 text-xs outline-none bg-neutral-50/50 focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="review-rating" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Score Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        type="button"
                        id={`input-star-${starValue}`}
                        key={starValue}
                        onClick={() => setNewReview(prev => ({ ...prev, rating: starValue }))}
                        className="p-1 focus:outline-none focus:scale-110 transform transition-transform"
                      >
                        <Star 
                          className={`h-5 w-5 ${
                            newReview.rating >= starValue ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                          }`} 
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-neutral-600 ml-2">{newReview.rating} / 5 Stars</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="review-comment" className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Review Paragraph</label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    required
                    placeholder="What did you think of the acoustic tuning, texture, materials, or durability..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="rounded-lg border border-neutral-250 px-3 py-1.5 text-xs outline-none bg-neutral-50/50 focus:border-emerald-500 focus:bg-white resize-none"
                  />
                </div>

                <AnimatePresence>
                  {reviewSubmitted && (
                    <motion.div
                      id="review-submit-success"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs font-semibold"
                    >
                      ✓ Review logged. Thank you for contributing wellness reports!
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  id="pdp-review-submit"
                  type="submit"
                  className="rounded-xl bg-neutral-900 hover:bg-neutral-800 hover:shadow-md text-white font-bold py-2.5 px-4 text-xs tracking-wider transition-all uppercase mt-2"
                >
                  Publish Review
                </button>
              </form>
            </div>
          </div>

          {/* Right: reviews feed */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h3 className="text-base font-extrabold text-neutral-900 tracking-tight leading-none mb-2 border-b border-neutral-100 pb-3">
              Certified Customer Feedback ({reviews.length})
            </h3>

            <div className="flex flex-col gap-4">
              {reviews.map((rev) => (
                <div
                  id={`review-node-${rev.id}`}
                  key={rev.id}
                  className="p-5 border border-neutral-150 bg-white rounded-2xl shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-xs uppercase leading-none">
                        {rev.userName.charAt(0)}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">{rev.userName}</h4>
                        <div className="flex items-center text-amber-400 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium font-mono">{rev.date}</span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed italic mb-4">
                    "{rev.comment}"
                  </p>

                  <div className="flex justify-between items-center border-t border-neutral-50 pt-3 text-[11px] text-neutral-400 font-semibold tracking-wider">
                    <span className="text-emerald-600 font-bold uppercase text-[10px]">✓ Certified Purchaser</span>
                    
                    <button
                      id={`like-review-${rev.id}`}
                      onClick={() => handleLikeReview(rev.id)}
                      disabled={likedReviews.includes(rev.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-150 transition-colors ${
                        likedReviews.includes(rev.id) ? 'text-emerald-600 bg-emerald-50 border-emerald-100 cursor-default' : ''
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-600" />
                      <span>{rev.likes} Helpfulness Marks</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
