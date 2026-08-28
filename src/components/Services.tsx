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
      className="scroll-reveal glass rounded-3xl p-6 hover-glow group relative overflow-hidden transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between h-full border border-border/80 hover:border-primary/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10"
      style={{
        transform: transformStyle,
        transitionDelay: `${index * 100}ms`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Top Shimmer Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

      <div className="flex flex-col h-full justify-between">
        {/* Crystal Clear Service Image Box */}
        <div 
          className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 border border-border/60 group-hover:border-primary/40 transition-all duration-500 ease-out shadow-md bg-muted"
          style={{ transform: 'translateZ(20px)' }}
        >
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          {/* Subtle bottom shadow overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          
          {/* Floating Category Icon Badge */}
          <div className="absolute bottom-3 left-3 w-11 h-11 rounded-xl bg-background/95 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 text-primary">
            <service.icon size={20} />
          </div>

          {/* Service index chip */}
          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
            0{index + 1}
          </div>
        </div>

        {/* Content Section - High Contrast and Crystal Clear */}
        <div style={{ transform: 'translateZ(30px)' }} className="flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-display font-extrabold mb-2.5 text-primary group-hover:text-accent transition-colors duration-300">
              {service.title}
            </h3>
            <p className="text-foreground/90 font-medium text-sm leading-relaxed mb-5">
              {service.description}
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {service.features.map((f) => (
              <span 
                key={f} 
                className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-bold border border-primary/25 shadow-sm"
                style={{ transform: 'translateZ(10px)' }}
              >
                {f}
              </span>
            ))}
          </div>

          {/* REVEAL ON HOVER: Action Button that smoothly slides & fades up */}
          <div className="mt-2 pt-2 border-t border-border/40 transition-all duration-300">
            <Link
              to={service.link}
              className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90 flex items-center justify-center gap-2 group-hover:shadow-primary/30 transition-all duration-300"
            >
              <span>{service.ctaText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
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
          Comprehensive solutions designed to elevate your business to new heights.
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
