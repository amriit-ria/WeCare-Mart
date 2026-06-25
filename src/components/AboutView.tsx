import { Activity, ShieldCheck, HeartPulse, Sparkles, Truck, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutView() {
  const values = [
    {
      title: "Unyielding Standards",
      desc: "Every item in our storefront is handpicked and certified to be non-toxic, eco-conscious, and safe for modern families.",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      title: "Wellness Advocacy",
      desc: "We promote wellness as a micro-habit. We design our collection to reduce stress, purify homes, and power clean workouts.",
      icon: HeartPulse,
      color: "text-rose-600 bg-rose-50 border-rose-100"
    },
    {
      title: "Green Deliveries",
      desc: "Carbon-balanced packaging. We minimize plastics and optimize routes to ensure rapid delivery with close-to-zero toxic waste.",
      icon: Truck,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100"
    },
    {
      title: "Vocal Community Support",
      desc: "Our customer success guardians are available 24/7. Your complete health safety and satisfaction represents our core success metric.",
      icon: Users,
      color: "text-sky-600 bg-sky-50 border-sky-100"
    }
  ];

  return (
    <div id="about-page-container" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
      
      {/* 1. Header Banner */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100/60 rounded-full px-3 py-1 text-xs font-bold text-emerald-700 mb-3">
          <Sparkles className="h-3 w-3 fill-emerald-700" />
          <span>Made with Integrity</span>
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 font-sans mb-4">
          Designing a Healthy, Balanced Future
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
          Discover who we are, why we do what we do, and our absolute promise of excellence to our growing community.
        </p>
      </section>

      {/* 2. Brand story + Hero Image Grid */}
      <section className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center mb-24">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-black shadow-sm">
              <Activity className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold uppercase tracking-wider text-neutral-400">The Story of WeCare Mart</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight leading-tight">
            Born from a simple realization: wellness shouldn't feel like a luxury.
          </h2>

          <p className="text-sm text-neutral-600 leading-relaxed">
            Founded in early 2024, WeCare Mart emerged to bridge the gap between premium design, functional strength, and safety. We realized that finding high-quality audio gear, eco-active activewear, non-toxic skincare serums, and organic cotton blankets required hunting through various niche shops.
          </p>

          <p className="text-sm text-neutral-600 leading-relaxed">
            We wanted to consolidate these elements in an elegant, modern platform. By cutting out structural middleman logistics and buying directly from ethical certifiers, WeCare Mart makes it easy to bring health, calmness, and minimalist aesthetic design directly to your screen and doorstep.
          </p>

          <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-6 mt-2">
            <div>
              <p className="text-3xl font-black text-emerald-600 font-mono">100%</p>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mt-1">Non-Toxic Ingredients</p>
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-600 font-mono">48 hr</p>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mt-1">Average US Delivery</p>
            </div>
          </div>
        </div>

        <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-100 shadow-xl group">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=700"
            alt="Artisanal sustainable design products"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-102"
          />
          {/* Subtle gradient overlay to match our aesthetic */}
          <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none mix-blend-multiply" />
        </div>
      </section>

      {/* 3. Mission vs Vision Bento cards */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-24">
        <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 border border-emerald-800 flex flex-col justify-between">
          <div className="mb-8">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Our Core Mission</h3>
            <h4 className="text-2xl sm:text-3xl font-bold tracking-tight font-sans leading-tight">
              To democratize premium, green products to simplify everyday healthy living.
            </h4>
          </div>
          <p className="text-neutral-300 text-sm leading-relaxed">
            We aim to empower every home with curated, beautiful accessories that perform at professional standards while promoting natural carbon balance.
          </p>
        </div>

        <div className="bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200/50 flex flex-col justify-between">
          <div className="mb-8">
            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Our Core Vision</h3>
            <h4 className="text-2xl sm:text-3xl font-bold tracking-tight font-sans leading-tight text-neutral-900">
              Sustaining a circle of pure, zero-harm daily routines for generations.
            </h4>
          </div>
          <p className="text-neutral-500 text-sm leading-relaxed">
            We envision a world where active headphones, organic home linens, physical dumbbells, and facial serums are fully derived from restorative, natural systems.
          </p>
        </div>
      </section>

      {/* 4. Why Choose Us values blocks */}
      <section className="bg-neutral-50 border border-neutral-100 rounded-3xl p-8 sm:p-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight font-sans">
            The Pillars of WeCare Trust
          </h2>
          <p className="text-sm text-neutral-500 mt-2">
            What makes WeCare Mart distinct from classic e-commerce retailers is our uncompromising core values.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((val, idx) => {
            const IconComp = val.icon;
            return (
              <div
                id={`value-pillar-${idx}`}
                key={idx}
                className="bg-white rounded-2xl p-6 border border-neutral-150 shadow-sm flex flex-col gap-4 text-left"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 border ${val.color}`}>
                  <IconComp className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-bold text-neutral-900 leading-tight mb-2">{val.title}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
