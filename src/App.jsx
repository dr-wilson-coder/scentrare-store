import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as THREE from "three";
import {
  ShoppingBag, X, Menu, Search, Heart, Star, Truck, Package,
  CheckCircle2, Mail, Phone, MapPin, ChevronRight, ChevronDown,
  Plus, Minus, CreditCard, Smartphone, Banknote, Sparkles, Clock,
  Gift, ArrowRight, Instagram, Facebook, ArrowUpRight, ShieldCheck,
} from "lucide-react";

/* ============================== THEME ==============================
   Subject: an Accra-based perfume house selling Arabian/niche
   fragrances â€” oud, amber, florals, woods â€” plus in-house oils.
   Palette pulls from the materials themselves: oud wood, amber
   resin, aged brass â€” not a generic "luxury" template.
======================================================================*/
const INK = "#15100C";        // oud-wood black-brown, base background
const INK_2 = "#1E1611";      // raised panel
const INK_3 = "#2A1F17";      // card/border
const PARCH = "#F1E7D6";      // parchment text
const PARCH_DIM = "#B9AA96";  // dimmed body text
const GOLD = "#C79A4B";       // aged brass accent
const GOLD_BRIGHT = "#E3B96A";
const GREEN = "#2F4A3A";      // deep bottle-glass green, secondary accent
const GREEN_BRIGHT = "#4A7059";
const WINE = "#7C2F2F";       // oxblood, used sparingly for urgency/CTA
const LINE = "rgba(199,154,75,0.18)";
const LINE_GREEN = "rgba(74,112,89,0.3)";

const DISPLAY_FONT = "'Fraunces', serif";
const BODY_FONT = "'Inter', sans-serif";
const MONO_FONT = "'IBM Plex Mono', monospace";

const fmt = (n) =>
  "GHâ‚µ" + Number(n).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ============================== DATA ============================== */
const COLLECTIONS = [
  { id: "oud", name: "Oud", tag: "Deep. Resinous. Worn like a signature.", hue: "#6B3A1F" },
  { id: "floral", name: "Floral", tag: "Petals held in amber light.", hue: "#C97C93" },
  { id: "amber", name: "Amber", tag: "Warm resin, gold dust.", hue: "#C9922E" },
  { id: "woody", name: "Woody", tag: "Cedar, sandalwood, root.", hue: "#6B7A4F" },
  { id: "musk", name: "Musk", tag: "Skin-close and quiet.", hue: "#A98F76" },
  { id: "citrus", name: "Citrus", tag: "Bright first, warm after.", hue: "#C7A93A" },
];

/* Placeholder stock photography (Unsplash License â€” free for commercial use,
   no attribution required). Swap any of these for real product photos by
   setting an `image` field on a product in PRODUCTS below â€” that always
   takes priority over this pool. */
const STOCK_PHOTOS = {
  oud: "https://images.unsplash.com/photo-1598634222670-87c5f558119c?auto=format&fit=crop&w=600&q=70",
  woody: "https://images.unsplash.com/photo-1598634222670-87c5f558119c?auto=format&fit=crop&w=600&q=70",
  floral: "https://images.unsplash.com/photo-1708265500552-c256df13d3ca?auto=format&fit=crop&w=600&q=70",
  amber: "https://images.unsplash.com/photo-1543422655-ac1c6ca993ed?auto=format&fit=crop&w=600&q=70",
  musk: "https://images.unsplash.com/photo-1609749282774-5883a366cdd1?auto=format&fit=crop&w=600&q=70",
  citrus: "https://images.unsplash.com/photo-1609749282774-5883a366cdd1?auto=format&fit=crop&w=600&q=70",
};

const BRANDS = [
  { id: "lattafa", name: "Lattafa", origin: "U.A.E.", blurb: "Bold orientals, honest prices, cult following." },
  { id: "arabianoud", name: "Arabian Oud", origin: "Saudi Arabia", blurb: "The house that built modern oud culture." },
  { id: "amouage", name: "Amouage", origin: "Oman", blurb: "Rare naturals, royal lineage, uncompromising." },
  { id: "ajmal", name: "Ajmal", origin: "U.A.E.", blurb: "Century-old perfumers, concentrated attars." },
  { id: "swissarabian", name: "Swiss Arabian", origin: "U.A.E.", blurb: "Precision blending, built for layering." },
  { id: "houseoils", name: "Perfume Wura Oils", origin: "House label", blurb: "Alcohol-free roll-on oils, made in-house." },
];

const PRODUCTS = [
  { id: "p1", name: "Yara", brand: "lattafa", collection: "floral", price: 285, size: "100ml EDP", rating: 4.8, reviews: 214, badge: "Bestseller", top: "Bergamot, Pear", heart: "Vanilla Orchid", base: "Sandalwood, Musk" },
  { id: "p2", name: "Asad", brand: "lattafa", collection: "woody", price: 260, size: "100ml EDP", rating: 4.6, reviews: 132, top: "Cardamom, Saffron", heart: "Oud, Rose", base: "Amberwood" },
  { id: "p3", name: "Khamrah", brand: "lattafa", collection: "amber", price: 300, size: "100ml EDP", rating: 4.9, reviews: 301, badge: "Bestseller", top: "Cinnamon, Date", heart: "Praline, Tobacco", base: "Amber, Musk" },
  { id: "p4", name: "Fakhar", brand: "lattafa", collection: "citrus", price: 270, size: "100ml EDP", rating: 4.5, reviews: 98, top: "Bergamot, Apple", heart: "Lavender", base: "Oakmoss, Musk" },
  { id: "p5", name: "Kalemat", brand: "arabianoud", collection: "oud", price: 890, size: "100ml EDP", rating: 4.9, reviews: 176, badge: "Signature", top: "Saffron, Rose", heart: "Cambodian Oud", base: "Amber, Musk" },
  { id: "p6", name: "Layali Al Sahar", brand: "arabianoud", collection: "amber", price: 760, size: "75ml EDP", rating: 4.7, reviews: 89, top: "Bergamot", heart: "Amber, Jasmine", base: "Vanilla, Musk" },
  { id: "p7", name: "Yaqoot", brand: "arabianoud", collection: "citrus", price: 650, size: "75ml EDP", rating: 4.6, reviews: 61, top: "Mandarin, Neroli", heart: "Jasmine", base: "Cedar, Musk" },
  { id: "p8", name: "Interlude Man", brand: "amouage", collection: "woody", price: 1850, size: "100ml EDP", rating: 5.0, reviews: 44, badge: "Rare", top: "Oregano, Pepper", heart: "Frankincense", base: "Oud, Papyrus" },
  { id: "p9", name: "Reflection Woman", brand: "amouage", collection: "floral", price: 1780, size: "100ml EDP", rating: 4.9, reviews: 38, badge: "Rare", top: "Lily, Mimosa", heart: "Jasmine, Rose", base: "Musk, Oakmoss" },
  { id: "p10", name: "Mukhallat Malaki", brand: "ajmal", collection: "oud", price: 420, size: "12ml Attar Oil", rating: 4.7, reviews: 122, badge: "Oil", top: "Rose", heart: "Deep Oud", base: "Musk, Amber" },
  { id: "p11", name: "Wisal", brand: "ajmal", collection: "amber", price: 380, size: "75ml EDP", rating: 4.5, reviews: 67, top: "Saffron", heart: "Amber, Oud", base: "Vanilla" },
  { id: "p12", name: "Amber Wood", brand: "ajmal", collection: "woody", price: 400, size: "50ml EDP", rating: 4.4, reviews: 53, top: "Bergamot", heart: "Cedar", base: "Amber, Vetiver" },
  { id: "p13", name: "Shaghaf Oud", brand: "swissarabian", collection: "oud", price: 510, size: "100ml EDP", rating: 4.6, reviews: 71, top: "Saffron, Rose", heart: "Oud", base: "Amber, Leather" },
  { id: "p14", name: "Layali Rashid", brand: "swissarabian", collection: "amber", price: 340, size: "100ml EDP", rating: 4.4, reviews: 49, top: "Citrus", heart: "Amber, Floral", base: "Musk" },
  { id: "p15", name: "Musk Al Tahara Oil", brand: "houseoils", collection: "musk", price: 150, size: "12ml Roll-on Oil", rating: 4.8, reviews: 156, badge: "Oil", top: "Clean Musk", heart: "White Florals", base: "Soft Amber" },
  { id: "p16", name: "Amber Oud Oil", brand: "houseoils", collection: "oud", price: 170, size: "12ml Roll-on Oil", rating: 4.7, reviews: 140, badge: "Oil", top: "Smoked Oud", heart: "Amber", base: "Vanilla, Musk" },
];

