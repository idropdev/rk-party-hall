import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useInView,
  animate,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue
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

const GoogleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.18 2.69 1.17 6.64l4.096 3.125z"
    />
    <path
      fill="#34A853"
      d="M16.04 15.313c-1.07.727-2.457 1.16-4.04 1.16a7.077 7.077 0 0 1-6.733-4.856L1.17 14.743C3.18 18.692 7.27 21.382 12 21.382c3.082 0 5.864-1.018 7.955-2.773l-3.914-3.296z"
    />
    <path
      fill="#4285F4"
      d="M23.49 12.275c0-.627-.064-1.3-.182-1.91H12v3.627h6.455a5.527 5.527 0 0 1-2.418 3.618l3.914 3.296c2.29-2.11 3.54-5.21 3.54-8.63z"
    />
    <path
      fill="#FBBC05"
      d="M5.266 12.275a7.03 7.03 0 0 1 0-2.51L1.17 6.64a11.972 11.972 0 0 0 0 10.728l4.096-3.125z"
    />
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

type Language = "en" | "es";

const translations = {
  en: {
    nav: {
      welcome: "Welcome",
      services: "Services",
      quotes: "Planning & Quotes",
      testimonials: "Testimonials",
      contact: "Location & Visit",
      toggleLabel: "ES",
      toggleAria: "Switch language to Spanish",
      phone: "(915) 248-6835",
      reserve: "Call to Reserve",
    },
    hero: {
      title: "Every Milestone Deserves a Party.",
      titleAccent: "Let’s Celebrate.",
      description: "From birthdays to baby showers, our versatile event venue in West El Paso, TX is styled, curated, and ready to host your special day with family and friends. Accommodates up to 70 guests.",
      estimateButton: "Build a Free Estimate",
      tourButton: "Call to Tour",
      detail1: "Max 70 Guests",
      detail2: "Flexible Linens & Decor",
      detail3: "5.0 Star Rating",
      cardTitle: "Elegant & Intimate",
      cardSubtitle: "West El Paso, Texas",
      cardBadge: "Book Now",
      floatingTitle: "Birthdays & Showers",
      floatingSubtitle: "Tailored party decor",
    },
    about: {
      badge: "Our Philosophy",
      heading: "Welcome to R&K Party Hall",
      description: "Because every celebration deserves a space filled with love, care, and creativity, we are dedicated to bringing your unique vision to life. Our flexible and charming West El Paso venue is ready to be transformed for your biggest days.",
      card1Title: "Custom Theme Designs",
      card1Text: "From layout drafts to balloon structures.",
      card2Title: "Convenient Location",
      card2Text: "Easily accessible in West El Paso on Doniphan.",
      card3Title: "Accommodating Venue",
      card3Text: "Capped up to 70 guest limit for safety & comfort.",
      card4Title: "Complete Coordination",
      card4Text: "Optional planning services to ease stress.",
      button: "Call for Booking Questions",
    },
    services: {
      badge: "What We Offer",
      heading: "Ready to Host Your Next Milestone",
      description: "Whether you’re planning an intimate gathering or a colorful family celebration, R&K Party Hall offers a versatile, fully customizable venue to make your event unforgettable.",
      card1Title: "Party Hall Rental",
      card1Description: "Enjoy private access to our beautiful, air-conditioned hall setup for up to 70 guests. Perfect for birthdays, intimate showers, gender reveals, reception diners, and business mixers.",
      card1List: ["Setup of tables & chairs included", "Sound controls & ambient lighting", "Clean rest rooms & preparation tables"],
      card2Title: "Custom Decor & Styling",
      card2Description: "Skip the stress of styling. Our decor specialists handle everything from color theme coordination, table centerpieces, floral runners, backdrops, to customized balloon arch arrangements.",
      card2List: ["Premium colored table tablecloths", "Double balloon arches and photo backdrops", "Decorative tabletop centerpiece assets"],
      card3Title: "Milestone Party Planning",
      card3Description: "Let us assist in aligning vendor bookings, scheduling dessert tables, and managing logistics. Our on-site coordination keeps timelines running smoothly so you can host effortlessly.",
      card3List: ["Personal pre-planning design meetings", "Dedicated assistant coordinator", "Day-of timeline management & help"],
    },
    quotes: {
      badge: "Interactive Quote Hub",
      heading: "Plan Your Occasion & Pricing",
      description: "Explore our transparent rates. Flip through pre-built packages or build your custom estimate in real-time below.",
      tabEstimator: "Estimate Calculator",
      tabPackages: "Standard Packages",
      customTitle: "Custom Quote Builder",
      guestsLabel: "Estimated Guests",
      hoursLabel: "Reservation Hours",
      addOnsLabel: "Add Optional Services",
      summaryTitle: "Estimated Calculation",
      hallBooking: "Hall Booking",
      guestTier: "Guest Capacity Tier Fee",
      linens: "Linens & Centerpieces",
      sound: "Sound & Lighting Assets",
      dessert: "Custom Dessert Station",
      coordinator: "Event Coordinator Service",
      total: "Estimated Total",
      requestButton: "Lock & Request Quote Callback",
      footnote: "Estimates are calculated guidelines. Actual price quotes depend on custom request complexity.",
      packageButton: "Inquire About Package",
    },
    stats: {
      guestLimit: "Guest Seating Limit",
      guestLimitDescription: "Perfect for cozy family parties and comfortable baby showers.",
      stressFree: "Stress-Free Setup",
      stressFreeDescription: "We organize coordination and linens so you host smoothly.",
      rating: "Google & FB Review Rating",
      ratingDescription: "Five-star feedback from local West El Paso residents.",
    },
    testimonials: {
      badge: "Client Stories",
      heading: "Loved by Our Guests",
      ratingText: "Google Reviews",
      cta: "Leave a Review on Google",
      viewOnGoogle: "View on Google",
    },
    contact: {
      badge: "Reserve Your Date",
      heading: "Plan Your Visit & Tour",
      description: "Want to see the hall in person before booking? Give us a call or drop a message to schedule an on-site walkthrough at our Doniphan Drive location.",
      venueLabel: "RK Party Hall Venue",
      primaryLabel: "Primary Inquiry Line",
      secondaryLabel: "Secondary Inquiry Line",
      emailLabel: "Email Support",
      footerHeading: "Venue Sections",
      footerDescription: "Providing standard and fully-coordinated private event hall rentals in West El Paso, TX. Helping local families host and celebrate birthdays, baby showers, and receptions.",
      footerLinks: ["Our Story", "Rental Services", "Price Estimator", "Testimonial Reviews", "Contact Details"],
      officeHeading: "Office Hours & Location",
      officeDetails: "Tours: By Appointment Only",
      officeSubtext: "Call to coordinate convenient touring hours.",
      copyright: "© {year} R&K Party Hall. All Rights Reserved. Designed in El Paso, TX.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
  },
  es: {
    nav: {
      welcome: "Bienvenida",
      services: "Servicios",
      quotes: "Planificación y Cotizaciones",
      testimonials: "Testimonios",
      contact: "Ubicación y Visita",
      toggleLabel: "EN",
      toggleAria: "Cambiar el idioma al inglés",
      phone: "(915) 248-6835",
      reserve: "Llamar para Reservar",
    },
    hero: {
      title: "Cada Hito Merece una Fiesta.",
      titleAccent: "Celebremos.",
      description: "Desde cumpleaños hasta showers para bebé, nuestro versátil salón para eventos en West El Paso, TX está listo para recibir su día especial con familiares y amigos. Acepta hasta 70 invitados.",
      estimateButton: "Crear una Cotización Gratis",
      tourButton: "Llamar para Recorrer",
      detail1: "Hasta 70 Invitados",
      detail2: "Linos y Decoración Flexibles",
      detail3: "Calificación de 5.0 Estrellas",
      cardTitle: "Elegante e Íntimo",
      cardSubtitle: "West El Paso, Texas",
      cardBadge: "Reservar Ya",
      floatingTitle: "Cumpleaños y Baby Showers",
      floatingSubtitle: "Decoración a la medida",
    },
    about: {
      badge: "Nuestra Filosofía",
      heading: "Bienvenido a R&K Party Hall",
      description: "Porque cada celebración merece un espacio lleno de amor, cuidado y creatividad, nos dedicamos a dar vida a su visión única. Nuestro acogedor salón en West El Paso está listo para transformarse para sus días más especiales.",
      card1Title: "Diseños de Temas Personalizados",
      card1Text: "Desde borradores de distribución hasta estructuras de globos.",
      card2Title: "Ubicación Conveniente",
      card2Text: "Fácilmente accesible en West El Paso en Doniphan.",
      card3Title: "Salón que Acomoda",
      card3Text: "Capacidad máxima de 70 invitados para seguridad y comodidad.",
      card4Title: "Coordinación Completa",
      card4Text: "Servicios opcionales de planificación para aliviar el estrés.",
      button: "Llamar para Preguntas de Reserva",
    },
    services: {
      badge: "Lo Que Ofrecemos",
      heading: "Listos para Recibir su Próximo Hito",
      description: "Ya sea que esté planeando una reunión íntima o una celebración familiar colorida, R&K Party Hall ofrece un salón versátil y totalmente personalizable para hacer que su evento sea inolvidable.",
      card1Title: "Renta del Salón",
      card1Description: "Disfrute del acceso privado a nuestro hermoso salón con aire acondicionado para hasta 70 invitados. Ideal para cumpleaños, showers íntimos, revelaciones de género, cenas de recepción y reuniones de negocios.",
      card1List: ["Incluye montaje de mesas y sillas", "Controles de sonido e iluminación ambiental", "Baños limpios y mesas de preparación"],
      card2Title: "Decoración y Estilo Personalizado",
      card2Description: "Evite el estrés de la decoración. Nuestros especialistas se encargan de todo, desde la coordinación de colores hasta centros de mesa, corredores florales, fondos y arcos de globos personalizados.",
      card2List: ["Manteles de mesa de colores premium", "Arcos dobles de globos y fondos para fotos", "Elementos decorativos para mesas"],
      card3Title: "Planeación de Eventos Especiales",
      card3Description: "Permítanos ayudar con reservas de proveedores, programación de mesas de postres y logística. Nuestra coordinación en sitio mantiene todo en orden para que usted disfrute sin preocupaciones.",
      card3List: ["Reuniones de diseño previas", "Coordinador asistente dedicado", "Gestión y ayuda del día del evento"],
    },
    quotes: {
      badge: "Centro Interactivo de Cotizaciones",
      heading: "Planifique su Ocasión y Precio",
      description: "Explore nuestras tarifas transparentes. Revise paquetes predefinidos o construya su cotización en tiempo real a continuación.",
      tabEstimator: "Calculadora de Cotización",
      tabPackages: "Paquetes Estándar",
      customTitle: "Constructor de Cotización Personalizada",
      guestsLabel: "Invitados Estimados",
      hoursLabel: "Horas de Reservación",
      addOnsLabel: "Agregar Servicios Opcionales",
      summaryTitle: "Cálculo Estimado",
      hallBooking: "Reserva del Salón",
      guestTier: "Cargo por Nivel de Capacidad",
      linens: "Linos y Centros de Mesa",
      sound: "Sonido e Iluminación",
      dessert: "Estación de Postres Personalizada",
      coordinator: "Servicio de Coordinador de Eventos",
      total: "Total Estimado",
      requestButton: "Guardar y Solicitar Llamada de Cotización",
      footnote: "Las estimaciones son guías calculadas. Los precios reales dependen de la complejidad de la solicitud personalizada.",
      packageButton: "Consultar sobre el Paquete",
    },
    stats: {
      guestLimit: "Límite de Asientos",
      guestLimitDescription: "Perfecto para fiestas familiares y baby showers cómodos.",
      stressFree: "Montaje sin Estrés",
      stressFreeDescription: "Organizamos la coordinación y los linos para que usted disfrute.",
      rating: "Calificación de Google y Facebook",
      ratingDescription: "Comentarios de cinco estrellas de residentes locales de West El Paso.",
    },
    testimonials: {
      badge: "Historias de Clientes",
      heading: "Amado por Nuestros Invitados",
      ratingText: "Reseñas de Google",
      cta: "Dejar una Reseña en Google",
      viewOnGoogle: "Ver en Google",
    },
    contact: {
      badge: "Reserve su Fecha",
      heading: "Planifique su Visita y Recorrido",
      description: "¿Quiere ver el salón en persona antes de reservar? Llámenos o envíenos un mensaje para programar una visita en la ubicación de Doniphan Drive.",
      venueLabel: "Salón RK Party Hall",
      primaryLabel: "Línea Principal de Consultas",
      secondaryLabel: "Línea Secundaria de Consultas",
      emailLabel: "Soporte por Correo",
      footerHeading: "Secciones del Salón",
      footerDescription: "Ofrecemos renta de salones privados estándar y totalmente coordinados en West El Paso, TX. Ayudamos a familias locales a celebrar cumpleaños, baby showers y recepciones.",
      footerLinks: ["Nuestra Historia", "Servicios de Renta", "Estimador de Precios", "Reseñas de Testimonios", "Detalles de Contacto"],
      officeHeading: "Horario de Oficina y Ubicación",
      officeDetails: "Tours: Solo con Cita",
      officeSubtext: "Llame para coordinar horarios de recorrido.",
      copyright: "© {year} R&K Party Hall. Todos los Derechos Reservados. Diseñado en El Paso, TX.",
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio",
    },
  },
} as const;

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

interface GoogleReviewItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  time: string;
  text: string;
  avatarBg: string;
  avatarInitials: string;
  url?: string;
}

