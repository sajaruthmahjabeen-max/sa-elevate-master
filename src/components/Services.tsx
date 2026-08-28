import { useState, useRef } from 'react';
import { Globe, Megaphone, Users, Palette, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Globe,
    title: 'Website Creation',
    description: 'Stunning, high-performance websites and web applications tailored to your brand and built for high conversion.',
    features: ['Custom Design', 'SEO Optimized', 'Mobile First'],
    image: '/images/service-website.png',
    link: '/services',
    ctaText: 'Explore Web Creation',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    description: 'Data-driven marketing strategies that amplify your brand presence, generate qualified leads, and deliver measurable ROI.',
    features: ['Social Media', 'PPC Campaigns', 'Analytics'],
    image: '/images/service-marketing.png',
    link: '/services',
    ctaText: 'Explore Marketing',
  },
  {
    icon: Users,
    title: 'Staffing Solutions',
    description: 'Connect with vetted, top-tier technical talent and dedicated engineering squads to build high-performing teams.',
    features: ['Executive Search', 'Contract Staffing', 'Pre-Vetted'],
    image: '/images/service-staffing.png',
    link: '/client-portal',
    ctaText: 'Find Talent & Post Jobs',
  },
  {
    icon: Palette,
    title: 'Content Creation',
    description: 'Engaging digital content that tells your story, captivates target audiences, and builds lasting brand authority.',
    features: ['Video Production', 'Copywriting', 'Branding'],
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

    // Subtle 3D tilt calculation
    const rotateX = ((centerY - y) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="scroll-reveal group relative h-[380px] rounded-3xl overflow-hidden shadow-lg border border-border bg-card hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between"
      style={{
        transform: transformStyle,
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* 🖼️ Large, Crisp Picture Background (Always visible, zooms on hover) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-muted">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Soft gradient darkening at the bottom for crystal-clear title contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
      </div>

      {/* Floating Category Icon (Top Left) */}
      <div className="relative z-20 p-5 flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-background/95 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          <service.icon size={22} />
        </div>
        <span className="text-[11px] px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-bold border border-white/20 uppercase tracking-wider shadow-sm">
          Service 0{index + 1}
        </span>
      </div>

      {/* 🟢 RESTING STATE CONTENT (Title + Hover cue) */}
      <div className="relative z-20 p-6 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4">
        <h3 className="text-2xl font-display font-black text-white tracking-tight mb-1 drop-shadow-md">
          {service.title}
        </h3>
        <p className="text-amber-300 text-xs font-bold flex items-center gap-1">
          <span>Hover to explore details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </p>
      </div>

      {/* 🌟 REVEAL CARD CONTENT ON HOVER (Glassmorphism curtain slides up from bottom) */}
      <div className="absolute inset-x-0 bottom-0 z-30 bg-background/95 dark:bg-card/95 backdrop-blur-xl p-6 rounded-t-3xl border-t border-primary/30 shadow-2xl flex flex-col justify-between translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
        <div>
          <div className="flex items-center gap-2 text-primary font-extrabold text-xs uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Service Overview</span>
          </div>
          
          <h3 className="text-xl font-display font-extrabold text-foreground mb-2">
            {service.title}
          </h3>

          <p className="text-foreground/90 font-medium text-xs leading-relaxed mb-4">
            {service.description}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {service.features.map((f) => (
              <span
                key={f}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-extrabold border border-primary/25 shadow-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={service.link}
          className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 group-hover:shadow-primary/30 transition-all duration-300"
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
        <span className="text-accent text-sm font-extrabold tracking-widest uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-accent" />
          Our Services
        </span>
        <h2 className="fluid-h2 font-display font-black tracking-tight mt-3 mb-6">
          What We <span className="gradient-text">Offer</span>
        </h2>
        <p className="text-foreground/90 font-semibold max-w-2xl mx-auto text-lg leading-relaxed">
          Hover over any card below to reveal complete service details, features, and direct actions.
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