const COMBOS = [
  { id: "c1", name: "Oud Discovery Duo", items: ["p5", "p16"], save: 170, hours: 46, blurb: "The house signature oud, paired with our own oud oil for layering." },
  { id: "c2", name: "His & Hers Set", items: ["p2", "p1"], save: 85, hours: 70, blurb: "Asad for him, Yara for her â€” Lattafa's two most-loved bottles." },
  { id: "c3", name: "Oils Starter Kit", items: ["p15", "p16", "p10"], save: 111, hours: 118, blurb: "Three roll-on oils to try before you commit to a full bottle." },
];

const SEED_REVIEWS = [
  { id: "r1", name: "Akosua B.", rating: 5, text: "Khamrah lasted through a full day at the office and into dinner. Ordered two more bottles for gifting.", ts: Date.now() - 1000 * 60 * 60 * 24 * 3 },
  { id: "r2", name: "Kwame O.", rating: 5, text: "Delivery to East Legon took less than 48 hours. Kalemat is exactly as rich as described.", ts: Date.now() - 1000 * 60 * 60 * 24 * 6 },
  { id: "r3", name: "Nana A.", rating: 4, text: "The oil roll-ons are great for layering. Wish the 12ml came in a bigger size too.", ts: Date.now() - 1000 * 60 * 60 * 24 * 9 },
  { id: "r4", name: "Efua D.", rating: 5, text: "Paid with MoMo, tracked the order right here on the site. Smooth from cart to doorstep.", ts: Date.now() - 1000 * 60 * 60 * 24 * 14 },
];

/* ============================ UTILITIES ============================ */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(22px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function useCountdown(hours) {
  const target = useRef(Date.now() + hours * 3600 * 1000);
  const [left, setLeft] = useState(target.current - Date.now());
  useEffect(() => {
    const iv = setInterval(() => setLeft(Math.max(0, target.current - Date.now())), 1000);
    return () => clearInterval(iv);
  }, []);
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return { h, m, s, done: left <= 0 };
}

/* ============================ BOTTLE SVG ============================
   Signature element: every product, collection and brand card uses
   this same hand-drawn bottle silhouette, recolored by fragrance
   family. It's the one visual mark that repeats across the whole
   site instead of stock photography.
=======================================================================*/
function Bottle({ hue = GOLD, size = 64, animate = false, floor = true }) {
  const gid = useRef("g" + Math.random().toString(36).slice(2, 9)).current;
  return (
    <div style={{ position: "relative", width: size, display: "inline-block" }}>
      <svg width={size} height={size * 1.4} viewBox="0 0 60 84" fill="none" style={animate ? { animation: "bob 4.5s ease-in-out infinite", position: "relative", zIndex: 1 } : { position: "relative", zIndex: 1 }}>
        <defs>
          <linearGradient id={`liquid-${gid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={hue} stopOpacity="0.95" />
            <stop offset="55%" stopColor={hue} stopOpacity="0.78" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id={`glass-${gid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.02" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.14" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <rect x="24" y="4" width="12" height="10" rx="2" fill={GOLD} opacity="0.9" />
        <rect x="21" y="0" width="18" height="6" rx="2" fill="#0E0B08" />
        <path d="M14 20 Q14 14 22 14 H38 Q46 14 46 20 V70 Q46 78 38 80 H22 Q14 78 14 70 Z" fill={INK_3} stroke={hue} strokeWidth="1.2" />
        <path d="M14 20 Q14 14 22 14 H38 Q46 14 46 20 V70 Q46 78 38 80 H22 Q14 78 14 70 Z" fill={`url(#glass-${gid})`} />
        <path d="M17 34 Q17 28 23 28 H37 Q43 28 43 34 V68 Q43 74 37 76 H23 Q17 74 17 68 Z" fill={`url(#liquid-${gid})`} />
        <rect x="17" y="34" width="26" height="6" fill="#FFFFFF" opacity="0.1" />
        <rect x="19" y="18" width="3" height="58" rx="1.5" fill="#FFFFFF" opacity="0.1" />
      </svg>
      {floor && (
        <div style={{
          position: "absolute", left: "50%", bottom: -4, width: size * 0.66, height: size * 0.14,
          background: `radial-gradient(ellipse, ${hue}55 0%, transparent 72%)`,
          transform: "translateX(-50%)", filter: "blur(1px)", zIndex: 0,
        }} />
      )}
    </div>
  );
}

/* ============================ NOTES PYRAMID ==========================
   Structural device unique to this brief: the fragrance pyramid
   (top / heart / base) is real information a perfume shopper needs,
   so it's used as a recurring divider instead of decorative numbering.
=======================================================================*/
/* ============================ 3D ROTATING GEM ==========================
   A lightweight three.js accent â€” a faceted gem that slowly rotates,
   used sparingly at a couple of key visual moments (hero, featured
   product) rather than everywhere. Fails silently if WebGL isn't
   available, so it never breaks the page on an older device/browser.
=========================================================================*/
function RotatingGem({ size = 160, hue = "#C79A4B" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let frameId, renderer, geo, mat, disposed = false;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 4.4);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(size, size);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      geo = new THREE.IcosahedronGeometry(1.4, 0);
      mat = new THREE.MeshStandardMaterial({ color: hue, metalness: 0.65, roughness: 0.25, flatShading: true });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 1.0);
      key.position.set(3, 4, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xffffff, 0.35);
      rim.position.set(-3, -2, -4);
      scene.add(rim);

      let t = 0;
      const animate = () => {
        if (disposed) return;
        t += 0.006;
        mesh.rotation.x = t * 0.6;
        mesh.rotation.y = t;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        disposed = true;
        cancelAnimationFrame(frameId);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    } catch (e) {
      return; // WebGL unavailable â€” no 3D accent, rest of the page is unaffected
    }
  }, [size, hue]);

  return <div ref={mountRef} style={{ width: size, height: size }} aria-hidden="true" />;
}