const fallbackReviews: GoogleReviewItem[] = [
  {
    id: "rev-1",
    name: "Josue Olivas",
    role: "Local Guide · 25 reviews",
    rating: 5,
    time: "a month ago",
    text: "This hall is truly a 5 star rating from the planning till the day of the event every step the owners are always there and willing to help me as far the Aesthetic: The space is modern and versatile, designed to be easily customized for specific themes.\n\nDesign Services: They offer professional planning and custom decor, including specialty balloon backdrops and styled tablescapes.",
    avatarBg: "bg-brand-primary text-white font-serif",
    avatarInitials: "JO",
    url: "https://www.google.com/maps/place/RK+Party+Hall/@31.8776014,-106.5928449,17z/data=!3m1!4b1!4m6!3m5!1s0x86ddf913831200f1:0x1903d3fdecca3cf!8m2!3d31.8776014!4d-106.5928449!16s%2Fg%2F11yp_4yfxg"
  },
  {
    id: "rev-2",
    name: "George K",
    role: "Local Guide · 28 reviews · 5 photos",
    rating: 5,
    time: "6 days ago",
    text: "I had an amazing experience at this party hall! The venue was clean, spacious, and beautifully maintained. Everything was set up perfectly, and the staff was friendly, professional, and very helpful throughout the entire event. The space was perfect for our guests, and everyone had a wonderful time. If you're looking for a great place to celebrate a birthday, baby shower, graduation, or any special occasion, I highly recommend this party hall. I will definitely be booking again in the future! ⭐⭐⭐⭐⭐",
    avatarBg: "bg-purple-600 text-white font-serif",
    avatarInitials: "GK",
    url: "https://www.google.com/maps/place/RK+Party+Hall/@31.8776014,-106.5928449,17z/data=!3m1!4b1!4m6!3m5!1s0x86ddf913831200f1:0x1903d3fdecca3cf!8m2!3d31.8776014!4d-106.5928449!16s%2Fg%2F11yp_4yfxg"
  }
];

