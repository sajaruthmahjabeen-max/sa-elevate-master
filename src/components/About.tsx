import React, { useState, useRef } from 'react';
import { Target, Eye, Zap, Sparkles, ArrowRight, ShieldCheck, Award, Rocket } from 'lucide-react';
import logo from '@/assets/logo.png';

const cards = [
  {
    icon: Target,
    title: 'Our Mission',
    subtitle: 'Driving Measurable Growth',
    description: 'To empower businesses with innovative digital solutions and exceptional staffing services that drive measurable growth and lasting success.',
    pillars: ['Digital Modernization', 'Vetted Staffing', 'Scalable Architecture'],
    image: '/images/about-mission.png',
    badge: 'Core Purpose',
    accentIcon: Rocket,
  },
  {
    icon: Eye,
    title: 'Our Vision',
    subtitle: 'Global Technology Leadership',
    description: 'To be the most trusted global partner for businesses seeking transformation through cutting-edge technology, elite talent, and strategic consulting.',
    pillars: ['Global Reach', 'Innovation Focus', 'Client Trust'],
    image: '/images/about-vision.png',
    badge: 'Future Outlook',
    accentIcon: Award,
  },
  {
    icon: Zap,
    title: 'Our Values',
    subtitle: 'Excellence & Integrity First',
    description: 'Excellence, integrity, and innovation guide everything we do. We believe in building transparent partnerships that create real, sustainable impact.',
    pillars: ['Integrity First', 'Transparent SLAs', 'Continuous Quality'],
    image: '/images/about-values.png',
    badge: 'Foundation',
    accentIcon: ShieldCheck,
  },
];

// Helper to get entry/exit direction (0: top, 1: right, 2: bottom, 3: left)
const getDirection = (e: React.MouseEvent<HTMLDivElement>, el: HTMLElement) => {
  const { width, height, top, left } = el.getBoundingClientRect();
  const x = e.clientX - left - width / 2;
  const y = e.clientY - top - height / 2;
  // Compute quadrant angle
  return Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4;
};

interface AboutCardProps {
  card: typeof cards[number];
  index: number;
}

const DirectionAwareCard = ({ card, index }: AboutCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<'top' | 'right' | 'bottom' | 'left'>('bottom');

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const dirIndex = getDirection(e, cardRef.current);
    const directions: ('top' | 'right' | 'bottom' | 'left')[] = ['top', 'right', 'bottom', 'left'];
    setDirection(directions[dirIndex]);
    setIsHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const dirIndex = getDirection(e, cardRef.current);
    const directions: ('top' | 'right' | 'bottom' | 'left')[] = ['top', 'right', 'bottom', 'left'];
    setDirection(directions[dirIndex]);
    setIsHovered(false);
  };

  // Get initial transform offset based on direction
  const getTransformClasses = () => {
    if (isHovered) return 'translate-x-0 translate-y-0 opacity-100';
    switch (direction) {
      case 'top':
        return '-translate-y-full translate-x-0 opacity-0';
      case 'right':
        return 'translate-x-full translate-y-0 opacity-0';
      case 'bottom':
        return 'translate-y-full translate-x-0 opacity-0';
      case 'left':
        return '-translate-x-full translate-y-0 opacity-0';
      default:
        return 'translate-y-full opacity-0';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="scroll-reveal group relative h-[430px] rounded-3xl border border-border/80 shadow-lg hover:shadow-2xl hover:border-primary/60 bg-card overflow-hidden transition-all duration-500 cursor-pointer flex flex-col justify-between"
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* 🖼️ Base Card Content (Always 100% Crisp & Visible) */}
      <div className="relative w-full h-full p-6 flex flex-col justify-between z-10 bg-card">
        {/* Picture at Top */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 border border-border/60 shadow-md bg-muted">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Floating Icon */}
          <div className="absolute bottom-3 left-3 w-11 h-11 rounded-xl bg-background/95 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md text-primary font-bold">
            <card.icon size={22} />
          </div>

          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
            {card.badge}
          </div>
        </div>

        {/* Resting Typography */}
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
              {card.subtitle}
            </span>
            <h3 className="text-2xl font-display font-extrabold text-primary mt-1 mb-2">
              {card.title}
            </h3>
            <p className="text-foreground/90 font-medium text-xs leading-relaxed line-clamp-3">
              {card.description}
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary">
            <span className="group-hover:text-accent transition-colors">Hover from any angle to view details</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* 🧭 REVEALED DIRECTION-AWARE OVERLAY (Slides in from Top, Right, Bottom, or Left) */}
      <div
        className={`absolute inset-0 z-30 p-7 bg-card border-2 border-primary/60 shadow-2xl flex flex-col justify-between transition-all duration-500 ease-out ${getTransformClasses()}`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
              <card.icon size={24} />
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-primary/15 text-primary font-extrabold uppercase tracking-wider border border-primary/30">
              {card.badge}
            </span>
          </div>

          <h3 className="text-2xl font-display font-extrabold text-foreground mb-1">
            {card.title}
          </h3>
          <p className="text-primary font-bold text-xs mb-3">
            {card.subtitle}
          </p>

          <p className="text-foreground/90 font-medium text-xs leading-relaxed mb-5">
            {card.description}
          </p>

          {/* Strategic Pillars */}
          <div className="space-y-2 pt-3 border-t border-border/60">
            {card.pillars.map((pillar) => (
              <div key={pillar} className="flex items-center gap-2.5 text-xs font-extrabold text-foreground">
                <card.accentIcon className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{pillar}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Verification Footer */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-muted-foreground">
          <span>SA Consultant Quality</span>
          <span className="text-primary font-extrabold">100% Verified</span>
        </div>
      </div>
    </div>
  );
};

const About = () => (
  <section id="about" className="section-padding relative overflow-hidden">
    <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/10 blur-[100px]" />
    <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[120px]" />

    <div className="container mx-auto relative z-10">
      <div className="flex justify-center mb-10 scroll-reveal">
        <img src={logo} alt="SA Consultant logo" className="h-32 md:h-56 w-auto object-contain hover-lift" />
      </div>
      
      <div className="text-center mb-16 scroll-reveal">
        <span className="text-accent text-sm font-extrabold tracking-widest uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-accent" />
          About Us
        </span>
        <h2 className="fluid-h2 font-display font-black tracking-tight mt-3 mb-6">
          Who We <span className="gradient-text">Are</span>
        </h2>
        <p className="text-foreground/90 font-semibold max-w-2xl mx-auto leading-relaxed text-lg">
          SA Consultant & Staffing Solutions is a premier consulting firm that blends digital innovation with top-tier staffing expertise to help businesses thrive.
        </p>
      </div>

      {/* Grid of Direction-Aware Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <DirectionAwareCard key={card.title} card={card} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default About;