function NotesPyramid({ top, heart, base }) {
  const rows = [
    ["Top", top, "70%"],
    ["Heart", heart, "88%"],
    ["Base", base, "100%"],
  ];
  return (
    <div className="space-y-1.5 mt-3">
      {rows.map(([label, val, w]) => (
        <div key={label} className="flex items-center gap-2 text-[11px]">
          <span style={{ fontFamily: MONO_FONT, color: GOLD, width: 40 }}>{label}</span>
          <div style={{ background: INK, height: 3, flex: 1, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: w, height: "100%", background: `linear-gradient(90deg, ${GOLD}, ${GOLD_BRIGHT})` }} />
          </div>
          <span style={{ color: PARCH_DIM, width: 110, textAlign: "right" }} className="truncate">{val}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================== APP ================================= */
export default function App() {
  const [introDone, setIntroDone] = useState(() => {
    try { return sessionStorage.getItem("pw_intro_seen") === "1"; } catch (e) { return false; }
  });
  const [cart, setCart] = useState([]); // {id, qty}
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadDismissed, setLeadDismissed] = useState(false);
  const [toast, setToast] = useState(null);
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviews, setReviews] = useState(SEED_REVIEWS);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const shopRef = useRef(null);

  // lead-capture popup after a short delay (once)
  useEffect(() => {
    const t = setTimeout(() => { if (!leadDismissed) setLeadOpen(true); }, 9000);
    return () => clearTimeout(t);
  }, [leadDismissed]);

  // load shared reviews from persistent storage on mount
  useEffect(() => {
    (async () => {
      try {
        const list = await window.storage.list("reviews:", true);
        if (list && list.keys && list.keys.length) {
          const loaded = [];
          for (const k of list.keys) {
            try {
              const r = await window.storage.get(k, true);
              if (r) loaded.push(JSON.parse(r.value));
            } catch (e) {}
          }
          if (loaded.length) setReviews((prev) => [...loaded, ...prev].sort((a, b) => b.ts - a.ts));
        }
      } catch (e) { /* storage unavailable â€” seed reviews still show */ }
    })();
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);

  const addToCart = useCallback((id, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing) return prev.map((c) => (c.id === id ? { ...c, qty: c.qty + qty } : c));
      return [...prev, { id, qty }];
    });
    const p = PRODUCTS.find((p) => p.id === id) || COMBOS.find((c) => c.id === id);
    showToast(`Added "${p?.name}" to cart`);
  }, [showToast]);

  const updateQty = (id, delta) => {
    setCart((prev) => prev
      .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
      .filter((c) => c.qty > 0));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const cartDetailed = cart.map((c) => {
    const combo = COMBOS.find((x) => x.id === c.id);
    if (combo) {
      const items = combo.items.map((i) => PRODUCTS.find((p) => p.id === i));
      const original = items.reduce((s, i) => s + i.price, 0);
      return { ...c, name: combo.name, price: original - combo.save, isCombo: true, hue: GOLD };
    }
    const p = PRODUCTS.find((x) => x.id === c.id);
    return { ...c, name: `${p.name} â€” ${p.size}`, price: p.price, hue: COLLECTIONS.find((col) => col.id === p.collection)?.hue };
  });

  const subtotal = cartDetailed.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesFilters = (collectionFilter === "all" || p.collection === collectionFilter) &&
      (brandFilter === "all" || p.brand === brandFilter);
    if (!searchQuery.trim()) return matchesFilters;
    const q = searchQuery.trim().toLowerCase();
    const brandName = BRANDS.find((b) => b.id === p.brand)?.name.toLowerCase() || "";
    return (p.name.toLowerCase().includes(q) || brandName.includes(q) || p.collection.includes(q)) && matchesFilters;
  });

  const scrollToShop = (collectionId) => {
    if (collectionId) setCollectionFilter(collectionId);
    shopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    setCollectionFilter("all");
    setBrandFilter("all");
    shopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const saveLead = async (email, name) => {
    try {
      await window.storage.set(`leads:${email}`, JSON.stringify({ email, name, ts: Date.now() }), true);
    } catch (e) {}
  };

  const placeOrder = async (customer) => {
    const orderId = "SR" + Math.floor(100000 + Math.random() * 899999);
    const order = { orderId, customer, items: cartDetailed, subtotal, ts: Date.now() };
    try { await window.storage.set(`orders:${orderId}`, JSON.stringify(order), true); } catch (e) {}
    try { await window.storage.set(`leads:${customer.email}`, JSON.stringify({ email: customer.email, name: customer.name, ts: Date.now(), customer: true }), true); } catch (e) {}
    setLastOrder(order);
    setCart([]);
    setCheckoutOpen(false);
    showToast(`Order ${orderId} placed`);
  };

  const submitReview = async (rev) => {
    const full = { id: "r" + Date.now(), ts: Date.now(), ...rev };
    try { await window.storage.set(`reviews:${full.id}`, JSON.stringify(full), true); } catch (e) {}
    setReviews((prev) => [full, ...prev]);
    setReviewOpen(false);
    showToast("Thanks for your review");
  };

  return (
    <div style={{ background: INK, color: PARCH, fontFamily: BODY_FONT, minHeight: "100vh" }}>
      <GlobalStyle />

      {!introDone && (
        <IntroSplash onDone={() => {
          setIntroDone(true);
          try { sessionStorage.setItem("pw_intro_seen", "1"); } catch (e) {}
        }} />
      )}

      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        onCart={() => setCartOpen(true)}
        onTrack={() => setTrackOpen(true)}
        onShop={() => scrollToShop(null)}
        onSearch={handleSearch}
      />

      <Hero onShop={() => scrollToShop(null)} onExplore={() => scrollToShop("oud")} />

      <FeaturedSection onAdd={addToCart} />

      <CollectionsSection onPick={scrollToShop} />

      <PromotionsSection combos={COMBOS} onAdd={addToCart} />

      <BrandsSection onPick={(id) => { setBrandFilter(id); scrollToShop(null); }} />

      <ShopSection
        shopRef={shopRef}
        products={filteredProducts}
        collectionFilter={collectionFilter}
        brandFilter={brandFilter}
        setCollectionFilter={setCollectionFilter}
        setBrandFilter={setBrandFilter}
        onAdd={addToCart}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
      />

      <TrackBanner onTrack={() => setTrackOpen(true)} />

      <ReviewsSection reviews={reviews} onWrite={() => setReviewOpen(true)} />

      <NewsletterCTA onSubmit={saveLead} showToast={showToast} />

      <Footer />

      {/* Overlays */}
      {leadOpen && (
        <LeadModal
          onClose={() => { setLeadOpen(false); setLeadDismissed(true); }}
          onSubmit={(email, name) => { saveLead(email, name); setLeadOpen(false); setLeadDismissed(true); showToast("10% code sent â€” check your inbox"); }}
        />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartDetailed}
        subtotal={subtotal}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
      />

      {checkoutOpen && (
        <CheckoutModal
          items={cartDetailed}
          subtotal={subtotal}
          onClose={() => setCheckoutOpen(false)}
          onPlace={placeOrder}
        />
      )}

      {lastOrder && (
        <OrderConfirmModal order={lastOrder} onClose={() => setLastOrder(null)} onTrack={() => { setLastOrder(null); setTrackOpen(true); }} />
      )}

      {trackOpen && <TrackModal onClose={() => setTrackOpen(false)} />}

      {reviewOpen && <ReviewModal onClose={() => setReviewOpen(false)} onSubmit={submitReview} />}

      {toast && <Toast msg={toast} />}

      <WhatsAppButton />
    </div>
  );
}

/* ============================ GLOBAL STYLE ============================ */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      * { box-sizing: border-box; }
      h1,h2,h3,h4 { font-family: ${DISPLAY_FONT}; margin: 0; }
      body { margin: 0; }
      ::selection { background: ${GOLD}; color: ${INK}; }
      @keyframes bob { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
      @keyframes drift { 0% { transform: translate(0,0); opacity:.0; } 10% { opacity:.5; } 90% { opacity:.3; } 100% { transform: translate(var(--dx), -140px); opacity:0; } }
      @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
      @keyframes slideUp { from { opacity:0; transform: translateY(16px);} to { opacity:1; transform: translateY(0);} }
      @keyframes toastIn { from { opacity:0; transform: translate(-50%, 12px);} to { opacity:1; transform: translate(-50%, 0);} }
      @keyframes bottleFall {
        0% { transform: translateX(-50%) translateY(-130vh) rotate(-14deg); }
        58% { transform: translateX(-50%) translateY(0) rotate(6deg); }
        72% { transform: translateX(-50%) translateY(-16px) rotate(-4deg); }
        86% { transform: translateX(-50%) translateY(0) rotate(2deg); }
        100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
      }
      @keyframes petalBurst {
        0% { transform: translate(-50%, 0) scale(0) rotate(0deg); opacity: 1; }
        14% { transform: translate(-50%, 0) scale(1) rotate(15deg); opacity: 1; }
        100% { transform: translate(calc(-50% + var(--dx)), var(--dy)) scale(0.55) rotate(300deg); opacity: 0; }
      }
      @keyframes impactRing { 0% { transform: translateX(-50%) scale(0.2); opacity: 0.9; } 100% { transform: translateX(-50%) scale(3.2); opacity: 0; } }
      @keyframes impactFlash { 0% { opacity: 0.9; } 100% { opacity: 0; } }
      @keyframes introFadeOut { to { opacity: 0; visibility: hidden; } }
      .fade-scale-enter { animation: slideUp .35s ease; }
      @media (prefers-reduced-motion: reduce) {
        * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
      }
      input::placeholder, textarea::placeholder { color: ${PARCH_DIM}; opacity: 0.7; }
      input, select, textarea { font-family: ${BODY_FONT}; }
      a { text-decoration: none; }
    `}</style>
  );
}

/* ============================ INTRO SPLASH ============================
   Opening moment: a bottle drops from off-screen, lands with a bounce,
   and bursts into scattering floral petals before revealing the site.
   Respects prefers-reduced-motion and is skippable.
=========================================================================*/
function IntroSplash({ onDone }) {
  const [phase, setPhase] = useState("fall"); // fall -> splash -> fadeout
  const finishedRef = useRef(false);

  const petals = useMemo(() => {
    const hues = [GOLD, GOLD_BRIGHT, "#D98BA6", GREEN_BRIGHT, "#E8C77A"];
    return Array.from({ length: 20 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 20 + (Math.random() * 0.4 - 0.2);
      const dist = 90 + Math.random() * 150;
      return {
        dx: Math.cos(angle) * dist,
        dy: -Math.abs(Math.sin(angle) * dist) - Math.random() * 40,
        size: 9 + Math.random() * 12,
        delay: Math.random() * 90,
        hue: hues[i % hues.length],
      };
    });
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    document.body.style.overflow = "";
    onDone();
  }, [onDone]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { finish(); return; }
    const t1 = setTimeout(() => setPhase("splash"), 1000);
    const t2 = setTimeout(() => setPhase("fadeout"), 1000 + 1000);
    const t3 = setTimeout(finish, 1000 + 1000 + 550);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [finish]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100, background: INK,
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
        animation: phase === "fadeout" ? "introFadeOut .55s ease forwards" : undefined,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 60%, ${INK_2} 0%, ${INK} 70%)` }} />

      <button
        onClick={finish}
        style={{ position: "absolute", top: 22, right: 22, color: PARCH_DIM, fontSize: 12, zIndex: 2, border: `1px solid ${LINE}`, padding: "6px 14px", borderRadius: 999 }}
      >
        Skip
      </button>

      <div style={{ position: "relative", width: 4, height: 4 }}>
        {phase !== "fall" && (
          <>
            <div style={{
              position: "absolute", left: "50%", bottom: 4, width: 30, height: 30, borderRadius: "50%",
              border: `2px solid ${GOLD_BRIGHT}`, animation: "impactRing .8s ease-out forwards",
            }} />
            <div style={{
              position: "absolute", left: "50%", bottom: -10, transform: "translateX(-50%)",
              width: 140, height: 40, borderRadius: "50%",
              background: `radial-gradient(ellipse, ${GOLD_BRIGHT}88 0%, transparent 72%)`,
              animation: "impactFlash .5s ease-out forwards",
            }} />
          </>
        )}

        <div style={{
          position: "absolute", left: "50%", bottom: 4,
          animation: phase === "fall" ? "bottleFall 1s cubic-bezier(.4,0,.2,1) forwards" : "none",
          transform: phase === "fall" ? undefined : "translateX(-50%)",
          opacity: phase === "fadeout" ? 0 : 1, transition: "opacity .4s ease",
        }}>
          <img
            src={STOCK_PHOTOS.oud} alt="Perfume Wura"
            style={{
              width: 108, height: 140, objectFit: "cover", borderRadius: 10,
              filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.55))",
              animation: phase !== "fall" ? "bob 4.5s ease-in-out infinite" : "none",
              display: "block",
            }}
          />
          {phase !== "fall" && (
            <div style={{
              position: "absolute", left: "50%", bottom: -6, width: 72, height: 14,
              background: `radial-gradient(ellipse, ${GOLD}66 0%, transparent 72%)`,
              transform: "translateX(-50%)", filter: "blur(1px)",
            }} />
          )}
        </div>

        {phase !== "fall" && petals.map((p, i) => (
          <span key={i} style={{
            position: "absolute", left: "50%", bottom: 8, width: p.size, height: p.size * 1.3,
            background: p.hue, borderRadius: "50% 50% 50% 0", opacity: 0,
            animation: `petalBurst .95s ease-out ${p.delay}ms forwards`,
            "--dx": `${p.dx}px`, "--dy": `${p.dy}px`,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ============================ ANNOUNCEMENT ============================ */
function AnnouncementBar() {
  const msgs = [
    "Free delivery in Accra on orders over GHâ‚µ400",
    "Pay by MTN MoMo, Telecel Cash or card at checkout",
    "New: Perfume Wura in-house oil line â€” 12ml roll-ons",
  ];
  const [i, setI] = useState(0);
  useEffect(() => { const iv = setInterval(() => setI((v) => (v + 1) % msgs.length), 3800); return () => clearInterval(iv); }, []);
  return (
    <div style={{ background: WINE, color: PARCH, fontFamily: MONO_FONT }} className="text-center text-[11px] tracking-wide py-2 px-4 overflow-hidden">
      <span key={i} style={{ animation: "slideUp .4s ease" }} className="inline-block">{msgs[i]}</span>
    </div>
  );
}

/* ================================ HEADER =============================== */
function Header({ cartCount, onCart, onTrack, onShop, onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);

  const submitSearch = (e) => {
    e.preventDefault();
    onSearch(query);
    setSearchOpen(false);
  };

  return (
    <header style={{ borderBottom: `1px solid ${LINE}`, background: INK }} className="sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4 gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <button className="md:hidden mr-1" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <Menu size={20} color={PARCH} />
          </button>
          <Sparkles size={16} color={GOLD} />
          <span style={{ fontFamily: DISPLAY_FONT, fontSize: 22, letterSpacing: 0.5 }}>Perfume Wura</span>
        </div>

        {!searchOpen && (
          <nav className="hidden md:flex items-center gap-7 text-[13px]" style={{ color: PARCH_DIM }}>
            <button onClick={onShop} className="hover:opacity-100" style={{ color: PARCH }}>Shop</button>
            <button onClick={onShop} className="hover:opacity-100">Collections</button>
            <button onClick={onShop} className="hover:opacity-100">Brands</button>
            <button onClick={onTrack} className="hover:opacity-100">Track Order</button>
          </nav>
        )}

        {searchOpen ? (
          <form onSubmit={submitSearch} className="flex-1 flex items-center gap-2" style={{ animation: "slideUp .2s ease" }}>
            <input
              ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fragrances, brandsâ€¦"
              style={{ background: INK_2, border: `1px solid ${LINE}`, color: PARCH }}
              className="flex-1 px-3 py-2 rounded-full text-sm outline-none min-w-0"
            />
            <button type="button" onClick={() => { setSearchOpen(false); setQuery(""); }}><X size={17} color={PARCH_DIM} /></button>
          </form>
        ) : (
          <div className="flex items-center gap-4 shrink-0">
            <button onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={17} color={PARCH_DIM} /></button>
            <button onClick={onCart} className="relative">
              <ShoppingBag size={19} color={PARCH} />
              {cartCount > 0 && (
                <span style={{ background: GOLD, color: INK }} className="absolute -top-2 -right-2 text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-5 pb-4 text-sm" style={{ color: PARCH_DIM }}>
          <button onClick={() => { onShop(); setMenuOpen(false); }} className="text-left">Shop</button>
          <button onClick={() => { onTrack(); setMenuOpen(false); }} className="text-left">Track Order</button>
        </div>
      )}
    </header>
  );
}

/* ================================= HERO ================================= */
function Hero({ onShop, onExplore }) {
  const particles = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    left: 8 + Math.random() * 84,
    delay: Math.random() * 6,
    dur: 7 + Math.random() * 5,
    dx: (Math.random() - 0.5) * 50,
    size: 2 + Math.random() * 3,
  })), []);

  return (
    <section style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${LINE}` }} className="px-5 pt-14 pb-20 md:pt-24 md:pb-28">
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 72% 18%, ${INK_2} 0%, ${INK} 60%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 15% 85%, ${GREEN}22 0%, transparent 55%)` }} />
      <svg style={{ position: "absolute", inset: 0, opacity: 0.35, mixBlendMode: "overlay", pointerEvents: "none" }} width="100%" height="100%">
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.5" />
      </svg>
      {particles.map((p, idx) => (
        <span key={idx} style={{
          position: "absolute", left: `${p.left}%`, bottom: 0, width: p.size, height: p.size,
          borderRadius: "50%", background: GOLD, filter: "blur(0.5px)", willChange: "transform",
          animation: `drift ${p.dur}s ease-in ${p.delay}s infinite`, "--dx": `${p.dx}px`,
        }} />
      ))}

      <div className="max-w-6xl mx-auto relative grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div style={{ animation: "slideUp .8s ease" }}>
            <span style={{ fontFamily: MONO_FONT, color: GOLD, fontSize: 12, letterSpacing: 1.5 }}>ACCRA Â· SINCE 2021</span>
            <h1 style={{ fontSize: "clamp(38px, 6vw, 62px)", lineHeight: 1.04, marginTop: 14 }}>
              Fragrance worth <span style={{ fontStyle: "italic", color: GOLD_BRIGHT }}>arriving</span> for.
            </h1>
            <p style={{ color: PARCH_DIM, maxWidth: 440 }} className="mt-5 text-[15px] leading-relaxed">
              Oud, amber, florals and woods from Lattafa, Arabian Oud, Amouage and our own house oils â€”
              delivered across Ghana, paid for in cedis, tracked from your phone.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <button onClick={onShop} style={{ background: GOLD, color: INK }} className="px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition">
                Shop the Collection <ArrowRight size={15} />
              </button>
              <button onClick={onExplore} style={{ border: `1px solid ${GREEN_BRIGHT}66`, color: GREEN_BRIGHT }} className="px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:border-opacity-60 transition">
                Explore Oud <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center items-end" style={{ minHeight: 220 }}>
          <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}33, transparent 70%)`, filter: "blur(6px)" }} />
          <div style={{ position: "absolute", top: -34, left: "50%", transform: "translateX(-50%)", opacity: 0.9 }}>
            <RotatingGem size={72} hue={GOLD} />
          </div>
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-135%)", opacity: 0.55 }} className="hidden sm:block">
            <Bottle hue={GREEN_BRIGHT} size={80} />
          </div>
          <div style={{ position: "relative", zIndex: 2 }}>
            <Bottle hue={GOLD} size={150} animate />
          </div>
          <div style={{ position: "absolute", left: "50%", transform: "translateX(55%)", opacity: 0.55 }} className="hidden sm:block">
            <Bottle hue="#C97C93" size={68} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ COLLECTIONS ============================ */
function CollectionsSection({ onPick }) {
  return (
    <section className="max-w-6xl mx-auto px-5 py-12 md:py-24">
      <Reveal>
        <div className="flex items-end justify-between mb-8">
          <div>
            <span style={{ fontFamily: MONO_FONT, color: GOLD, fontSize: 12 }}>FRAGRANCE FAMILIES</span>
            <h2 style={{ fontSize: 32 }} className="mt-2">Shop by collection</h2>
          </div>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {COLLECTIONS.map((c, i) => (
          <Reveal key={c.id} delay={i * 70}>
            <button
              onClick={() => onPick(c.id)}
              style={{
                background: `linear-gradient(155deg, ${c.hue}26 0%, ${INK_2} 55%)`,
                border: `1px solid ${LINE}`, position: "relative", overflow: "hidden",
              }}
              className="w-full text-left p-4 md:p-5 rounded-2xl hover:-translate-y-1 transition-transform duration-300 group h-full flex flex-col justify-between"
            >
              <div style={{ position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: "50%", background: `radial-gradient(circle, ${c.hue}40, transparent 70%)` }} />
              <div className="flex items-start justify-between relative">
                <div>
                  <h3 style={{ fontSize: 20 }}>{c.name}</h3>
                  <p style={{ color: PARCH_DIM, fontSize: 12.5 }} className="mt-1 max-w-[16ch]">{c.tag}</p>
                </div>
                <div style={{ transform: "scale(0.6)", transformOrigin: "top right" }} className="group-hover:scale-[0.68] transition-transform">
                  <Bottle hue={c.hue} size={44} />
                </div>
              </div>
              <span style={{ color: GOLD }} className="text-xs flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity relative">
                View pieces <ChevronRight size={13} />
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ============================ PROMOTIONS ============================ */
function ComboCard({ combo, onAdd, delay }) {
  const items = combo.items.map((i) => PRODUCTS.find((p) => p.id === i));
  const original = items.reduce((s, i) => s + i.price, 0);
  const bundlePrice = original - combo.save;
  const { h, m, s, done } = useCountdown(combo.hours);

  return (
    <Reveal delay={delay}>
      <div style={{ background: INK_2, border: `1px solid ${LINE}` }} className="rounded-2xl p-6 flex flex-col h-full">
        <div className="flex items-center justify-between">
          <span style={{ background: WINE, color: PARCH }} className="text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <Gift size={11} /> SAVE {fmt(combo.save)}
          </span>
          {!done ? (
            <span style={{ fontFamily: MONO_FONT, color: GOLD, fontSize: 12 }} className="flex items-center gap-1">
              <Clock size={12} /> {h}h {m}m {s}s
            </span>
          ) : <span style={{ color: PARCH_DIM, fontSize: 12 }}>Offer refreshed</span>}
        </div>

        <h3 style={{ fontSize: 21 }} className="mt-4">{combo.name}</h3>
        <p style={{ color: PARCH_DIM, fontSize: 13 }} className="mt-1 leading-relaxed">{combo.blurb}</p>

        <div className="flex gap-2 my-5">
          {items.map((it) => (
            <div key={it.id} className="flex flex-col items-center" style={{ opacity: 0.9 }}>
              <Bottle hue={COLLECTIONS.find((c) => c.id === it.collection)?.hue} size={34} />
              <span style={{ fontSize: 10, color: PARCH_DIM }} className="mt-1 text-center max-w-[60px] truncate">{it.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span style={{ fontFamily: MONO_FONT, fontSize: 20 }}>{fmt(bundlePrice)}</span>
            <span style={{ color: PARCH_DIM, textDecoration: "line-through", fontSize: 13 }}>{fmt(original)}</span>
          </div>
          <button
            onClick={() => onAdd(combo.id)}
            style={{ background: GOLD, color: INK }}
            className="w-full mt-4 py-2.5 rounded-full text-sm font-semibold hover:brightness-110 transition"
          >
            Add bundle to cart
          </button>
        </div>
      </div>
    </Reveal>
  );
}

function PromotionsSection({ combos, onAdd }) {
  return (
    <section style={{ background: INK_2, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }} className="py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        <Reveal>
          <span style={{ fontFamily: MONO_FONT, color: GOLD, fontSize: 12 }}>LIMITED-TIME BUNDLES</span>
          <h2 style={{ fontSize: 32 }} className="mt-2 mb-8">Combos, on a budget</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {combos.map((c, i) => <ComboCard key={c.id} combo={c} onAdd={onAdd} delay={i * 90} />)}
        </div>
      </div>
    </section>
  );
}

/* ========================= PERFUME OF THE WEEK ========================
   Rotates automatically based on the ISO week number, so it changes on
   its own without needing an admin panel â€” no two consecutive weeks
   land on the same product (deterministic, not random).
=========================================================================*/
function FeaturedSection({ onAdd }) {
  const product = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - start) / 86400000);
    const week = Math.ceil((days + start.getDay() + 1) / 7);
    return PRODUCTS[week % PRODUCTS.length];
  }, []);

  const hue = COLLECTIONS.find((c) => c.id === product.collection)?.hue;
  const brandName = BRANDS.find((b) => b.id === product.brand)?.name;
  const photo = product.image || STOCK_PHOTOS[product.collection];

  return (
    <section style={{ background: `linear-gradient(135deg, ${INK_2}, ${INK})`, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }} className="py-12 md:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative order-2 md:order-1">
              <div style={{ position: "absolute", top: -26, right: 6, zIndex: 2 }}>
                <RotatingGem size={64} hue={GOLD_BRIGHT} />
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ height: 280, border: `1px solid ${LINE}` }}>
                {photo ? (
                  <img src={photo} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div style={{ background: `radial-gradient(circle, ${hue}30, transparent 70%)` }} className="w-full h-full flex items-center justify-center">
                    <Bottle hue={hue} size={100} />
                  </div>
                )}
              </div>
            </div>

            <div className="order-1 md:order-2">
              <span style={{ background: `${GOLD}22`, color: GOLD_BRIGHT }} className="text-[11px] font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Sparkles size={11} /> Featured This Week
              </span>
              <h2 style={{ fontSize: 32 }} className="mt-4">{product.name}</h2>
              <span style={{ fontFamily: MONO_FONT, color: GOLD, fontSize: 12 }}>{brandName} Â· {product.size}</span>
              <p style={{ color: PARCH_DIM }} className="mt-3 text-sm leading-relaxed">
                This week's pick â€” {product.rating}â˜… from {product.reviews} customers, opening on {product.top.toLowerCase()} before settling into {product.heart.toLowerCase()}.
              </p>
              <NotesPyramid top={product.top} heart={product.heart} base={product.base} />
              <div className="flex items-center gap-4 mt-6">
                <span style={{ fontFamily: MONO_FONT, fontSize: 24 }}>{fmt(product.price)}</span>
                <button onClick={() => onAdd(product.id)} style={{ background: GOLD, color: INK }} className="px-6 py-3 rounded-full text-sm font-semibold hover:brightness-110 transition">
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================== BRANDS ============================== */
function BrandsSection({ onPick }) {
  return (
    <section className="max-w-6xl mx-auto px-5 py-12 md:py-24">
      <Reveal>
        <span style={{ fontFamily: MONO_FONT, color: GOLD, fontSize: 12 }}>THE HOUSES WE CARRY</span>
        <h2 style={{ fontSize: 32 }} className="mt-2 mb-8">Top brands</h2>
      </Reveal>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {BRANDS.map((b, i) => (
          <Reveal key={b.id} delay={i * 60}>
            <button
              onClick={() => onPick(b.id)}
              style={{ border: `1px solid ${LINE}` }}
              className="w-full text-left p-5 rounded-2xl hover:border-opacity-70 transition h-full"
            >
              <div className="flex items-center justify-between">
                <h3 style={{ fontFamily: DISPLAY_FONT, fontSize: 19 }}>{b.name}</h3>
                <span style={{ fontFamily: MONO_FONT, fontSize: 10, color: GOLD }}>{b.origin}</span>
              </div>
              <p style={{ color: PARCH_DIM, fontSize: 13 }} className="mt-2 leading-relaxed">{b.blurb}</p>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* =============================== SHOP ================================ */
function ProductCard({ p, onAdd, delay }) {
  const [open, setOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const hue = COLLECTIONS.find((c) => c.id === p.collection)?.hue;
  const photo = p.image || STOCK_PHOTOS[p.collection];

  return (
    <Reveal delay={delay}>
      <div style={{ background: INK_2, border: `1px solid ${LINE}` }} className="rounded-2xl p-4 md:p-5 h-full flex flex-col group">
        <div className="flex justify-between items-start">
          {p.badge && (
            <span style={{ background: `${GOLD}22`, color: GOLD_BRIGHT }} className="text-[10px] font-semibold px-2 py-0.5 rounded-full">{p.badge}</span>
          )}
          <Heart size={15} color={PARCH_DIM} className="ml-auto cursor-pointer hover:text-current" style={{ color: PARCH_DIM }} />
        </div>

        {photo && !imgFailed ? (
          <div className="relative -mx-1 rounded-[14px] overflow-hidden" style={{ height: 132 }}>
            <img
              src={photo} alt={p.name} loading="lazy" onError={() => setImgFailed(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, ${INK_2}CC 100%)` }} />
            <span style={{ position: "absolute", bottom: 6, left: 8, width: 8, height: 8, borderRadius: "50%", background: hue, boxShadow: "0 0 0 2px rgba(0,0,0,0.3)" }} />
          </div>
        ) : (
          <div
            style={{ background: `radial-gradient(circle at 50% 35%, ${hue}2E 0%, transparent 68%)`, borderRadius: 14 }}
            className="flex justify-center py-5 -mx-1"
          >
            <div className="group-hover:-translate-y-1 transition-transform duration-300">
              <Bottle hue={hue} size={72} />
            </div>
          </div>
        )}

        <span style={{ fontFamily: MONO_FONT, fontSize: 10, color: GOLD }}>{BRANDS.find((b) => b.id === p.brand)?.name}</span>
        <h3 style={{ fontSize: 18 }} className="mt-0.5">{p.name}</h3>
        <span style={{ color: PARCH_DIM, fontSize: 12 }}>{p.size}</span>

        <div className="flex items-center gap-1 mt-2">
          <Star size={12} fill={GOLD} color={GOLD} />
          <span style={{ fontSize: 12, color: PARCH_DIM }}>{p.rating} ({p.reviews})</span>
        </div>

        <button onClick={() => setOpen((v) => !v)} style={{ color: GOLD }} className="text-[11px] flex items-center gap-1 mt-2">
          Notes <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </button>
        {open && <NotesPyramid top={p.top} heart={p.heart} base={p.base} />}

        <div className="flex items-center justify-between mt-auto pt-4">
          <span style={{ fontFamily: MONO_FONT, fontSize: 17 }}>{fmt(p.price)}</span>
          <button onClick={() => onAdd(p.id)} style={{ background: GOLD, color: INK }} className="w-9 h-9 rounded-full flex items-center justify-center hover:brightness-110 transition">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </Reveal>
  );
}