// ==========================================
// HERO BALLOONS — interactive 3D balloon field
// ==========================================
interface BalloonSpec {
  id: number;
  x: number;      // % across hero width
  y: number;      // % down hero height
  size: number;   // rendered width in px
  depth: number;  // 0 = far, 1 = near (drives push force, shadow, blur)
  color: number;  // index into BALLOON_PALETTE
}

// Brand-tinted latex tones: berry, sage, peach, blush, soft gold, pearl cream
const BALLOON_PALETTE = [
  { light: "#a8324e", base: "#7c1a36", dark: "#3f0717" }, // berry
  { light: "#b9cfb0", base: "#87a07e", dark: "#5a7253" }, // sage
  { light: "#ffdcbc", base: "#f2b184", dark: "#c97f4e" }, // peach
  { light: "#ffd3de", base: "#eda4b6", dark: "#bd6d84" }, // blush
  { light: "#ffe4ad", base: "#e7bc6a", dark: "#b3852f" }, // soft gold
  { light: "#ffffff", base: "#fdf0e0", dark: "#dbbf9f" }, // pearl cream
];

// Field is denser on the right (where the old image frame sat) but drifts
// across the whole hero. Big/near balloons right, small/far ones scattered.
const BALLOON_SPECS: BalloonSpec[] = [
  { id: 0,  x: 62, y: 18, size: 150, depth: 0.9,  color: 0 },
  { id: 1,  x: 79, y: 46, size: 190, depth: 1.0,  color: 3 },
  { id: 2,  x: 90, y: 14, size: 120, depth: 0.75, color: 1 },
  { id: 3,  x: 70, y: 76, size: 135, depth: 0.85, color: 4 },
  { id: 4,  x: 55, y: 52, size: 95,  depth: 0.55, color: 2 },
  { id: 5,  x: 89, y: 72, size: 105, depth: 0.65, color: 0 },
  { id: 6,  x: 48, y: 10, size: 70,  depth: 0.4,  color: 5 },
  { id: 7,  x: 97, y: 40, size: 80,  depth: 0.5,  color: 2 },
  { id: 8,  x: 40, y: 84, size: 60,  depth: 0.35, color: 1 },
  { id: 9,  x: 30, y: 8,  size: 55,  depth: 0.3,  color: 3 },
  { id: 10, x: 8,  y: 72, size: 75,  depth: 0.45, color: 4 },
  { id: 11, x: 4,  y: 20, size: 50,  depth: 0.3,  color: 0 },
  { id: 12, x: 20, y: 92, size: 48,  depth: 0.28, color: 2 },
  { id: 13, x: 60, y: 94, size: 88,  depth: 0.6,  color: 1 },
  { id: 14, x: 85, y: 94, size: 70,  depth: 0.5,  color: 5 },
  { id: 15, x: 16, y: 44, size: 42,  depth: 0.25, color: 3 },
];

