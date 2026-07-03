import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useMotionValueEvent,
  useInView,
  animate,
  useReducedMotion
} from "framer-motion";
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Cake, 
  Palette, 
  PartyPopper, 
  ArrowRight, 
  Star,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

// Custom SVG Icons for Brands
const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

// ==========================================
// TYPES & CONTEXTS
// ==========================================
interface EstimatorState {
  guests: number;
  hours: number;
  linens: boolean;
  sound: boolean;
  dessert: boolean;
  coordinator: boolean;
}

interface PackageDetail {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

// ==========================================
// COUNT-UP ANIMATION COMPONENT
// ==========================================
const Counter: React.FC<{ value: number; duration?: number; suffix?: string }> = ({ 
  value, 
  duration = 1.5, 
  suffix = "" 
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setCount(value);
      return;
    }

    const controls = animate(0, value, {
      duration: duration,
      ease: "easeOut",
      onUpdate(val) {
        setCount(Math.floor(val));
      }
    });
    return () => controls.stop();
  }, [value, duration, isInView, shouldReduceMotion]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ==========================================
// PRIMARY APP COMPONENT
// ==========================================
export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [estimator, setEstimator] = useState<EstimatorState>({
    guests: 40,
    hours: 5,
    linens: false,
    sound: false,
    dessert: false,
    coordinator: false,
  });
  