function ShopSection({ shopRef, products, collectionFilter, brandFilter, setCollectionFilter, setBrandFilter, onAdd, searchQuery, onClearSearch }) {
  return (
    <section ref={shopRef} className="max-w-6xl mx-auto px-5 py-12 md:py-24 scroll-mt-20">
      <Reveal>
        <span style={{ fontFamily: MONO_FONT, color: GOLD, fontSize: 12 }}>THE FULL SHELF</span>
        <h2 style={{ fontSize: 32 }} className="mt-2 mb-6">Shop all fragrances</h2>
      </Reveal>

      {searchQuery && (
        <div style={{ background: `${GREEN}33`, border: `1px solid ${LINE_GREEN}` }} className="flex items-center justify-between px-4 py-2.5 rounded-full mb-5 text-sm">
          <span>Showing results for <strong>"{searchQuery}"</strong></span>
          <button onClick={onClearSearch} style={{ color: GOLD_BRIGHT }} className="flex items-center gap-1 text-xs shrink-0 ml-3">
            Clear <X size={12} />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        <FilterChip active={collectionFilter === "all"} onClick={() => setCollectionFilter("all")}>All families</FilterChip>
        {COLLECTIONS.map((c) => (
          <FilterChip key={c.id} active={collectionFilter === c.id} onClick={() => setCollectionFilter(c.id)}>{c.name}</FilterChip>
        ))}
        <span style={{ width: 1, background: LINE }} className="mx-1" />
        <FilterChip active={brandFilter === "all"} onClick={() => setBrandFilter("all")}>All brands</FilterChip>
        {BRANDS.map((b) => (
          <FilterChip key={b.id} active={brandFilter === b.id} onClick={() => setBrandFilter(b.id)}>{b.name}</FilterChip>
        ))}
      </div>

      {products.length === 0 ? (
        <p style={{ color: PARCH_DIM }}>No pieces match that combination yet â€” try clearing a filter.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {products.map((p, i) => <ProductCard key={p.id} p={p} onAdd={onAdd} delay={(i % 4) * 60} />)}
        </div>
      )}
    </section>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${active ? GOLD : LINE}`,
        background: active ? `${GOLD}1A` : "transparent",
        color: active ? GOLD_BRIGHT : PARCH_DIM,
      }}
      className="text-[12px] px-3 py-1.5 rounded-full transition"
    >
      {children}
    </button>
  );
}

/* ============================ TRACK BANNER ============================ */
function TrackBanner({ onTrack }) {
  return (
    <section style={{ background: INK_2, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div style={{ background: `${GREEN_BRIGHT}22`, borderRadius: 999 }} className="w-11 h-11 flex items-center justify-center">
            <Truck size={19} color={GREEN_BRIGHT} />
          </div>
          <div>
            <h3 style={{ fontSize: 18 }}>Already ordered?</h3>
            <p style={{ color: PARCH_DIM, fontSize: 13 }}>Enter your order number to see exactly where it is.</p>
          </div>
        </div>
        <button onClick={onTrack} style={{ border: `1px solid ${GOLD}` }} className="px-5 py-2.5 rounded-full text-sm flex items-center gap-2" >
          Track my order <ArrowUpRight size={14} />
        </button>
      </div>
    </section>
  );
}

/* ============================== REVIEWS =============================== */
function ReviewsSection({ reviews, onWrite }) {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  return (
    <section className="max-w-6xl mx-auto px-5 py-12 md:py-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span style={{ fontFamily: MONO_FONT, color: GOLD, fontSize: 12 }}>FROM CUSTOMERS</span>
            <h2 style={{ fontSize: 32 }} className="mt-2 flex items-center gap-3">
              Reviews
              <span style={{ fontFamily: MONO_FONT, fontSize: 15, color: PARCH_DIM }} className="flex items-center gap-1">
                <Star size={14} fill={GOLD} color={GOLD} /> {avg} Â· {reviews.length} reviews
              </span>
            </h2>
          </div>
          <button onClick={onWrite} style={{ border: `1px solid ${GREEN_BRIGHT}66`, color: GREEN_BRIGHT }} className="px-5 py-2.5 rounded-full text-sm">Write a review</button>
        </div>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-4">
        {reviews.slice(0, 6).map((r, i) => (
          <Reveal key={r.id} delay={i * 50}>
            <div style={{ background: INK_2, border: `1px solid ${LINE}` }} className="rounded-2xl p-5 h-full">
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 14 }}>{r.name}</span>
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={12} fill={idx < r.rating ? GOLD : "none"} color={GOLD} />
                  ))}
                </span>
              </div>
              <p style={{ color: PARCH_DIM, fontSize: 13.5 }} className="mt-2 leading-relaxed">{r.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ============================ NEWSLETTER CTA ============================ */
function NewsletterCTA({ onSubmit, showToast }) {
  const [email, setEmail] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    onSubmit(email, "");
    showToast("You're on the list â€” 10% code incoming");
    setEmail("");
  };
  return (
    <section style={{ background: `linear-gradient(120deg, ${INK_2}, ${INK})`, borderTop: `1px solid ${LINE}` }} className="py-16">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <Mail size={22} color={GOLD} className="mx-auto mb-4" />
        <h2 style={{ fontSize: 28 }}>Get first look at new arrivals</h2>
        <p style={{ color: PARCH_DIM }} className="mt-2 text-sm">New drops, combo prices and restocks â€” plus 10% off your first order.</p>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 mt-6 max-w-md mx-auto">
          <input
            value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
            placeholder="you@email.com"
            style={{ background: INK_2, border: `1px solid ${LINE}`, color: PARCH }}
            className="flex-1 px-4 py-3 rounded-full text-sm outline-none"
          />
          <button style={{ background: GOLD, color: INK }} className="px-6 py-3 rounded-full text-sm font-semibold hover:brightness-110 transition">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

/* =============================== FOOTER ================================ */
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${LINE}` }} className="px-5 py-12">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={15} color={GOLD} />
            <span style={{ fontFamily: DISPLAY_FONT, fontSize: 19 }}>Perfume Wura</span>
          </div>
          <p style={{ color: PARCH_DIM, fontSize: 12.5 }} className="leading-relaxed">Curated Arabian and niche fragrance, shipped across Ghana.</p>
          <div className="flex flex-col gap-2 mt-4 text-[13px]">
            <a href="https://wa.me/233543864580" target="_blank" rel="noopener noreferrer" style={{ color: PARCH }} className="flex items-center gap-2 hover:text-current">
              <WhatsAppIcon size={16} color={GREEN_BRIGHT} /> <strong style={{ fontWeight: 700 }}>054 386 4580</strong>
            </a>
            <a href="https://www.tiktok.com/@perfumewura" target="_blank" rel="noopener noreferrer" style={{ color: PARCH }} className="flex items-center gap-2 hover:text-current">
              <TikTokIcon size={15} color={PARCH} /> <strong style={{ fontWeight: 700 }}>@perfumewura</strong>
            </a>
            <div className="flex items-center gap-3 mt-1">
              <Instagram size={16} color={PARCH_DIM} />
              <Facebook size={16} color={PARCH_DIM} />
            </div>
          </div>
        </div>
        <div>
          <h4 style={{ color: PARCH, fontSize: 13 }} className="mb-3">Shop</h4>
          <ul style={{ color: PARCH_DIM }} className="space-y-2 text-[13px]">
            <li>Oud & Amber</li><li>Floral & Citrus</li><li>Combo bundles</li><li>House oils</li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: PARCH, fontSize: 13 }} className="mb-3">Support</h4>
          <ul style={{ color: PARCH_DIM }} className="space-y-2 text-[13px]">
            <li className="flex items-center gap-2"><Phone size={13} /> <strong style={{ fontWeight: 700, color: PARCH }}>054 386 4580 / 024 273 9071</strong></li>
            <li className="flex items-center gap-2"><Mail size={13} /> hello@perfumewura.com</li>
            <li className="flex items-center gap-2"><MapPin size={13} /> Osu, Accra</li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: PARCH, fontSize: 13 }} className="mb-3">Payments</h4>
          <div style={{ color: PARCH_DIM }} className="flex flex-col gap-2 text-[13px]">
            <span className="flex items-center gap-2"><Smartphone size={13} /> MTN MoMo Â· Telecel Cash</span>
            <span className="flex items-center gap-2"><CreditCard size={13} /> Visa Â· Mastercard</span>
            <span className="flex items-center gap-2"><Banknote size={13} /> Cash on delivery (Accra)</span>
          </div>
        </div>
      </div>
      <div style={{ color: PARCH_DIM, borderTop: `1px solid ${LINE}` }} className="max-w-6xl mx-auto mt-10 pt-6 text-[11px] flex flex-col sm:flex-row justify-between gap-2">
        <span>Â© 2026 Perfume Wura. All rights reserved.</span>
        <span className="flex items-center gap-1"><ShieldCheck size={12} /> Demo storefront â€” checkout and tracking run on in-browser storage, not a live payment processor.</span>
      </div>
    </footer>
  );
}

