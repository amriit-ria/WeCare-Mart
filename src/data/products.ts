import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'elec-1',
    name: 'AeroSound Max Pro Headphones',
    price: 229.00,
    originalPrice: 299.00,
    category: 'Electronics',
    subCategory: 'Audio',
    rating: 4.8,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Immersive premium over-ear headphones with custom active noise cancellation and spatial sound tuning.',
    fullDescription: 'Elevate your acoustic experience with AeroSound Max Pro. Designed for exceptional fidelity, the gold-standard dynamic speaker units reproduce frequencies with unparalleled accuracy. Advanced Hybrid Active Noise Cancellation adapts to external environments 48,000 times per second, carving out a sanctuary of pure focus. Crafted with buttery-soft protein leather earcups, lightweight aluminum arms, and an ergonomic tension headband for everlasting comfort.',
    specifications: [
      { label: 'Driver Size', value: '40mm Custom Dynamic' },
      { label: 'Battery Life', value: 'Up to 45 Hours (ANC On)' },
      { label: 'Connectivity', value: 'Bluetooth 5.3 & Ultra-Low Latency Cabled' },
      { label: 'Water Rating', value: 'IPX4 Dust & Splash Resistant' },
      { label: 'Weight', value: '260 grams' }
    ],
    stock: 24,
    isTrending: true
  },
  {
    id: 'elec-2',
    name: 'Horizon V2 GPS Smart Watch',
    price: 189.00,
    category: 'Electronics',
    subCategory: 'Wearables',
    rating: 4.6,
    reviewCount: 95,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Precision multi-sport adventure watch with high-brightness AMOLED screen and advanced biosensors.',
    fullDescription: 'Designed for explorers, athletes, and daily achievers alike. The Horizon V2 sports a brilliant, sunlight-readable AMOLED display housed in an aerospace-grade titanium bezel. Armed with dual-frequency GPS for multi-path correction, it tracks trails meticulously. Complete with full blood oxygen monitoring, multi-zone heart rate zones, and elegant stress-analytics to keep your lifestyle in perfect alignment.',
    specifications: [
      { label: 'Display Type', value: '1.43" AMOLED (Always-On)' },
      { label: 'Materials', value: 'Aerospace Titanium & Sapphire Glass' },
      { label: 'GPS Sync', value: 'L1 + L5 Dual-Band GNSS' },
      { label: 'Battery Mode', value: '12 Days Smart Watch / 24 Hours Active GPS' },
      { label: 'Waterproofing', value: '5 ATM (Up to 50 meters)' }
    ],
    stock: 12,
    isTrending: false
  },
  {
    id: 'elec-3',
    name: 'Sonic Charge Portable Speaker',
    price: 79.00,
    category: 'Electronics',
    subCategory: 'Audio',
    rating: 4.7,
    reviewCount: 68,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Rugged, pocketable wireless speaker with rich 360-degree sound, dual bass radiators, and built-in power bank.',
    fullDescription: 'Wherever the journey leads, carry punchy acoustic dynamics with you. Sonic Charge delivers a breathtaking sonic envelope from its symmetrical transducers. Built with dual custom passive radiators, it creates a physical bass presence that defies its compact silhouette. Also acts as an emergency power bank so you can juice up your devices on the fly.',
    specifications: [
      { label: 'Audio Power', value: '25W RMS Dynamic Sound' },
      { label: 'IP Rating', value: 'IP67 Waterproof & Dustproof' },
      { label: 'Playback Time', value: 'Up to 20 Hours' },
      { label: 'Output Port', value: 'USB-A Power Out (5V/2A)' },
      { label: 'Surround Connect', value: 'Link up to 10 matching speakers' }
    ],
    stock: 35,
    isTrending: true
  },
  {
    id: 'fash-1',
    name: 'Terra Minimalist Leather Backpack',
    price: 115.00,
    category: 'Fashion',
    subCategory: 'Bags',
    rating: 4.9,
    reviewCount: 218,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Sustainably sourced, full-grain water-resistant leather pack featuring structured internal organization.',
    fullDescription: 'Designed for the modern commuter who appreciates clean geometric balance and premium utility. The Terra Backpack is meticulously stitched from ethically harvested vegetable-tanned full-grain leather. Over time, it gains a magnificent, unique patina. Featuring high-density interior dividers, a padded wool-lined 16" laptop sleeve, and an integrated weather-shield zipper array.',
    specifications: [
      { label: 'Material', value: 'Ethically Sourced Full-Grain Leather' },
      { label: 'Device Capacity', value: 'Padded sleeve up to 16" MacBook Pro' },
      { label: 'Dimensions', value: '18" H x 12.5" W x 6" D' },
      { label: 'Volume', value: '20 Liters' },
      { label: 'Zippers', value: 'Genuine YKK Aquaguard Dual Tech' }
    ],
    stock: 8,
    isTrending: true
  },
  {
    id: 'fash-2',
    name: 'UltraFit Knit Running Sneakers',
    price: 89.00,
    originalPrice: 120.00,
    category: 'Fashion',
    subCategory: 'Footwear',
    rating: 4.7,
    reviewCount: 164,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Engineered lightweight knit sneakers with reactive shock-absorbing midsoles and deep grip tread.',
    fullDescription: 'Float through your daily schedule or intense workout runs. The UltraFit Knit features an ultra-breathable, single-knit mesh upper that hugs the foot like a custom glove, expanding naturally with movement. Underneath, our proprietary responsive foam midsole returns structural energy cleanly upon every strike, protecting your joints and propelling your stride.',
    specifications: [
      { label: 'Upper', value: 'Ultra-stretch Recycled PolyKnit (Seamless)' },
      { label: 'Insole', value: 'Ortholite Ergonomic Memory Arch' },
      { label: 'Outsole', value: 'Vulcanized Anti-Slip Flex Rubber' },
      { label: 'Heel Drop', value: '8 mm' },
      { label: 'Breathability', value: 'High Vented Hot-Zones' }
    ],
    stock: 19,
    isTrending: true
  },
  {
    id: 'fash-3',
    name: 'Retro Acetate Round Sunglasses',
    price: 42.00,
    category: 'Fashion',
    subCategory: 'Accessories',
    rating: 4.5,
    reviewCount: 43,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Handcrafted acetate frames with tinted polarized glass offering complete ultraviolet blocking.',
    fullDescription: 'Timeless vintage frames modernized with robust materials. Individually shaped from premium organic wood-pulp bio-acetate, these round frames feel highly premium and sit securely. Fully polarized CR-39 mineral lenses guard against glare off water, asphalt, or glass, rendering vibrant, highly accurate visual depth.',
    specifications: [
      { label: 'Frame', value: 'Hand-Finished Bio-Acetate' },
      { label: 'Lens Tech', value: 'CR-39 Polarized with Hydrophobic coating' },
      { label: 'UV Protection', value: '100% UVA/UVB Guard (UV400)' },
      { label: 'Hinges', value: 'Triple-barrel Reinforced Stainless Steel' },
      { label: 'Fit', value: 'Standard Medium Universal Fit' }
    ],
    stock: 15,
    isTrending: false
  },
  {
    id: 'home-1',
    name: 'Bespoke Ceramic Coffee Dripper Set',
    price: 52.00,
    category: 'Home & Kitchen',
    subCategory: 'Tableware',
    rating: 4.9,
    reviewCount: 110,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Double-walled artisanal ceramic dripper paired with a durable borosilicate glass server carafe.',
    fullDescription: 'For dedicated coffee curators who treat morning coffee as an sacred art form. Designed to maintain continuous water temperature during brewing, the dripper features interior structural spiral ridges designed to optimize water flow rate. Complete with a beautiful, double-lined heat insulated borosilicate server that preserves warmth without scalding countertops.',
    specifications: [
      { label: 'Material', value: 'High-Temperature Stoneware Ceramic' },
      { label: 'Carafe Capacity', value: '550 ml (2-4 Cups)' },
      { label: 'Filter Style', value: 'V60 Conical Style 02' },
      { label: 'Base Plate', value: 'Natural Walnut Wood Tray Included' },
      { label: 'Maintenance', value: 'Dishwasher Safe (Ceramic and Glass Only)' }
    ],
    stock: 5,
    isTrending: true
  },
  {
    id: 'home-2',
    name: 'PureAura Smart Air Purifier',
    price: 149.00,
    originalPrice: 199.00,
    category: 'Home & Kitchen',
    subCategory: 'Appliances',
    rating: 4.8,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Whisper-quiet smart air purifier with a true HEPA H13 4-tier medical-grade filtration mechanism.',
    fullDescription: 'Reclaim clean air inside your domestic coordinates. The PureAura removes 99.97% of airborne spores, dust bunny particles, pollen, pet dander, smoke particles, and household odors. Outfitted with laser infrared particle sensors, it evaluates ambient quality in real-time, instantly dialing fan velocity up or down as needed.',
    specifications: [
      { label: 'Filter Type', value: 'HEPA H13 4-Stage Charcoal Purifier' },
      { label: 'Area Coverage', value: 'Up to 450 sq ft in 15 minutes' },
      { label: 'Acoustics', value: '22dB Sleeping Mode / 50dB Maximum Turbo' },
      { label: 'Power Consumption', value: '30 Watts Core Mode' },
      { label: 'Smart App', value: 'WiFi Enabled / Compatible with iOS & Android' }
    ],
    stock: 14,
    isTrending: false
  },
  {
    id: 'home-3',
    name: 'Luxe Organic Wool Throw Blanket',
    price: 65.00,
    category: 'Home & Kitchen',
    subCategory: 'Bedding',
    rating: 4.7,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528938102132-4a9276b8e320?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Undyed, ultra-soft heirloom throw blanket woven from organic ethically-raised merino wool.',
    fullDescription: 'Wrap yourself in soft natural luxury. Loomed by hand on traditional wooden frames, WeCare Mart throws avoid harsh chemical processing. The breathable, structural knit structures manage warmth by creating microscopic heat-capturing air pockets, ensuring breathable temperature management all season round.',
    specifications: [
      { label: 'Material', value: '100% Certified Organic Merino Wool' },
      { label: 'Dimensions', value: '50" W x 70" L with 3" hand-tied fringe' },
      { label: 'Weight Factor', value: 'Medium-weight comfort (400 GSM)' },
      { label: 'Eco Certifications', value: 'GOTS & Oeko-Tex Standard 100' },
      { label: 'Wash Care', value: 'Dry Clean or Gentle Wool Hand Wash Only' }
    ],
    stock: 18,
    isTrending: false
  },
  {
    id: 'beau-1',
    name: 'Aura Hydrating Facial Serum',
    price: 38.00,
    originalPrice: 48.00,
    category: 'Beauty',
    subCategory: 'Skincare',
    rating: 4.8,
    reviewCount: 232,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Concentrated clean hyaluronic acid skin booster with soothing squalane and task-targeted antioxidants.',
    fullDescription: 'Thirst relief for exhausted skin cells. Aura Hyaluronic Serum delivers deep, sustained hydration directly to dry dermis layers. Enriched with botanical sugarcane-derived squalane, active panthenol, and niacinamide to build the natural skin barrier. Non-greasy, absorption is almost instantaneous, leaving a dewy, resilient, satin canvas.',
    specifications: [
      { label: 'Volume', value: '1.7 fl. oz / 50 ml' },
      { label: 'Core Active Agent', value: 'Multi-Weight Hyaluronic Acid Complex 2.5%' },
      { label: 'Skin Type suitability', value: 'All (Highly recommended for Sensitive Skin)' },
      { label: 'Cruelty Free', value: 'Leaping Bunny Certified Vegan Formula' },
      { label: 'Preservatives', value: 'No Synthetic Colors, Parabens, or Phthalates' }
    ],
    stock: 42,
    isTrending: true
  },
  {
    id: 'beau-2',
    name: 'Citrus & Vetiver Botanical Wash',
    price: 24.00,
    category: 'Beauty',
    subCategory: 'Body Care',
    rating: 4.6,
    reviewCount: 51,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Refreshing organic foaming body wash infused with essential oils and wild chamomile extract.',
    fullDescription: 'Awake the nervous system cleanly. This botanical wash uses non-stripping glucose surfactants to build a robust, soft, dense lather. Infused with cold-pressed Italian blood orange peel and smoky Haitian vetiver roots, it turns your daily shower routines into a refreshing luxury spa experience.',
    specifications: [
      { label: 'Volume', value: '8.4 fl. oz / 250 ml' },
      { label: 'Scent Family', value: 'Crisp Citrus with Woody/Earthy Under-notes' },
      { label: 'Ingredients', value: '98.5% Certified Plant-Derived Sourced' },
      { label: 'Packaging', value: '100% Recyclable PCR Amber Bottle with Pump' },
      { label: 'Lather Agent', value: 'Coco-Glucoside (stripping-free organic foaming)' }
    ],
    stock: 29,
    isTrending: false
  },
  {
    id: 'beau-3',
    name: 'Botanical Scented Soy Candle Set',
    price: 30.00,
    category: 'Beauty',
    subCategory: 'Lifestyle',
    rating: 4.7,
    reviewCount: 39,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Trio of hand-poured wood wick candles: Lavender Hills, French Forest, and Spiced Amber.',
    fullDescription: 'Indulge in olfactory warmth. WeCare Mart clean-burning soy candles use 100% biodegradable soy wax mixed with high-purity natural essential oils. The wooden wicks crackle gently like a miniature hearth, releasing fragrances smoothly and evenly for up to 35 hours per candle.',
    specifications: [
      { label: 'Wax Type', value: '100% Natural Domestic Soy Wax' },
      { label: 'Set Includes', value: '3 x 4 oz Glass Jar Candles' },
      { label: 'Wick Material', value: 'Eco-Sourced Organic Crackling Wood Wick' },
      { label: 'Burn Duration', value: 'Approx. 35 Hours per container' },
      { label: 'Soot emission', value: 'Parlo-wax free / Zero toxic emission' }
    ],
    stock: 20,
    isTrending: false
  },
  {
    id: 'spor-1',
    name: 'FlexElite Anti-Slip Yoga Mat',
    price: 45.00,
    category: 'Sports',
    subCategory: 'Gear',
    rating: 4.8,
    reviewCount: 122,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Eco-friendly biodegradable rubber yoga mat featuring grid lines for dynamic alignment checks.',
    fullDescription: 'No slipping. Perfect balance. The FlexElite honors your practices with absolute stability. Engineered using non-toxic natural tree rubber with a moisture-wicking faux suede surface layer. The laser-etched laser alignment lines help guide hand and feet positions during testing vinyasa flows.',
    specifications: [
      { label: 'Material', value: '100% Pure Natural Tree Rubber Base' },
      { label: 'Thickness', value: '4.5 mm (Dense protective joints cushioning)' },
      { label: 'Dimensions', value: '72" L x 26" W' },
      { label: 'Weight Scale', value: '5.2 lbs / 2.3 kg' },
      { label: 'Carrying Rig', value: 'Includes durable cotton woven travel sling' }
    ],
    stock: 16,
    isTrending: true
  },
  {
    id: 'spor-2',
    name: 'IronGrip Hex Dumbbells Set',
    price: 110.00,
    originalPrice: 140.00,
    category: 'Sports',
    subCategory: 'Strength',
    rating: 4.9,
    reviewCount: 84,
    image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Heavy duty architectural hex dumbbells coated in high-durability impact-protecting neoprene.',
    fullDescription: 'Sculpt muscle with ultimate security. The unique hexagonal flat designs prevent dumbbells rolling across gym floors. Built with solid steel shafts linked to durable weights encased in eco-rubber-neoprene, these prevent damage to ceramic tile or wood surfaces.',
    specifications: [
      { label: 'Set Contents', value: 'Pair of Heavy 15 lb Dumbbells (30 lbs aggregate)' },
      { label: 'Handle Grip', value: 'Knurled, Ergonomic Chrome Finished Steel' },
      { label: 'Outer Shell', value: 'Odorless Premium Vulcanized Rubber' },
      { label: 'Shaft Diameter', value: '28 mm standardized diameter' },
      { label: 'Core Build', value: 'Cast Iron core monolithic structure' }
    ],
    stock: 6,
    isTrending: true
  },
  {
    id: 'spor-3',
    name: 'HydraSteel Insulated Bottle',
    price: 32.00,
    category: 'Sports',
    subCategory: 'Hydration',
    rating: 4.6,
    reviewCount: 71,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Double-wall vacuum-sealed stainless steel bottle keeping liquids cold for 24 hours.',
    fullDescription: 'Sip cold water during extreme summer hikes. Built out of double-lined food-grade 18/8 stainless steel, HydraSteel maintains extreme thermal shields with close-to-zero condensation. Designed with a leak-proof magnetic cap which secures cleanly out of your face during drinking.',
    specifications: [
      { label: 'Holding Capacity', value: '32 oz / 950 ml' },
      { label: 'Steel Standard', value: '18/8 Food Grade Pro-Grade Stainless' },
      { label: 'Temp Guard', value: '24 Hours Frost Cold / 12 Hours Piping Hot' },
      { label: 'Cap Tech', value: 'Leakproof Magnetic Cap with flex ribbon loop' },
      { label: 'Toxins', value: '100% BPA Free, Phthalate Free, BPS Free' }
    ],
    stock: 22,
    isTrending: false
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    userName: 'Elena Rostova',
    rating: 5,
    date: 'June 10, 2026',
    comment: 'Absolutely delighted with WeCare Mart! The headphones have exceptional acoustic depth and block out noisy apartment construction. Arrived in just under 2 days!'
  },
  {
    id: 'rev-2',
    userName: 'David Chen',
    rating: 5,
    date: 'May 28, 2026',
    comment: 'The organic wool throw is soft beyond description. Minimalist, premium undyed material that fits our Scandi-style home. Top tier client service.'
  },
  {
    id: 'rev-3',
    userName: 'Sophia Martinez',
    rating: 4,
    date: 'June 14, 2026',
    comment: 'The Aura facial serum is perfect for sensitive skin. Super fast absorption. Highly recommend and will definitely buy again!'
  }
];
