import { useState, useRef } from 'react';
import { Globe, Megaphone, Users, Palette, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Globe,
    title: 'Website Creation',
    description: 'Stunning, high-performance websites and web applications tailored to your brand and built for high conversion.',
    features: ['Custom Design', 'SEO Optimized', 'Mobile First', 'Full-Stack'],
    image: '/images/service-website.png',
    link: '/services',
    ctaText: 'Explore Web Creation',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    description: 'Data-driven marketing strategies that amplify your brand presence, generate qualified leads, and deliver measurable ROI.',
    features: ['Social Media', 'PPC Campaigns', 'Analytics', 'Growth Strategy'],
    image: '/images/service-marketing.png',
    link: '/services',
    ctaText: 'Explore Marketing',
  },
  {
    icon: Users,
    title: 'Staffing Solutions',
    description: 'Connect with vetted, top-tier technical talent and dedicated engineering squads to build high-performing teams.',
    features: ['Executive Search', 'Contract (C2C)', 'Direct Hire', 'Pre-Vetted'],
    image: '/images/service-staffing.png',
    link: '/client-portal',
    ctaText: 'Find Talent & Post Jobs',
  },
  {
    icon: Palette,
    title: 'Content Creation',
    description: 'Engaging digital content that tells your story, captivates target audiences, and builds lasting brand authority.',
    features: ['Video Production', 'Copywriting', 'Brand Identity', 'UI/UX Design'],
    image: '/images/service-content.png',
    link: '/services',
    ctaText: 'Explore Content',
  },
];

interface ServiceCardProps {
  service: typeof services[number];
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Dynamic 3D tilt calculation
    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="scroll-reveal group relative h-[380px] sm:h-[400px] rounded-3xl overflow-hidden shadow-xl border border-border/70 bg-card/60 backdrop-blur-lg hover:border-primary/50 transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between"
      style={{
        transform: transformStyle,
        transitionDelay: `${index * 100}ms`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Top Shimmer Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" />

      {/* Background Full Image with Zoom on Hover */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out brightness-[0.85] group-hover:brightness-[0.65]"
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
      </div>

      {/* Floating Category Badge (Top Right) */}
      <div className="relative z-10 p-5 flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-background/90 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          <service.icon size={22} />
        </div>
        <span className="text-[11px] px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-foreground/80 font-bold border border-white/10 uppercase tracking-wider shadow-sm">
          Service 0{index + 1}
        </span>
      </div>

      {/* Resting Content (Bottom preview visible before hover) */}
      <div className="relative z-10 p-6 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4">
        <h3 className="text-2xl font-display font-extrabold text-white tracking-tight mb-2 drop-shadow-md">
          {service.title}
        </h3>
        <p className="text-white/80 text-xs font-semibold line-clamp-2">
          {service.description}
        </p>
      </div>

      {/* REVEAL CONTENT ON HOVER (Curtain slides up with glassmorphism) */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-background/98 via-background/90 to-background/60 backdrop-blur-md p-6 flex flex-col justify-between translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
        {/* Top Header of Revealed Card */}
        <div className="pt-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Overview</span>
          </div>
          <h3 className="text-2xl font-display font-extrabold text-foreground mb-3">
            {service.title}
          </h3>
          <p className="text-foreground/85 text-xs font-medium leading-relaxed mb-4">
            {service.description}
          </p>

          {/* Revealed Feature Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {service.features.map((f) => (
              <span
                key={f}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold border border-primary/25 shadow-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Revealed Action Button */}
        <Link
          to={service.link}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary via-primary to-amber-600 hover:from-primary/90 hover:to-amber-700 text-primary-foreground font-bold text-xs shadow-lg flex items-center justify-center gap-2 group-hover:shadow-primary/30 transition-all duration-300 mt-auto"
        >
          <span>{service.ctaText}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

const Services = () => (
  <section id="services" className="section-padding relative">
    <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />

    <div className="container mx-auto relative z-10">
      <div className="text-center mb-16 scroll-reveal">
        <span className="text-accent text-sm font-extrabold tracking-widest uppercase">Our Services</span>
        <h2 className="fluid-h2 font-display font-black tracking-tight mt-3 mb-6">
          What We <span className="gradient-text">Offer</span>
        </h2>
        <p className="text-foreground/90 font-semibold max-w-2xl mx-auto text-lg leading-relaxed">
          Hover over any card to explore our specialized solutions designed to elevate your business.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, i) => (
          <ServiceCard key={service.title} service={service} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default Services;