const BalloonShape: React.FC<{ spec: BalloonSpec }> = ({ spec }) => {
  const c = BALLOON_PALETTE[spec.color];
  const gradId = `balloon-grad-${spec.id}`;
  return (
    <svg width={spec.size} height={spec.size * 1.4} viewBox="0 0 100 140" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="52%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      {/* curled string */}
      <path d="M50 112 q 8 8 0 16 q -9 7 0 12" stroke={c.dark} strokeWidth="1.6" opacity="0.45" fill="none" strokeLinecap="round" />
      {/* balloon body */}
      <path d="M50 4 C26 4 9 24 9 50 C9 77 31 98 50 106 C69 98 91 77 91 50 C91 24 74 4 50 4 Z" fill={`url(#${gradId})`} />
      {/* knot */}
      <path d="M44 105 Q50 111 56 105 L52 114 L48 114 Z" fill={c.dark} opacity="0.9" />
      {/* specular highlights */}
      <ellipse cx="34" cy="32" rx="11" ry="18" fill="white" opacity="0.35" transform="rotate(-22 34 32)" />
      <circle cx="28" cy="52" r="4" fill="white" opacity="0.18" />
    </svg>
  );
};

interface BalloonHandle {
  px: MotionValue<number>;
  py: MotionValue<number>;
}

const Balloon: React.FC<{
  spec: BalloonSpec;
  interactive: boolean;
  reduced: boolean;
  register: (id: number, handle: BalloonHandle) => () => void;
}> = ({ spec, interactive, reduced, register }) => {
  // Physics offsets — springs give the shove + wobble + drift-back feel.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springCfg = {
    stiffness: 42 + spec.depth * 26,
    damping: 7 + spec.depth * 3,
    mass: 0.8 + (1 - spec.depth) * 0.5,
  };
  const sx = useSpring(px, springCfg);
  const sy = useSpring(py, springCfg);
  const rotate = useTransform(sx, [-90, 90], [-14, 14]);

  useEffect(() => {
    if (!interactive) return;
    return register(spec.id, { px, py });
  }, [interactive, register, spec.id, px, py]);

  const bobDuration = 4.2 + (spec.id % 5) * 0.9;
  const bobDelay = (spec.id % 7) * 0.4;
  const bobAmp = 6 + spec.depth * 10;
  const sway = 1.5 + spec.depth * 2.5;

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{
        left: `${spec.x}%`,
        top: `${spec.y}%`,
        marginLeft: -spec.size / 2,
        marginTop: -(spec.size * 1.4) / 2,
        x: sx,
        y: sy,
        rotate,
        zIndex: Math.round(spec.depth * 10),
        filter: `drop-shadow(0 ${Math.round(6 + spec.depth * 12)}px ${Math.round(10 + spec.depth * 10)}px rgba(88,12,34,0.18)) blur(${((1 - spec.depth) * 2.2).toFixed(1)}px)`,
        opacity: 0.55 + spec.depth * 0.45,
      }}
    >
      {/* Idle bob layer — kept separate so it never fights the physics springs */}
      <motion.div
        animate={reduced ? undefined : {
          y: [0, -bobAmp, 0],
          rotate: [-sway, sway, -sway],
          scale: [1, 1.02, 1],
        }}
        transition={reduced ? undefined : {
          duration: bobDuration,
          delay: bobDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <BalloonShape spec={spec} />
      </motion.div>
    </motion.div>
  );
};