/* ================================ TOAST ================================= */
function Toast({ msg }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", background: GOLD, color: INK,
      padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600,
      animation: "toastIn .3s ease", zIndex: 60,
    }}>
      {msg}
    </div>
  );
}

/* ============================ WHATSAPP BUTTON ============================ */
function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const numbers = [
    { label: "0543 864 580", wa: "233543864580" },
    { label: "0242 739 071", wa: "233242739071" },
  ];
  const msg = encodeURIComponent("Hi Perfume Wura, I have a question about a fragrance");

  return (
    <div style={{ position: "fixed", bottom: 22, right: 18, zIndex: 45 }}>
      {open && (
        <div
          style={{ background: INK_2, border: `1px solid ${LINE}`, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
          className="absolute bottom-[64px] right-0 rounded-2xl p-2 w-52 fade-scale-enter"
        >
          <p style={{ color: PARCH_DIM, fontSize: 11 }} className="px-2 pt-1 pb-2">Chat on WhatsApp</p>
          {numbers.map((n) => (
            <a
              key={n.wa} href={`https://wa.me/${n.wa}?text=${msg}`} target="_blank" rel="noopener noreferrer"
              style={{ color: PARCH }} className="flex items-center gap-2 px-2 py-2 rounded-xl text-sm hover:bg-white/5 transition"
            >
              <WhatsAppIcon size={16} color={GREEN_BRIGHT} /> {n.label}
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: GREEN, color: "#fff", borderRadius: 999,
          width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
        }}
        aria-label="Chat with us on WhatsApp"
      >
        {open ? <X size={22} /> : <WhatsAppIcon size={26} />}
      </button>
    </div>
  );
}

function TikTokIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M16.6 5.82c-.9-.94-1.44-2.13-1.5-3.47H12.4v13.6c0 1.4-1.14 2.55-2.55 2.55a2.55 2.55 0 0 1 0-5.1c.28 0 .55.04.8.13V10.7a5.36 5.36 0 0 0-.8-.06 5.36 5.36 0 1 0 5.36 5.36V9.05a8.2 8.2 0 0 0 4.79 1.53V7.77a5.6 5.6 0 0 1-3.4-1.95Z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill={color}>
      <path d="M16.01 3C9.38 3 4 8.38 4 15.01c0 2.26.62 4.38 1.7 6.2L4 29l7.98-1.65a12 12 0 0 0 4.03.7h.01c6.63 0 12.01-5.38 12.01-12.01C28.03 8.38 22.65 3 16.01 3Zm0 21.9h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-4.73.98 1-4.6-.24-.38a9.9 9.9 0 0 1-1.52-5.3c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.02 2.91a9.86 9.86 0 0 1 2.9 7.01c0 5.47-4.45 9.9-9.94 9.9Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.37-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

/* ============================== LEAD MODAL ============================== */
function LeadModal({ onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000B3", zIndex: 50 }} className="flex items-center justify-center p-5">
      <div style={{ background: INK_2, border: `1px solid ${LINE}` }} className="relative max-w-sm w-full rounded-2xl p-7 fade-scale-enter">
        <button onClick={onClose} className="absolute top-4 right-4"><X size={16} color={PARCH_DIM} /></button>
        <Bottle hue={GOLD} size={46} />
        <h3 style={{ fontSize: 22 }} className="mt-4">Take 10% off your first bottle</h3>
        <p style={{ color: PARCH_DIM, fontSize: 13 }} className="mt-2">Leave your email and we'll send a code, plus a heads-up when new stock or combo prices land.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) onSubmit(email, name); }} className="mt-5 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (optional)"
            style={{ background: INK, border: `1px solid ${LINE}`, color: PARCH }} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email address"
            style={{ background: INK, border: `1px solid ${LINE}`, color: PARCH }} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" />
          <button style={{ background: GOLD, color: INK }} className="w-full py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition">Send my code</button>
        </form>
        <button onClick={onClose} style={{ color: PARCH_DIM }} className="text-[12px] mt-3 mx-auto block">No thanks, I'll browse first</button>
      </div>
    </div>
  );
}

/* =============================== CART DRAWER ============================= */
function CartDrawer({ open, onClose, items, subtotal, updateQty, removeFromCart, onCheckout }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "#000000B3", zIndex: 40, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .25s" }}
      />
      <aside
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: "min(400px,100vw)", background: INK_2,
          borderLeft: `1px solid ${LINE}`, zIndex: 41, transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .3s cubic-bezier(.2,.7,.2,1)", display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ borderBottom: `1px solid ${LINE}` }} className="flex items-center justify-between p-5">
          <h3 style={{ fontSize: 19 }}>Your cart</h3>
          <button onClick={onClose}><X size={18} color={PARCH_DIM} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && <p style={{ color: PARCH_DIM }} className="text-sm">Nothing here yet â€” go pick a scent.</p>}
          {items.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Bottle hue={c.hue} size={40} />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span style={{ fontSize: 13.5 }}>{c.name}</span>
                  <button onClick={() => removeFromCart(c.id)}><X size={13} color={PARCH_DIM} /></button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div style={{ border: `1px solid ${LINE}` }} className="flex items-center rounded-full">
                    <button onClick={() => updateQty(c.id, -1)} className="p-1.5"><Minus size={12} color={PARCH_DIM} /></button>
                    <span style={{ fontFamily: MONO_FONT, fontSize: 12 }} className="px-2">{c.qty}</span>
                    <button onClick={() => updateQty(c.id, 1)} className="p-1.5"><Plus size={12} color={PARCH_DIM} /></button>
                  </div>
                  <span style={{ fontFamily: MONO_FONT, fontSize: 13 }}>{fmt(c.price * c.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ borderTop: `1px solid ${LINE}` }} className="p-5">
            <div className="flex justify-between mb-4">
              <span style={{ color: PARCH_DIM }}>Subtotal</span>
              <span style={{ fontFamily: MONO_FONT, fontSize: 17 }}>{fmt(subtotal)}</span>
            </div>
            <button onClick={onCheckout} style={{ background: GOLD, color: INK }} className="w-full py-3 rounded-full text-sm font-semibold hover:brightness-110 transition">
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

/* ============================== CHECKOUT MODAL ============================ */
function CheckoutModal({ items, subtotal, onClose, onPlace }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "Accra", region: "Greater Accra" });
  const [payment, setPayment] = useState("momo");
  const [processing, setProcessing] = useState(false);
  const delivery = subtotal >= 400 ? 0 : 25;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const canContinue = form.name && form.email.includes("@") && form.phone.length >= 9 && form.address;

  const confirm = () => {
    setProcessing(true);
    setTimeout(() => { onPlace(form); setProcessing(false); }, 1400);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000B3", zIndex: 50 }} className="flex items-center justify-center p-4">
      <div style={{ background: INK_2, border: `1px solid ${LINE}` }} className="relative max-w-md w-full rounded-2xl p-6 max-h-[90vh] overflow-y-auto fade-scale-enter">
        <button onClick={onClose} className="absolute top-5 right-5"><X size={16} color={PARCH_DIM} /></button>
        <span style={{ fontFamily: MONO_FONT, color: GOLD, fontSize: 11 }}>STEP {step} OF 2</span>
        <h3 style={{ fontSize: 22 }} className="mt-1">{step === 1 ? "Delivery details" : "Payment"}</h3>

        {step === 1 && (
          <div className="space-y-3 mt-5">
            <Field label="Full name"><input value={form.name} onChange={set("name")} style={inputStyle} placeholder="Ama Serwaa" /></Field>
            <Field label="Email"><input value={form.email} onChange={set("email")} type="email" style={inputStyle} placeholder="you@email.com" /></Field>
            <Field label="Phone (for delivery updates)"><input value={form.phone} onChange={set("phone")} style={inputStyle} placeholder="024 000 0000" /></Field>
            <Field label="Delivery address"><input value={form.address} onChange={set("address")} style={inputStyle} placeholder="House no., street, landmark" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="City"><input value={form.city} onChange={set("city")} style={inputStyle} /></Field>
              <Field label="Region">
                <select value={form.region} onChange={set("region")} style={inputStyle}>
                  {["Greater Accra", "Ashanti", "Western", "Eastern", "Central", "Northern"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
            </div>
            <button
              disabled={!canContinue}
              onClick={() => setStep(2)}
              style={{ background: canContinue ? GOLD : INK_3, color: canContinue ? INK : PARCH_DIM }}
              className="w-full py-3 rounded-full text-sm font-semibold mt-3 transition"
            >
              Continue to payment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-5">
            <div className="space-y-2">
              {[
                { id: "momo", label: "Mobile Money", sub: "MTN MoMo, Telecel Cash, AirtelTigo", icon: Smartphone },
                { id: "card", label: "Debit / Credit Card", sub: "Visa, Mastercard", icon: CreditCard },
                { id: "cod", label: "Cash on Delivery", sub: "Accra only", icon: Banknote },
              ].map((m) => (
                <button
                  key={m.id} onClick={() => setPayment(m.id)}
                  style={{ border: `1px solid ${payment === m.id ? GOLD : LINE}`, background: payment === m.id ? `${GOLD}14` : "transparent" }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left"
                >
                  <m.icon size={17} color={payment === m.id ? GOLD : PARCH_DIM} />
                  <div>
                    <div style={{ fontSize: 13.5 }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: PARCH_DIM }}>{m.sub}</div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${LINE}` }} className="mt-5 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between" style={{ color: PARCH_DIM }}><span>Subtotal</span><span style={{ fontFamily: MONO_FONT }}>{fmt(subtotal)}</span></div>
              <div className="flex justify-between" style={{ color: PARCH_DIM }}><span>Delivery</span><span style={{ fontFamily: MONO_FONT }}>{delivery === 0 ? "Free" : fmt(delivery)}</span></div>
              <div className="flex justify-between mt-1" style={{ fontSize: 17 }}><span>Total</span><span style={{ fontFamily: MONO_FONT }}>{fmt(subtotal + delivery)}</span></div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setStep(1)} style={{ border: `1px solid ${LINE}`, color: PARCH_DIM }} className="flex-1 py-3 rounded-full text-sm">Back</button>
              <button onClick={confirm} disabled={processing} style={{ background: GOLD, color: INK }} className="flex-1 py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2">
                {processing ? "Processingâ€¦" : `Pay ${fmt(subtotal + delivery)}`}
              </button>
            </div>
            <p style={{ color: PARCH_DIM, fontSize: 10.5 }} className="mt-3 text-center">Demo checkout â€” no real charge is made.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = { background: INK, border: `1px solid ${LINE}`, color: PARCH, width: "100%", padding: "10px 12px", borderRadius: 10, fontSize: 13, outline: "none" };

function Field({ label, children }) {
  return (
    <label className="block">
      <span style={{ color: PARCH_DIM, fontSize: 11.5 }} className="block mb-1">{label}</span>
      {children}
    </label>
  );
}

/* ============================ ORDER CONFIRM ============================= */
function OrderConfirmModal({ order, onClose, onTrack }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000B3", zIndex: 50 }} className="flex items-center justify-center p-5">
      <div style={{ background: INK_2, border: `1px solid ${LINE}` }} className="max-w-sm w-full rounded-2xl p-7 text-center fade-scale-enter">
        <CheckCircle2 size={34} color={GOLD} className="mx-auto" />
        <h3 style={{ fontSize: 21 }} className="mt-3">Order placed</h3>
        <p style={{ color: PARCH_DIM, fontSize: 13 }} className="mt-1">A confirmation has been sent to {order.customer.email}.</p>
        <div style={{ background: INK, border: `1px solid ${LINE}` }} className="rounded-xl p-4 mt-5 text-left">
          <div className="flex justify-between text-sm"><span style={{ color: PARCH_DIM }}>Order ID</span><span style={{ fontFamily: MONO_FONT, color: GOLD }}>{order.orderId}</span></div>
          <div className="flex justify-between text-sm mt-1"><span style={{ color: PARCH_DIM }}>Total</span><span style={{ fontFamily: MONO_FONT }}>{fmt(order.subtotal)}</span></div>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={onClose} style={{ border: `1px solid ${LINE}`, color: PARCH_DIM }} className="flex-1 py-2.5 rounded-full text-sm">Keep browsing</button>
          <button onClick={onTrack} style={{ background: GOLD, color: INK }} className="flex-1 py-2.5 rounded-full text-sm font-semibold">Track it</button>
        </div>
      </div>
    </div>
  );
}

/* ============================== TRACK MODAL ============================== */
function TrackModal({ onClose }) {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const stages = ["Order placed", "Processing", "Dispatched", "Out for delivery", "Delivered"];

  const stageIndex = (ts) => {
    const mins = (Date.now() - ts) / 60000;
    if (mins < 1) return 0;
    if (mins < 3) return 1;
    if (mins < 6) return 2;
    if (mins < 9) return 3;
    return 4;
  };

  const lookup = async () => {
    setError(""); setOrder(null);
    if (!orderId.trim()) return;
    setLoading(true);
    try {
      const res = await window.storage.get(`orders:${orderId.trim().toUpperCase()}`, true);
      setOrder(JSON.parse(res.value));
    } catch (e) {
      setError("No order found with that ID â€” double-check the code from your confirmation.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000B3", zIndex: 50 }} className="flex items-center justify-center p-5">
      <div style={{ background: INK_2, border: `1px solid ${LINE}` }} className="max-w-sm w-full rounded-2xl p-7 fade-scale-enter">
        <button onClick={onClose} className="float-right"><X size={16} color={PARCH_DIM} /></button>
        <Package size={22} color={GOLD} />
        <h3 style={{ fontSize: 21 }} className="mt-3">Track your order</h3>
        <p style={{ color: PARCH_DIM, fontSize: 12.5 }} className="mt-1">Enter the order ID from your confirmation (e.g. SR482910).</p>
        <div className="flex gap-2 mt-4">
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)} style={inputStyle} placeholder="SR482910" />
          <button onClick={lookup} style={{ background: GOLD, color: INK }} className="px-4 rounded-xl text-sm font-semibold">{loading ? "â€¦" : "Go"}</button>
        </div>
        {error && <p style={{ color: "#E19A9A", fontSize: 12 }} className="mt-3">{error}</p>}
        {order && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-4">
              <span style={{ color: PARCH_DIM }}>Total</span>
              <span style={{ fontFamily: MONO_FONT }}>{fmt(order.subtotal)}</span>
            </div>
            {stages.map((s, i) => {
              const idx = stageIndex(order.ts);
              const done = i <= idx;
              return (
                <div key={s} className="flex items-center gap-3 mb-1">
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: done ? GOLD : INK_3, border: `1px solid ${done ? GOLD : LINE}` }} />
                  <span style={{ fontSize: 13, color: done ? PARCH : PARCH_DIM }}>{s}</span>
                  {i < stages.length - 1 && <span style={{ flex: 1, height: 1, background: i < idx ? GOLD : LINE }} />}
                </div>
              );
            })}
            <p style={{ color: PARCH_DIM, fontSize: 10.5 }} className="mt-4">Demo tracker â€” status advances automatically over minutes for preview purposes.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== REVIEW MODAL ============================= */
function ReviewModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000B3", zIndex: 50 }} className="flex items-center justify-center p-5">
      <div style={{ background: INK_2, border: `1px solid ${LINE}` }} className="max-w-sm w-full rounded-2xl p-7 fade-scale-enter">
        <button onClick={onClose} className="float-right"><X size={16} color={PARCH_DIM} /></button>
        <h3 style={{ fontSize: 21 }}>Write a review</h3>
        <div className="flex gap-1 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} onClick={() => setRating(i + 1)}>
              <Star size={22} fill={i < rating ? GOLD : "none"} color={GOLD} />
            </button>
          ))}
        </div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ ...inputStyle, marginTop: 14 }} />
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="What did you think?" rows={4} style={{ ...inputStyle, marginTop: 10, resize: "none" }} />
        <button
          onClick={() => name && text && onSubmit({ name, rating, text })}
          style={{ background: GOLD, color: INK }}
          className="w-full py-3 rounded-full text-sm font-semibold mt-4"
        >
          Submit review
        </button>
      </div>
    </div>
  );
}