  const [activeTab, setActiveTab] = useState<"estimator" | "packages" | "gallery">("estimator");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    guestCount: "40",
    eventType: "Birthday",
    message: "",
  });

  const shouldReduceMotion = useReducedMotion();
  const contactFormRef = useRef<HTMLDivElement>(null);

  // Scroll handler for navigation opacity & blur
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  // Dynamic Price Calculation
  const calculateTotal = () => {
    const hourlyRate = 150;
    const basePrice = estimator.hours * hourlyRate;
    
    // Guest tier fee
    let guestFee = 0;
    if (estimator.guests > 30 && estimator.guests <= 50) {
      guestFee = 100;
    } else if (estimator.guests > 50) {
      guestFee = 200;
    }

    // Addon rates
    const linensPrice = estimator.linens ? 150 : 0;
    const soundPrice = estimator.sound ? 200 : 0;
    const dessertPrice = estimator.dessert ? 250 : 0;
    const coordinatorPrice = estimator.coordinator ? 300 : 0;

    return basePrice + guestFee + linensPrice + soundPrice + dessertPrice + coordinatorPrice;
  };

  const handleEstimatorChange = (key: keyof EstimatorState, value: any) => {
    setEstimator((prev) => ({ ...prev, [key]: value }));
  };

  const handleInquiryFromEstimator = () => {
    const summary = `Estimated Event: Guests: ${estimator.guests}, Hours: ${estimator.hours}. Addons: ${[
      estimator.linens ? "Table Linens" : "",
      estimator.sound ? "Sound/Light System" : "",
      estimator.dessert ? "Dessert Station" : "",
      estimator.coordinator ? "Coordinator" : "",
    ].filter(Boolean).join(", ") || "None"}. Calculated Estimate: $${calculateTotal()}.`;
    
    setFormData((prev) => ({
      ...prev,
      guestCount: String(estimator.guests),
      message: `Hi R&K, I would like to request an estimate callback based on the customized quote builder:\n\n${summary}`,
    }));

    contactFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        date: "",
        guestCount: "40",
        eventType: "Birthday",
        message: "",
      });
    }, 5000);
  };

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0.01 : 0.08,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15
      }
    },
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 18
      }
    },
  };

  // Nav custom link underline reveal styles
  const navLinks = [
    { name: "Welcome", href: "#welcome" },
    { name: "Services", href: "#services" },
    { name: "Planning & Quotes", href: "#quotes" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Location & Visit", href: "#contact" }
  ];

  const packages: PackageDetail[] = [
    {
      id: "pkg-1",
      name: "Hall Rental Essentials",
      price: "$600+",
      description: "Ideal for clients who prefer managing their own planning and decoration details.",
      features: [
        "Up to 4 Hours of Hall Access",
        "Accommodates up to 70 Guests Max",
        "Setup of standard rectangular tables & chairs",
        "Modern ambient lighting controls",
        "Host provides decorations, food, and cleanup"
      ],
      icon: <Users className="w-6 h-6 text-brand-primary" />
    },
    {
      id: "pkg-2",
      name: "The Celebration Suite",
      price: "$1,250+",
      description: "Our highly-requested custom setup. We prepare the space so you can focus on making memories.",
      features: [
        "Up to 6 Hours of Hall Access",
        "Tables, chairs, and custom elegant linens",
        "Bespoke themed table centerpieces",
        "Full customizable Balloon Arch backdrop",
        "Dedicated Coordinator during event hours",
        "Complete cleaning service post-event"
      ],
      icon: <Sparkles className="w-6 h-6 text-brand-primary" />
    },
    {
      id: "pkg-3",
      name: "Premium Milestone Package",
      price: "$1,850+",
      description: "The ultimate zero-stress celebration. Full-service planning, coordinate, and decor.",
      features: [
        "Up to 8 Hours of Hall Access",
        "Premium floral design and full tablecloth service",
        "Deluxe balloon setups and custom photo zone",
        "High-definition sound & light integrations",
        "Custom Candy & Dessert Bar installation",
        "Pre-event layout planning & support team"
      ],
      icon: <PartyPopper className="w-6 h-6 text-brand-primary" />
    }
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-charcoal overflow-hidden font-sans antialiased selection:bg-brand-primary selection:text-white">
      
      {/* ==========================================
          HEADER & NAVIGATION
          ========================================== */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "glassmorphism shadow-md py-3 border-b border-brand-primary/10" 
            : "bg-transparent py-5"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo Section */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary tracking-wide transition-all group-hover:opacity-85">
              R&K <span className="font-sans font-light text-brand-secondary text-lg sm:text-xl">Party Hall</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-brand-charcoal hover:text-brand-primary transition-colors text-sm tracking-wide py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-primary scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          {/* Nav CTAs & Socials */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/p/RK-party-world-100083210288539/" 
                target="_blank" 
                rel="noreferrer"
                className="text-brand-charcoal hover:text-brand-primary transition-colors hover:scale-110 duration-200"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/rkpartyworld/" 
                target="_blank" 
                rel="noreferrer"
                className="text-brand-charcoal hover:text-brand-primary transition-colors hover:scale-110 duration-200"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
            
            <motion.a
              href="tel:+19152486835"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-brand-primary text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-sm transition-all hover:bg-brand-primary-light"
            >
              <Phone className="w-4 h-4" />
              <span>(915) 248-6835</span>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-brand-charcoal hover:text-brand-primary transition-colors rounded-lg focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Drawer Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Container */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-brand-bg z-50 shadow-2xl p-6 lg:hidden flex flex-col justify-between"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              <div className="flex flex-col gap-8 mt-12">
                <div className="flex justify-between items-center pb-4 border-b border-brand-primary/10">
                  <span className="font-serif text-2xl font-bold text-brand-primary">R&K Party Hall</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-6 h-6 text-brand-charcoal" />
                  </button>
                </div>
                
                <nav className="flex flex-col gap-5 text-lg font-medium">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-brand-charcoal hover:text-brand-primary transition-colors py-1 flex items-center justify-between"
                    >
                      {link.name}
                      <ChevronRight className="w-4 h-4 text-brand-secondary" />
                    </a>
                  ))}
                </nav>
              </div>

              {/* Drawer Footer Details */}
              <div className="flex flex-col gap-6 pt-6 border-t border-brand-primary/10">
                <div className="flex flex-col gap-2 text-sm text-brand-charcoal/80">
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-secondary shrink-0" /> West El Paso, TX</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-secondary shrink-0" /> (915) 248-6835</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <a 
                    href="https://www.facebook.com/p/RK-party-world-100083210288539/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-brand-charcoal hover:text-brand-primary p-2 border border-brand-primary/10 rounded-full hover:bg-brand-primary/5 transition-colors"
                  >
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://www.instagram.com/rkpartyworld/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-brand-charcoal hover:text-brand-primary p-2 border border-brand-primary/10 rounded-full hover:bg-brand-primary/5 transition-colors"
                  >
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                </div>
                <a
                  href="tel:+19152486835"
                  className="w-full bg-brand-primary text-white text-center py-3 rounded-full font-bold shadow-md hover:bg-brand-primary-light transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call to Reserve
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-12 sm:pb-20 overflow-hidden bg-[#FEF4EA] z-10">
        
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-[10%] left-[20%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-brand-secondary/35 filter blur-[60px] sm:blur-[90px] animate-float-1" />
          <div className="absolute bottom-[10%] right-[15%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-brand-primary/20 filter blur-[60px] sm:blur-[90px] animate-float-2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10 relative">
          
          {/* Hero Left Column Text */}
          <motion.div 
            className="lg:col-span-6 flex flex-col items-start gap-6 text-left max-w-2xl"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-brand-primary/5 border border-brand-primary/10 px-4 py-1.5 rounded-full text-brand-primary font-semibold text-xs tracking-wide uppercase"
              variants={fadeIn}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>West El Paso Event Venue</span>
            </motion.div>

            <motion.h1 
              className="font-serif text-[clamp(2.3rem,5.5vw,4.2rem)] font-extrabold text-brand-primary leading-[1.1] tracking-tight"
              variants={fadeIn}
            >
              Every Milestone Deserves a Party. <span className="text-brand-secondary italic font-light">Let’s Celebrate.</span>
            </motion.h1>

            <motion.p 
              className="text-base sm:text-lg text-brand-charcoal/80 leading-relaxed font-light"
              variants={fadeIn}
            >
              From birthdays to baby showers, our versatile event venue in West El Paso, TX is styled, curated, and ready to host your special day with family and friends. Accommodates up to 70 guests.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              variants={fadeIn}
            >
              {/* Shimmer Hover Estimate Button */}
              <motion.button
                onClick={() => {
                  setActiveTab("estimator");
                  document.getElementById("quotes")?.scrollIntoView({ behavior: "smooth" });
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative bg-brand-primary text-white px-8 py-4 rounded-full font-bold text-base shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-light transition-all flex items-center justify-center gap-2 group overflow-hidden"
              >
                {/* Shimmer overlay */}
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[50%] skew-x-12 -left-[50%]"
                  animate={shouldReduceMotion ? {} : { x: ["0%", "300%"] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", repeatDelay: 1 }}
                />
                <span>Build a Free Estimate</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.a
                href="tel:+19153455734"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white border-2 border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white px-8 py-4 rounded-full font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Call to Tour</span>
                <Phone className="w-4 h-4" />
              </motion.a>
            </motion.div>

            {/* Micro details banner */}
            <motion.div 
              className="flex flex-wrap items-center gap-6 mt-4 pt-6 border-t border-brand-primary/10 w-full"
              variants={fadeIn}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-secondary" />
                <span className="text-sm font-semibold text-brand-charcoal/90">Max 70 Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-secondary" />
                <span className="text-sm font-semibold text-brand-charcoal/90">Flexible Linens & Decor</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-brand-secondary fill-brand-secondary" />
                <span className="text-sm font-semibold text-brand-charcoal/90">5.0 Star Rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Right Column Image / Frame */}
          <motion.div 
            className="lg:col-span-6 relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative w-full max-w-[500px]">
              
              {/* Background solid decoration */}
              <div className="absolute inset-0 bg-brand-secondary rounded-[2rem] rotate-3 translate-x-2 translate-y-3 z-0 shadow-lg" />
              
              {/* Main Image frame */}
              <motion.div 
                className="relative z-10 overflow-hidden rounded-[2rem] border-4 border-white shadow-xl aspect-[4/3] sm:aspect-square bg-brand-primary/5"
                whileHover={{ rotate: -1.5, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800" 
                  alt="Beautiful Event Setup at RK Party Hall" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
                
                {/* Visual Glass Tag */}
                <div className="absolute bottom-4 left-4 right-4 glassmorphism-primary p-4 rounded-xl text-white flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold">Elegant & Intimate</h3>
                    <p className="text-xs text-white/80">West El Paso, Texas</p>
                  </div>
                  <span className="bg-brand-secondary text-white font-semibold text-xs py-1.5 px-3 rounded-full uppercase tracking-wider">Book Now</span>
                </div>
              </motion.div>
              
              {/* floating element */}
              <motion.div 
                className="absolute -top-6 -left-6 z-20 bg-white shadow-lg p-3 rounded-xl border border-brand-primary/10 hidden sm:flex items-center gap-3 animate-bounce"
                style={{ animationDuration: "3.5s" }}
              >
                <div className="p-2 bg-brand-primary/5 rounded-lg">
                  <Cake className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-charcoal">Birthdays & Showers</h4>
                  <p className="text-[10px] text-brand-charcoal/60">Tailored party decor</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          WELCOME / ABOUT SECTION
          ========================================== */}
      <section id="welcome" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* About Left - Double Image Stack */}
            <motion.div 
              className="lg:col-span-6 relative flex flex-col items-center sm:flex-row gap-6 justify-center"
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true, margin: "-80px" }}
              variants={scaleUp}
            >
              <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-[1.5rem] overflow-hidden border-2 border-brand-bg shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=600" 
                  alt="Champagne Toast Celebration Setup" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-103"
                  loading="lazy"
                />
              </div>

              {/* Offset Overlapping Image */}
              <div className="relative w-full max-w-[260px] aspect-[4/5] rounded-[1.5rem] overflow-hidden border-2 border-brand-bg shadow-xl sm:-translate-y-10 sm:-ml-12 bg-brand-primary/5">
                <img 
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600" 
                  alt="Vibrant Event Decor Detail" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-103"
                  loading="lazy"
                />
                
                {/* Floating micro card */}
                <div className="absolute top-4 right-4 bg-brand-primary text-white p-2.5 rounded-full shadow-md">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
              </div>
            </motion.div>

            {/* About Right - Value Narrative */}
            <motion.div 
              className="lg:col-span-6 flex flex-col items-start gap-6 text-left"
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true, margin: "-80px" }}
              variants={slideInLeft}
            >
              <div className="inline-flex items-center gap-1.5 text-brand-secondary font-bold text-xs uppercase tracking-widest">
                <span className="w-6 h-[1.5px] bg-brand-secondary" />
                <span>Our Philosophy</span>
              </div>

              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-brand-primary leading-tight">
                Welcome to R&K Party Hall
              </h2>

              <p className="text-base sm:text-lg text-brand-charcoal/80 leading-relaxed font-light">
                Because every celebration deserves a space filled with love, care, and creativity, we are dedicated to bringing your unique vision to life. Our flexible and charming West El Paso venue is ready to be transformed for your biggest days.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full py-4 border-y border-brand-primary/10">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/5 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-primary">Custom Theme Designs</h4>
                    <p className="text-xs text-brand-charcoal/70">From layout drafts to balloon structures.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/5 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-primary">Convenient Location</h4>
                    <p className="text-xs text-brand-charcoal/70">Easily accessible in West El Paso on Doniphan.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/5 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-primary">Accommodating Venue</h4>
                    <p className="text-xs text-brand-charcoal/70">Capped up to 70 guest limit for safety & comfort.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/5 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-primary">Complete Coordination</h4>
                    <p className="text-xs text-brand-charcoal/70">Optional planning services to ease stress.</p>
                  </div>
                </div>
              </div>

              <motion.a
                href="tel:+19153455734"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-brand-secondary text-white px-7 py-3.5 rounded-full font-bold shadow-md hover:bg-brand-secondary-light transition-all flex items-center gap-2"
              >
                <span>Call for Booking Questions</span>
                <Phone className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SERVICES SHOWCASE
          ========================================== */}
      <section id="services" className="py-20 bg-brand-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-secondary/10 px-3 py-1 rounded-full text-brand-secondary font-semibold text-xs tracking-wider uppercase mb-3">
              <span>What We Offer</span>
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-brand-primary mb-4 leading-tight">
              Ready to Host Your Next Milestone
            </h2>
            <p className="text-base sm:text-lg text-brand-charcoal/80 font-light leading-relaxed">
              Whether you’re planning an intimate gathering or a colorful family celebration, R&K Party Hall offers a versatile, fully customizable venue to make your event unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Service card 1 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-8 border border-brand-primary/5 shadow-md flex flex-col justify-between"
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeIn}
            >
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/5 flex items-center justify-center">
                  <Cake className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-primary">Party Hall Rental</h3>
                <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light">
                  Enjoy private access to our beautiful, air-conditioned hall setup for up to 70 guests. Perfect for birthdays, intimate showers, gender reveals, reception diners, and business mixers.
                </p>
              </div>
              <ul className="mt-6 pt-6 border-t border-brand-primary/5 flex flex-col gap-2.5 text-xs text-brand-charcoal/80">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" /> Setup of tables & chairs included</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" /> Sound controls & ambient lighting</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" /> Clean rest rooms & preparation tables</li>
              </ul>
            </motion.div>

            {/* Service card 2 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-8 border border-brand-primary/5 shadow-md flex flex-col justify-between"
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeIn}
            >
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/5 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-primary">Custom Decor & Styling</h3>
                <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light">
                  Skip the stress of styling. Our decor specialists handle everything from color theme coordination, table centerpieces, floral runners, backdrops, to customized balloon arch arrangements.
                </p>
              </div>
              <ul className="mt-6 pt-6 border-t border-brand-primary/5 flex flex-col gap-2.5 text-xs text-brand-charcoal/80">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" /> Premium colored table tablecloths</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" /> Double balloon arches and photo backdrops</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" /> Decorative tabletop centerpiece assets</li>
              </ul>
            </motion.div>

            {/* Service card 3 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-8 border border-brand-primary/5 shadow-md flex flex-col justify-between"
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeIn}
            >
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/5 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-primary">Milestone Party Planning</h3>
                <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light">
                  Let us assist in aligning vendor bookings, scheduling dessert tables, and managing logistics. Our on-site coordination keeps timelines running smoothly so you can host effortlessly.
                </p>
              </div>
              <ul className="mt-6 pt-6 border-t border-brand-primary/5 flex flex-col gap-2.5 text-xs text-brand-charcoal/80">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" /> Personal pre-planning design meetings</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" /> Dedicated assistant coordinator</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" /> Day-of timeline management & help</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          PLANNING & QUOTES (SIGNATURE MOMENT)
          ========================================== */}
      <section id="quotes" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 px-3 py-1 rounded-full text-brand-primary font-semibold text-xs tracking-wider uppercase mb-3">
              <span>Interactive Quote Hub</span>
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-brand-primary mb-4 leading-tight">
              Plan Your Occasion & Pricing
            </h2>
            <p className="text-base sm:text-lg text-brand-charcoal/80 font-light">
              Explore our transparent rates. Flip through pre-built packages or build your custom estimate in real-time below.
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-brand-bg p-1.5 rounded-full flex gap-1 shadow-inner max-w-lg w-full sm:w-auto relative">
              
              <button
                onClick={() => setActiveTab("estimator")}
                className={`relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 w-1/2 sm:w-auto cursor-pointer ${
                  activeTab === "estimator" 
                    ? "bg-brand-primary text-white shadow-md" 
                    : "text-brand-charcoal hover:text-brand-primary"
                }`}
              >
                Estimate Calculator
              </button>

              <button
                onClick={() => setActiveTab("packages")}
                className={`relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 w-1/2 sm:w-auto cursor-pointer ${
                  activeTab === "packages" 
                    ? "bg-brand-primary text-white shadow-md" 
                    : "text-brand-charcoal hover:text-brand-primary"
                }`}
              >
                Standard Packages
              </button>

            </div>
          </div>

          {/* Tab Content Display Area */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {activeTab === "estimator" && (
                <motion.div
                  key="estimator-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-brand-bg rounded-3xl p-6 sm:p-10 border border-brand-primary/5 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch"
                >
                  {/* Estimator Controls (Left Column) */}
                  <div className="lg:col-span-7 flex flex-col gap-8 text-left">
                    <h3 className="font-serif text-2xl font-bold text-brand-primary flex items-center gap-2">
                      <Sparkles className="w-6 h-6" /> Custom Quote Builder
                    </h3>
                    
                    {/* Guest Slider */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-brand-charcoal flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-brand-secondary" /> Estimated Guests
                        </label>
                        <span className="bg-brand-primary/10 text-brand-primary text-xs font-bold px-2.5 py-1 rounded-full">
                          {estimator.guests} Guests
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="70" 
                        step="5"
                        value={estimator.guests} 
                        onChange={(e) => handleEstimatorChange("guests", Number(e.target.value))}
                        className="w-full accent-brand-primary h-2 bg-brand-primary/10 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-brand-charcoal/60">
                        <span>Min: 20 guests</span>
                        <span className="text-brand-primary font-semibold">Capped: 70 guests max limit</span>
                      </div>
                    </div>

                    {/* Hours Slider */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-brand-charcoal flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-brand-secondary" /> Reservation Hours
                        </label>
                        <span className="bg-brand-primary/10 text-brand-primary text-xs font-bold px-2.5 py-1 rounded-full">
                          {estimator.hours} Hours
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="4" 
                        max="12" 
                        value={estimator.hours} 
                        onChange={(e) => handleEstimatorChange("hours", Number(e.target.value))}
                        className="w-full accent-brand-primary h-2 bg-brand-primary/10 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-brand-charcoal/60">
                        <span>Min duration: 4 hrs</span>
                        <span>Max duration: 12 hrs</span>
                      </div>
                    </div>

                    {/* Add-ons Toggles */}
                    <div className="flex flex-col gap-4">
                      <label className="text-sm font-bold text-brand-charcoal flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-brand-secondary" /> Add Optional Services
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        <label className={`border-2 rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all ${
                          estimator.linens 
                            ? "border-brand-primary bg-brand-primary/5" 
                            : "border-brand-primary/10 bg-white hover:border-brand-primary/30"
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={estimator.linens}
                            onChange={(e) => handleEstimatorChange("linens", e.target.checked)}
                            className="mt-1 accent-brand-primary cursor-pointer"
                          />
                          <div>
                            <span className="text-sm font-bold text-brand-primary block">Table Linens & Runners</span>
                            <span className="text-xs text-brand-charcoal/70 block">+$150 • Elegant themes</span>
                          </div>
                        </label>

                        <label className={`border-2 rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all ${
                          estimator.sound 
                            ? "border-brand-primary bg-brand-primary/5" 
                            : "border-brand-primary/10 bg-white hover:border-brand-primary/30"
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={estimator.sound}
                            onChange={(e) => handleEstimatorChange("sound", e.target.checked)}
                            className="mt-1 accent-brand-primary cursor-pointer"
                          />
                          <div>
                            <span className="text-sm font-bold text-brand-primary block">Sound & Light Setup</span>
                            <span className="text-xs text-brand-charcoal/70 block">+$200 • Premium HD audio</span>
                          </div>
                        </label>

                        <label className={`border-2 rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all ${
                          estimator.dessert 
                            ? "border-brand-primary bg-brand-primary/5" 
                            : "border-brand-primary/10 bg-white hover:border-brand-primary/30"
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={estimator.dessert}
                            onChange={(e) => handleEstimatorChange("dessert", e.target.checked)}
                            className="mt-1 accent-brand-primary cursor-pointer"
                          />
                          <div>
                            <span className="text-sm font-bold text-brand-primary block">Dessert Station Setup</span>
                            <span className="text-xs text-brand-charcoal/70 block">+$250 • Customized tables</span>
                          </div>
                        </label>

                        <label className={`border-2 rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all ${
                          estimator.coordinator 
                            ? "border-brand-primary bg-brand-primary/5" 
                            : "border-brand-primary/10 bg-white hover:border-brand-primary/30"
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={estimator.coordinator}
                            onChange={(e) => handleEstimatorChange("coordinator", e.target.checked)}
                            className="mt-1 accent-brand-primary cursor-pointer"
                          />
                          <div>
                            <span className="text-sm font-bold text-brand-primary block">On-Site Coordinator</span>
                            <span className="text-xs text-brand-charcoal/70 block">+$300 • Day-of logistics</span>
                          </div>
                        </label>

                      </div>
                    </div>
                  </div>

                  {/* Summary & Price Showcase (Right Column) */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-brand-primary/10 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
                    <div className="flex flex-col gap-6 text-left">
                      <h4 className="font-serif text-xl font-bold text-brand-primary border-b border-brand-primary/10 pb-4">
                        Estimated Calculation
                      </h4>
                      
                      <div className="flex flex-col gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-brand-charcoal/80">Hall Booking ({estimator.hours} Hours)</span>
                          <span className="font-semibold text-brand-charcoal">${estimator.hours * 150}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-brand-charcoal/80">Guest Capacity Tier Fee</span>
                          <span className="font-semibold text-brand-charcoal">
                            ${estimator.guests <= 30 ? 0 : estimator.guests <= 50 ? 100 : 200}
                          </span>
                        </div>

                        {estimator.linens && (
                          <div className="flex justify-between">
                            <span className="text-brand-charcoal/80">Linens & Centerpieces</span>
                            <span className="font-semibold text-brand-charcoal">+$150</span>
                          </div>
                        )}

                        {estimator.sound && (
                          <div className="flex justify-between">
                            <span className="text-brand-charcoal/80">Sound & Lighting Assets</span>
                            <span className="font-semibold text-brand-charcoal">+$200</span>
                          </div>
                        )}

                        {estimator.dessert && (
                          <div className="flex justify-between">
                            <span className="text-brand-charcoal/80">Custom Dessert Station</span>
                            <span className="font-semibold text-brand-charcoal">+$250</span>
                          </div>
                        )}

                        {estimator.coordinator && (
                          <div className="flex justify-between">
                            <span className="text-brand-charcoal/80">Event Coordinator Service</span>
                            <span className="font-semibold text-brand-charcoal">+$300</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-brand-primary/10 text-left">
                      <div className="flex justify-between items-baseline mb-6">
                        <span className="text-sm font-semibold text-brand-charcoal/80">Estimated Total</span>
                        <div className="text-brand-primary font-bold text-4xl">
                          $<Counter value={calculateTotal()} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          onClick={handleInquiryFromEstimator}
                          className="w-full bg-brand-primary text-white text-center py-3.5 rounded-full font-bold shadow-md hover:bg-brand-primary-light transition-all flex items-center justify-center gap-2"
                        >
                          <span>Lock & Request Quote Callback</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <p className="text-[10px] text-center text-brand-charcoal/60">
                          Estimates are calculated guidelines. Actual price quotes depend on custom request complexity.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "packages" && (
                <motion.div
                  key="packages-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
                >
                  {packages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ y: -6 }}
                      className="bg-brand-bg rounded-2xl p-6 sm:p-8 border border-brand-primary/5 shadow-md flex flex-col justify-between text-left"
                    >
                      <div className="flex flex-col gap-5">
                        <div className="flex justify-between items-center">
                          <div className="w-10 h-10 rounded-lg bg-brand-primary/5 flex items-center justify-center">
                            {pkg.icon}
                          </div>
                          <span className="font-bold text-2xl text-brand-primary">{pkg.price}</span>
                        </div>
                        <div>
                          <h4 className="font-serif text-lg font-bold text-brand-primary mb-1">{pkg.name}</h4>
                          <p className="text-xs text-brand-charcoal/70 leading-relaxed font-light">{pkg.description}</p>
                        </div>
                        <ul className="mt-4 pt-4 border-t border-brand-primary/5 flex flex-col gap-2.5 text-xs text-brand-charcoal/80">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <button
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            message: `Hi R&K, I am highly interested in the "${pkg.name}" (${pkg.price}) standard package. Please contact me with availability options.`,
                          }));
                          contactFormRef.current?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="mt-8 w-full bg-white hover:bg-brand-primary border-2 border-brand-primary hover:text-white text-brand-primary py-3 rounded-full text-xs font-bold transition-all text-center"
                      >
                        Inquire About Package
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ==========================================
          STATS SECTION (COUNT-UPS)
          ========================================== */}
      <section className="py-16 bg-brand-primary text-white relative overflow-hidden z-10">
        
        {/* Subtle pattern background overlays */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-6 text-center">
            
            <div className="flex flex-col gap-2">
              <span className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-tight block">
                <Counter value={70} suffix=" Max" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-secondary-light">
                Guest Seating Limit
              </span>
              <p className="text-xs text-white/70 max-w-[200px] mx-auto leading-relaxed">
                Perfect for cozy family parties and comfortable baby showers.
              </p>
            </div>

            <div className="flex flex-col gap-2 border-y sm:border-y-0 sm:border-x border-white/10 py-8 sm:py-0">
              <span className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-tight block">
                <Counter value={100} suffix="%" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-secondary-light">
                Stress-Free Setup
              </span>
              <p className="text-xs text-white/70 max-w-[200px] mx-auto leading-relaxed">
                We organize coordination and linens so you host smoothly.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-tight block flex justify-center items-baseline gap-1">
                <Counter value={5} /> <span className="text-2xl text-brand-secondary">★</span>
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-secondary-light">
                Google & FB Review Rating
              </span>
              <p className="text-xs text-white/70 max-w-[200px] mx-auto leading-relaxed">
                Five-star feedback from local West El Paso residents.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          TESTIMONIALS SECTION
          ========================================== */}
      <section id="testimonials" className="py-20 bg-brand-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-secondary/10 px-3 py-1 rounded-full text-brand-secondary font-semibold text-xs tracking-wider uppercase mb-3">
              <span>Client Stories</span>
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-brand-primary leading-tight">
              Highly Recommended Venue
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial card 1 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-8 border border-brand-primary/5 shadow-md flex flex-col justify-between text-left"
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeIn}
            >
              <div className="flex flex-col gap-4">
                <div className="flex text-brand-secondary gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-secondary" />)}
                </div>
                <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light italic">
                  "We hosted our daughter's 1st birthday here, and it was perfect! The balloon decor they put together was beautiful. The space was extremely clean and spacious enough for all 60 of our guests. Recommended highly!"
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-brand-primary/5">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-serif font-bold text-brand-primary">
                  M
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-primary">Maria S.</h4>
                  <p className="text-[10px] text-brand-charcoal/60">El Paso Resident</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial card 2 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-8 border border-brand-primary/5 shadow-md flex flex-col justify-between text-left"
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeIn}
            >
              <div className="flex flex-col gap-4">
                <div className="flex text-brand-secondary gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-secondary" />)}
                </div>
                <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light italic">
                  "R&K Party Hall was the ideal choice for my baby shower. The booking was direct, they accommodated my setup timing requests, and recommended table configurations. The guest tier package is very budget-friendly."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-brand-primary/5">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-serif font-bold text-brand-primary">
                  D
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-primary">Diana V.</h4>
                  <p className="text-[10px] text-brand-charcoal/60">El Paso Resident</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial card 3 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-8 border border-brand-primary/5 shadow-md flex flex-col justify-between text-left"
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeIn}
            >
              <div className="flex flex-col gap-4">
                <div className="flex text-brand-secondary gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-secondary" />)}
                </div>
                <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light italic">
                  "Great experience from start to finish. The owner was super responsive and helpful. The hall layout works wonderfully for family dinners or milestone anniversaries. Having the dessert tables set up was a huge help."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-brand-primary/5">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-serif font-bold text-brand-primary">
                  A
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-primary">Albert C.</h4>
                  <p className="text-[10px] text-brand-charcoal/60">Local Event Planner</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==========================================
          CTA & BOOKING FORM SECTION
          ========================================== */}
      <section id="contact" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Contact left info & map */}
            <motion.div 
              className="lg:col-span-5 flex flex-col justify-between gap-8 text-left"
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true, margin: "-80px" }}
              variants={slideInLeft}
            >
              <div className="flex flex-col gap-5">
                <div className="inline-flex items-center gap-1.5 text-brand-primary font-bold text-xs uppercase tracking-widest">
                  <span className="w-6 h-[1.5px] bg-brand-primary" />
                  <span>Reserve Your Date</span>
                </div>
                <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] font-bold text-brand-primary leading-tight">
                  Plan Your Visit & Tour
                </h2>
                <p className="text-sm text-brand-charcoal/80 font-light leading-relaxed">
                  Want to see the hall in person before booking? Give us a call or drop a message to schedule an on-site walkthrough at our Doniphan Drive location.
                </p>

                <div className="flex flex-col gap-4 mt-4 text-sm text-brand-charcoal/90">
                  <a href="https://maps.google.com/?q=6180+Doniphan+Drive+Suite+C2,+El+Paso,+TX+79932" target="_blank" rel="noreferrer" className="flex items-start gap-3 hover:text-brand-primary transition-colors group">
                    <MapPin className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold block">RK Party Hall Venue</span>
                      <span className="text-xs text-brand-charcoal/70">6180 Doniphan Drive Suite C2, El Paso, TX 79932</span>
                    </div>
                  </a>

                  <a href="tel:+19152486835" className="flex items-center gap-3 hover:text-brand-primary transition-colors group">
                    <Phone className="w-5 h-5 text-brand-secondary shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold block">Primary Inquiry Line</span>
                      <span className="text-xs text-brand-charcoal/70">(915) 248-6835</span>
                    </div>
                  </a>

                  <a href="tel:+19153455734" className="flex items-center gap-3 hover:text-brand-primary transition-colors group">
                    <Phone className="w-5 h-5 text-brand-secondary shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold block">Secondary Inquiry Line</span>
                      <span className="text-xs text-brand-charcoal/70">(915) 345-5734</span>
                    </div>
                  </a>

                  <a href="mailto:rkpartyworld@gmail.com" className="flex items-center gap-3 hover:text-brand-primary transition-colors group">
                    <Mail className="w-5 h-5 text-brand-secondary shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold block">Email Support</span>
                      <span className="text-xs text-brand-charcoal/70">rkpartyworld@gmail.com</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Interactive map placeholder/iframe */}
              <div className="h-[220px] w-full rounded-2xl overflow-hidden border border-brand-primary/10 shadow-sm relative bg-brand-bg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3387.893202167198!2d-106.6033789!3d31.8822989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86e749405d4df477%3A0xe4a00cb0df80ff7e!2s6180+Doniphan+Dr+C2%2C+El+Paso%2C+TX+79932%2C+USA!5e0!3m2!1sen!2smx!4v1782500000000!5m2!1sen!2smx" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  title="RK Party Hall Google Map Location"
                />
              </div>

            </motion.div>

            {/* Contact Right Form */}
            <motion.div 
              ref={contactFormRef}
              className="lg:col-span-7 bg-brand-bg border border-brand-primary/5 rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col justify-center"
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true, margin: "-80px" }}
              variants={scaleUp}
            >
              <h3 className="font-serif text-2xl font-bold text-brand-primary text-left mb-6">
                Request Hall Availability
              </h3>

              {formSubmitted ? (
                <motion.div 
                  className="bg-brand-secondary/10 border border-brand-secondary/20 rounded-2xl p-8 text-center flex flex-col items-center gap-4"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-secondary mb-2">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-brand-primary">Inquiry Sent Successfully!</h4>
                  <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light max-w-sm">
                    Thank you, {formData.name}. We have received your booking inquiry for {formData.date || "your requested date"}. An event coordinator will reach out to you at {formData.phone} shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 text-left">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-charcoal">Full Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="e.g. Maria Gonzalez"
                        className="w-full bg-white border border-brand-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-all text-brand-charcoal"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-charcoal">Phone Number *</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        required 
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="e.g. (915) 555-0199"
                        className="w-full bg-white border border-brand-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-all text-brand-charcoal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-charcoal">Email Address *</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="e.g. maria@gmail.com"
                        className="w-full bg-white border border-brand-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-all text-brand-charcoal"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-charcoal">Requested Event Date *</label>
                      <input 
                        type="date" 
                        name="date" 
                        required 
                        value={formData.date}
                        onChange={handleFormChange}
                        className="w-full bg-white border border-brand-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-all text-brand-charcoal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-charcoal">Guest Count *</label>
                      <select 
                        name="guestCount" 
                        value={formData.guestCount}
                        onChange={handleFormChange}
                        className="w-full bg-white border border-brand-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-all text-brand-charcoal"
                      >
                        <option value="20">20 Guests or Less</option>
                        <option value="40">21 - 40 Guests</option>
                        <option value="50">41 - 50 Guests</option>
                        <option value="70">51 - 70 Guests (Capacity Cap)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brand-charcoal">Event Category *</label>
                      <select 
                        name="eventType" 
                        value={formData.eventType}
                        onChange={handleFormChange}
                        className="w-full bg-white border border-brand-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-all text-brand-charcoal"
                      >
                        <option value="Birthday">Birthday Celebration</option>
                        <option value="Baby Shower">Baby Shower / Gender Reveal</option>
                        <option value="Wedding / Reception">Wedding / Small Reception</option>
                        <option value="Private Dinner">Intimate Dinner / Anniversary</option>
                        <option value="Other">Other Private Event</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-charcoal">Additional Notes / Custom Requests</label>
                    <textarea 
                      name="message" 
                      rows={4}
                      value={formData.message}
                      onChange={handleFormChange}
                      placeholder="Share details about theme preferences, decoration items, or custom layouts..."
                      className="w-full bg-white border border-brand-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-all text-brand-charcoal resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-brand-primary-light text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Submit Reservation Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FOOTER SECTION
          ========================================== */}
      <footer className="bg-brand-primary text-white pt-16 pb-8 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 text-left mb-12">
            
            {/* Brand details col */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <span className="font-serif text-2xl font-bold tracking-wide text-white">
                R&K <span className="font-sans font-light text-brand-secondary-light text-lg">Party Hall</span>
              </span>
              <p className="text-xs text-white/70 max-w-sm leading-relaxed font-light">
                Providing standard and fully-coordinated private event hall rentals in West El Paso, TX. Helping local families host and celebrate birthdays, baby showers, and receptions.
              </p>
              
              <div className="flex gap-4 mt-2">
                <a 
                  href="https://www.facebook.com/p/RK-party-world-100083210288539/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-white hover:text-brand-secondary-light transition-colors hover:scale-105 duration-200"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.instagram.com/rkpartyworld/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-white hover:text-brand-secondary-light transition-colors hover:scale-105 duration-200"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick links col */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-brand-secondary-light">
                Venue Sections
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs text-white/70">
                <li><a href="#welcome" className="hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Rental Services</a></li>
                <li><a href="#quotes" className="hover:text-white transition-colors">Price Estimator</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonial Reviews</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Details</a></li>
              </ul>
            </div>

            {/* Operational details col */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-brand-secondary-light">
                Office Hours & Location
              </h4>
              <ul className="flex flex-col gap-3 text-xs text-white/70">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-secondary-light shrink-0" />
                  <span>6180 Doniphan Drive Suite C2, El Paso, TX 79932</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-brand-secondary-light shrink-0" />
                  <div>
                    <span className="block font-semibold">Tours: By Appointment Only</span>
                    <span className="block text-[10px] text-white/60">Call to coordinate convenient touring hours.</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* Legal copyrights bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-white/50 text-center sm:text-left">
            <p>© {new Date().getFullYear()} R&K Party Hall. All Rights Reserved. Designed in El Paso, TX.</p>
            <p className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