const HeroBalloons: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const handles = useRef<Map<number, BalloonHandle>>(new Map());
  const cursor = useRef<{ x: number; y: number } | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const [env] = useState(() => {
    if (typeof window === "undefined") return { fine: false, small: false };
    return {
      fine: window.matchMedia("(hover: hover) and (pointer: fine)").matches,
      small: window.matchMedia("(max-width: 640px)").matches,
    };
  });

  const interactive = env.fine && !shouldReduceMotion;
  // Fewer balloons on small screens (no hover there anyway)
  const specs = env.small ? BALLOON_SPECS.filter((s) => s.depth >= 0.5) : BALLOON_SPECS;

  const register = useCallback((id: number, handle: BalloonHandle) => {
    handles.current.set(id, handle);
    return () => {
      handles.current.delete(id);
    };
  }, []);

  useEffect(() => {
    if (!interactive) return;

    const onMove = (e: PointerEvent) => {
      cursor.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      cursor.current = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);

    let frame = 0;
    const tick = () => {
      const el = containerRef.current;
      const c = cursor.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const inView = rect.bottom > 0 && rect.top < window.innerHeight;
        handles.current.forEach((handle, id) => {
          const spec = BALLOON_SPECS[id];
          if (!spec) return;
          let tx = 0;
          let ty = 0;
          if (c && inView) {
            // Current balloon center (base spot + a share of its live offset)
            const bx = rect.left + (spec.x / 100) * rect.width + handle.px.get() * 0.35;
            const by = rect.top + (spec.y / 100) * rect.height + handle.py.get() * 0.35;
            const dx = bx - c.x;
            const dy = by - c.y;
            const dist = Math.hypot(dx, dy);
            const radius = spec.size * 0.85 + 120;
            if (dist < radius && dist > 0.001) {
              const falloff = 1 - dist / radius;
              // Near balloons shove harder; squared falloff feels soft & buoyant
              const push = falloff * falloff * (55 + spec.depth * 70);
              tx = (dx / dist) * push;
              ty = (dy / dist) * push * 0.85;
            }
          }
          handle.px.set(tx);
          handle.py.set(ty);
        });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {specs.map((spec) => (
        <Balloon
          key={spec.id}
          spec={spec}
          interactive={interactive}
          reduced={!!shouldReduceMotion}
          register={register}
        />
      ))}
    </div>
  );
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
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return window.localStorage.getItem("rk-language") === "es" ? "es" : "en";
  });

  const shouldReduceMotion = useReducedMotion();
  const copy = translations[language];
  const [reviews, setReviews] = useState<GoogleReviewItem[]>(fallbackReviews);
  const [googleStats, setGoogleStats] = useState<{ rating: number; total: number } | null>(null);

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
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    let isMounted = true;

    fetch('/api/reviews')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load Google reviews');
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;

        if (data?.reviews?.length) {
          const mappedReviews = data.reviews.slice(0, 6).map((review: any, index: number) => ({
            id: `google-${index}`,
            name: review.author_name || 'Google Reviewer',
            role: 'Google Review',
            rating: review.rating || 5,
            time: review.relative_time_description || 'Recently reviewed',
            text: review.text || 'Great experience!',
            avatarBg: index % 2 === 0 ? 'bg-brand-primary text-white font-serif' : 'bg-purple-600 text-white font-serif',
            avatarInitials: (review.author_name || 'GR')
              .split(' ')
              .slice(0, 2)
              .map((part: string) => part[0])
              .join('')
              .toUpperCase(),
            url: review.author_url || "https://www.google.com/maps/place/RK+Party+Hall/@31.8776014,-106.5928449,17z/data=!3m1!4b1!4m6!3m5!1s0x86ddf913831200f1:0x1903d3fdecca3cf!8m2!3d31.8776014!4d-106.5928449!16s%2Fg%2F11yp_4yfxg",
          }));

          setReviews(mappedReviews);
        }

        if (data?.rating) {
          setGoogleStats({
            rating: data.rating,
            total: data.user_ratings_total || 0,
          });
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        console.warn('Using fallback reviews:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("rk-language", language);
  }, [language]);

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
    { name: copy.nav.welcome, href: "#welcome" },
    { name: copy.nav.services, href: "#services" },
    { name: copy.nav.quotes, href: "#quotes" },
    { name: copy.nav.testimonials, href: "#testimonials" },
    { name: copy.nav.contact, href: "#contact" }
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
            <img src="/rk-logo.png" alt="R&K Party Hall Logo" className="h-16 w-16 sm:h-20 sm:w-20 object-contain transition-all group-hover:opacity-85" />
            <span className="font-serif text-lg sm:text-xl font-bold text-brand-primary tracking-wide transition-all group-hover:opacity-85 hidden xs:inline">
              R&K <span className="font-sans font-light text-brand-secondary text-sm sm:text-base">Party Hall</span>
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
          <div className="hidden lg:flex items-center gap-4">
            <button
              type="button"
              onClick={() => setLanguage((prev) => (prev === "en" ? "es" : "en"))}
              aria-label={copy.nav.toggleAria}
              className="rounded-full border border-brand-primary/20 bg-white/80 px-3.5 py-2 text-sm font-semibold text-brand-primary shadow-sm backdrop-blur transition hover:bg-brand-primary hover:text-white"
            >
              {copy.nav.toggleLabel}
            </button>
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
              <span>{copy.nav.phone}</span>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setLanguage((prev) => (prev === "en" ? "es" : "en"))}
              aria-label={copy.nav.toggleAria}
              className="rounded-full border border-brand-primary/20 bg-white/80 px-3 py-2 text-sm font-semibold text-brand-primary shadow-sm"
            >
              {copy.nav.toggleLabel}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-charcoal hover:text-brand-primary transition-colors rounded-lg focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
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

        {/* Interactive 3D balloon field — fills the hero, pushes away from cursor */}
        <HeroBalloons />

        {/* Readability scrim behind headline copy */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#FEF4EA]/85 via-[#FEF4EA]/40 to-transparent lg:from-[#FEF4EA]/70 lg:via-[#FEF4EA]/25" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center z-10 relative">

          {/* Hero Text Column */}
          <motion.div
            className="flex flex-col items-start gap-6 text-left max-w-2xl"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="font-serif text-[clamp(2.3rem,5.5vw,4.2rem)] font-extrabold text-brand-primary leading-[1.1] tracking-tight"
              variants={fadeIn}
            >
              {copy.hero.title} <span className="text-brand-secondary italic font-light">{copy.hero.titleAccent}</span>
            </motion.h1>

            <motion.p 
              className="text-base sm:text-lg text-brand-charcoal/80 leading-relaxed font-light"
              variants={fadeIn}
            >
              {copy.hero.description}
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
                <span>{copy.hero.estimateButton}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.a
                href="tel:+19153455734"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white border-2 border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white px-8 py-4 rounded-full font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{copy.hero.tourButton}</span>
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
                <span className="text-sm font-semibold text-brand-charcoal/90">{copy.hero.detail1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-secondary" />
                <span className="text-sm font-semibold text-brand-charcoal/90">{copy.hero.detail2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-brand-secondary fill-brand-secondary" />
                <span className="text-sm font-semibold text-brand-charcoal/90">{copy.hero.detail3}</span>
              </div>
            </motion.div>
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
                <span>{copy.about.badge}</span>
              </div>

              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-brand-primary leading-tight">
                {copy.about.heading}
              </h2>

              <p className="text-base sm:text-lg text-brand-charcoal/80 leading-relaxed font-light">
                {copy.about.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full py-4 border-y border-brand-primary/10">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/5 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-primary">{copy.about.card1Title}</h4>
                    <p className="text-xs text-brand-charcoal/70">{copy.about.card1Text}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/5 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-primary">{copy.about.card2Title}</h4>
                    <p className="text-xs text-brand-charcoal/70">{copy.about.card2Text}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/5 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-primary">{copy.about.card3Title}</h4>
                    <p className="text-xs text-brand-charcoal/70">{copy.about.card3Text}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/5 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-primary">{copy.about.card4Title}</h4>
                    <p className="text-xs text-brand-charcoal/70">{copy.about.card4Text}</p>
                  </div>
                </div>
              </div>

              <motion.a
                href="tel:+19153455734"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-brand-secondary text-white px-7 py-3.5 rounded-full font-bold shadow-md hover:bg-brand-secondary-light transition-all flex items-center gap-2"
              >
                <span>{copy.about.button}</span>
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
              <span>{copy.services.badge}</span>
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-brand-primary mb-4 leading-tight">
              {copy.services.heading}
            </h2>
            <p className="text-base sm:text-lg text-brand-charcoal/80 font-light leading-relaxed">
              {copy.services.description}
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
                <h3 className="font-serif text-xl font-bold text-brand-primary">{copy.services.card1Title}</h3>
                <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light">
                  {copy.services.card1Description}
                </p>
              </div>
              <ul className="mt-6 pt-6 border-t border-brand-primary/5 flex flex-col gap-2.5 text-xs text-brand-charcoal/80">
                {copy.services.card1List.map((item) => (
                  <li key={item} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" /> {item}</li>
                ))}
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
                <h3 className="font-serif text-xl font-bold text-brand-primary">{copy.services.card2Title}</h3>
                <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light">
                  {copy.services.card2Description}
                </p>
              </div>
              <ul className="mt-6 pt-6 border-t border-brand-primary/5 flex flex-col gap-2.5 text-xs text-brand-charcoal/80">
                {copy.services.card2List.map((item) => (
                  <li key={item} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" /> {item}</li>
                ))}
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
                <h3 className="font-serif text-xl font-bold text-brand-primary">{copy.services.card3Title}</h3>
                <p className="text-sm text-brand-charcoal/80 leading-relaxed font-light">
                  {copy.services.card3Description}
                </p>
              </div>
              <ul className="mt-6 pt-6 border-t border-brand-primary/5 flex flex-col gap-2.5 text-xs text-brand-charcoal/80">
                {copy.services.card3List.map((item) => (
                  <li key={item} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" /> {item}</li>
                ))}
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
              <span>{copy.quotes.badge}</span>
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-brand-primary mb-4 leading-tight">
              {copy.quotes.heading}
            </h2>
            <p className="text-base sm:text-lg text-brand-charcoal/80 font-light">
              {copy.quotes.description}
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
                {copy.quotes.tabEstimator}
              </button>

              <button
                onClick={() => setActiveTab("packages")}
                className={`relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 w-1/2 sm:w-auto cursor-pointer ${
                  activeTab === "packages" 
                    ? "bg-brand-primary text-white shadow-md" 
                    : "text-brand-charcoal hover:text-brand-primary"
                }`}
              >
                {copy.quotes.tabPackages}
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
                      <Sparkles className="w-6 h-6" /> {copy.quotes.customTitle}
                    </h3>
                    
                    {/* Guest Slider */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-brand-charcoal flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-brand-secondary" /> {copy.quotes.guestsLabel}
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
                          <Clock className="w-4 h-4 text-brand-secondary" /> {copy.quotes.hoursLabel}
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
                        <Palette className="w-4 h-4 text-brand-secondary" /> {copy.quotes.addOnsLabel}
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
                        {copy.quotes.summaryTitle}
                      </h4>
                      
                      <div className="flex flex-col gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-brand-charcoal/80">{copy.quotes.hallBooking} ({estimator.hours} Hours)</span>
                          <span className="font-semibold text-brand-charcoal">${estimator.hours * 150}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-brand-charcoal/80">{copy.quotes.guestTier}</span>
                          <span className="font-semibold text-brand-charcoal">
                            ${estimator.guests <= 30 ? 0 : estimator.guests <= 50 ? 100 : 200}
                          </span>
                        </div>

                        {estimator.linens && (
                          <div className="flex justify-between">
                            <span className="text-brand-charcoal/80">{copy.quotes.linens}</span>
                            <span className="font-semibold text-brand-charcoal">+$150</span>
                          </div>
                        )}

                        {estimator.sound && (
                          <div className="flex justify-between">
                            <span className="text-brand-charcoal/80">{copy.quotes.sound}</span>
                            <span className="font-semibold text-brand-charcoal">+$200</span>
                          </div>
                        )}

                        {estimator.dessert && (
                          <div className="flex justify-between">
                            <span className="text-brand-charcoal/80">{copy.quotes.dessert}</span>
                            <span className="font-semibold text-brand-charcoal">+$250</span>
                          </div>
                        )}

                        {estimator.coordinator && (
                          <div className="flex justify-between">
                            <span className="text-brand-charcoal/80">{copy.quotes.coordinator}</span>
                            <span className="font-semibold text-brand-charcoal">+$300</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-brand-primary/10 text-left">
                      <div className="flex justify-between items-baseline mb-6">
                        <span className="text-sm font-semibold text-brand-charcoal/80">{copy.quotes.total}</span>
                        <div className="text-brand-primary font-bold text-4xl">
                          $<Counter value={calculateTotal()} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          onClick={handleInquiryFromEstimator}
                          className="w-full bg-brand-primary text-white text-center py-3.5 rounded-full font-bold shadow-md hover:bg-brand-primary-light transition-all flex items-center justify-center gap-2"
                        >
                          <span>{copy.quotes.requestButton}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <p className="text-[10px] text-center text-brand-charcoal/60">
                          {copy.quotes.footnote}
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
                          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="mt-8 w-full bg-white hover:bg-brand-primary border-2 border-brand-primary hover:text-white text-brand-primary py-3 rounded-full text-xs font-bold transition-all text-center"
                      >
                        {copy.quotes.packageButton}
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
                {copy.stats.guestLimit}
              </span>
              <p className="text-xs text-white/70 max-w-[200px] mx-auto leading-relaxed">
                {copy.stats.guestLimitDescription}
              </p>
            </div>

            <div className="flex flex-col gap-2 border-y sm:border-y-0 sm:border-x border-white/10 py-8 sm:py-0">
              <span className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-tight block">
                <Counter value={100} suffix="%" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-secondary-light">
                {copy.stats.stressFree}
              </span>
              <p className="text-xs text-white/70 max-w-[200px] mx-auto leading-relaxed">
                {copy.stats.stressFreeDescription}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-tight block flex justify-center items-baseline gap-1">
                <Counter value={5} /> <span className="text-2xl text-brand-secondary">★</span>
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-secondary-light">
                {copy.stats.rating}
              </span>
              <p className="text-xs text-white/70 max-w-[200px] mx-auto leading-relaxed">
                {copy.stats.ratingDescription}
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
              <span>{copy.testimonials.badge}</span>
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-brand-primary leading-tight mb-4">
              {copy.testimonials.heading}
            </h2>
            <div className="flex justify-center items-center gap-2 mt-2">
              <div className="flex text-amber-500 gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
              </div>
              <span className="text-sm font-semibold text-brand-charcoal">
                {googleStats ? `${googleStats.rating.toFixed(1)} Stars · ${googleStats.total} ${copy.testimonials.ratingText}` : `5.0 Stars (${copy.testimonials.ratingText})`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-8 border border-brand-primary/5 shadow-md flex flex-col justify-between text-left relative"
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeIn}
              >
                <div className="flex flex-col gap-4">
                  {/* Google Logo at Top Right */}
                  <div className="absolute top-6 right-6">
                    <GoogleIcon className="w-5 h-5 opacity-90" />
                  </div>
                  
                  <div className="flex text-amber-500 gap-0.5">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  
                  <p className="text-sm text-brand-charcoal/90 leading-relaxed font-light whitespace-pre-line">
                    "{review.text}"
                  </p>
                </div>

                <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-brand-primary/5">
                  <div className="flex items-center gap-3">
                    {/* Avatar Container with Local Guide gold star */}
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full ${review.avatarBg} flex items-center justify-center font-bold text-sm shadow-inner`}>
                        {review.avatarInitials}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 bg-amber-500 text-white p-0.5 rounded-full border border-white flex items-center justify-center shadow-sm">
                        <Star className="w-1.5 h-1.5 fill-white text-white" />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-bold text-brand-primary flex items-center gap-1.5">
                        {review.name}
                      </h4>
                      <p className="text-[10px] text-brand-charcoal/70">
                        {review.role} • <span className="text-brand-charcoal/50 font-normal">{review.time}</span>
                      </p>
                    </div>
                  </div>

                  {review.url && (
                    <a
                      href={review.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:text-amber-700 transition-colors group"
                    >
                      {copy.testimonials.viewOnGoogle}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Leave a Review CTA */}
          <div className="flex justify-center mt-12">
            <motion.a
              href="https://search.google.com/local/writereview?placeid=0x86ddf913831200f1:0x1903d3fdecca3cf"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-secondary text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-amber-600 transition-all duration-300"
            >
              <Star className="w-5 h-5 fill-white text-white" />
              <span>{copy.testimonials.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>
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
              className="lg:col-span-12 flex flex-col justify-between gap-8 text-left"
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true, margin: "-80px" }}
              variants={slideInLeft}
            >
              <div className="flex flex-col gap-5">
                <div className="inline-flex items-center gap-1.5 text-brand-primary font-bold text-xs uppercase tracking-widest">
                  <span className="w-6 h-[1.5px] bg-brand-primary" />
                  <span>{copy.contact.badge}</span>
                </div>
                <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] font-bold text-brand-primary leading-tight">
                  {copy.contact.heading}
                </h2>
                <p className="text-sm text-brand-charcoal/80 font-light leading-relaxed">
                  {copy.contact.description}
                </p>

                <div className="flex flex-col gap-4 mt-4 text-sm text-brand-charcoal/90">
                  <a href="https://maps.google.com/?q=6180+Doniphan+Drive+Suite+C2,+El+Paso,+TX+79932" target="_blank" rel="noreferrer" className="flex items-start gap-3 hover:text-brand-primary transition-colors group">
                    <MapPin className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold block">{copy.contact.venueLabel}</span>
                      <span className="text-xs text-brand-charcoal/70">6180 Doniphan Drive Suite C2, El Paso, TX 79932</span>
                    </div>
                  </a>

                  <a href="tel:+19152486835" className="flex items-center gap-3 hover:text-brand-primary transition-colors group">
                    <Phone className="w-5 h-5 text-brand-secondary shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold block">{copy.contact.primaryLabel}</span>
                      <span className="text-xs text-brand-charcoal/70">(915) 248-6835</span>
                    </div>
                  </a>

                  <a href="tel:+19153455734" className="flex items-center gap-3 hover:text-brand-primary transition-colors group">
                    <Phone className="w-5 h-5 text-brand-secondary shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold block">{copy.contact.secondaryLabel}</span>
                      <span className="text-xs text-brand-charcoal/70">(915) 345-5734</span>
                    </div>
                  </a>

                  <a href="mailto:rkpartyworld@gmail.com" className="flex items-center gap-3 hover:text-brand-primary transition-colors group">
                    <Mail className="w-5 h-5 text-brand-secondary shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold block">{copy.contact.emailLabel}</span>
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
              <div className="flex items-center gap-3">
                <img src="/rk-logo.png" alt="R&K Party Hall Logo" className="h-20 w-20 object-contain" />
                <span className="font-serif text-2xl font-bold tracking-wide text-white">
                  R&K <span className="font-sans font-light text-brand-secondary-light text-lg">Party Hall</span>
                </span>
              </div>
              <p className="text-xs text-white/70 max-w-sm leading-relaxed font-light">
                {copy.contact.footerDescription}
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
                {copy.contact.footerHeading}
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs text-white/70">
                <li><a href="#welcome" className="hover:text-white transition-colors">{copy.contact.footerLinks[0]}</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">{copy.contact.footerLinks[1]}</a></li>
                <li><a href="#quotes" className="hover:text-white transition-colors">{copy.contact.footerLinks[2]}</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">{copy.contact.footerLinks[3]}</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">{copy.contact.footerLinks[4]}</a></li>
              </ul>
            </div>

            {/* Operational details col */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-brand-secondary-light">
                {copy.contact.officeHeading}
              </h4>
              <ul className="flex flex-col gap-3 text-xs text-white/70">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-secondary-light shrink-0" />
                  <span>6180 Doniphan Drive Suite C2, El Paso, TX 79932</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-brand-secondary-light shrink-0" />
                  <div>
                    <span className="block font-semibold">{copy.contact.officeDetails}</span>
                    <span className="block text-[10px] text-white/60">{copy.contact.officeSubtext}</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* Legal copyrights bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-white/50 text-center sm:text-left">
            <p>{copy.contact.copyright.replace("{year}", String(new Date().getFullYear()))}</p>
            <p className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">{copy.contact.privacy}</a>
              <a href="#" className="hover:text-white transition-colors">{copy.contact.terms}</a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
