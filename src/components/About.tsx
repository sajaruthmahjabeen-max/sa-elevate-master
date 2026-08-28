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

      {/* Grid of CSS-Only Direction-Aware Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <div
            key={card.title}
            className="direction-card group h-[380px] rounded-3xl border border-border shadow-xl bg-card hover:border-primary/50 hover:shadow-2xl transition-all duration-500 cursor-pointer"
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            {/* 4 Pure CSS Invisible Direction Triggers */}
            <div className="direction-trigger direction-trigger-top" />
            <div className="direction-trigger direction-trigger-right" />
            <div className="direction-trigger direction-trigger-bottom" />
            <div className="direction-trigger direction-trigger-left" />

            {/* 🖼️ Base Card Face (Always Visible until hovered) */}
            <div className="relative w-full h-full flex flex-col justify-between p-6 z-10 bg-muted/20">
              {/* Picture banner */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 border border-border/60 shadow-md">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating Icon */}
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-background/95 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md text-primary">
                  <card.icon size={20} />
                </div>
              </div>

              {/* Resting Typography */}
              <div className="mt-auto">
                <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                  {card.badge}
                </span>
                <h3 className="text-2xl font-display font-extrabold text-primary mt-1 mb-2">
                  {card.title}
                </h3>
                <p className="text-foreground/80 font-medium text-xs line-clamp-2 leading-relaxed">
                  {card.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-primary">
                  <span>Explore from any direction</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* 🧭 DIRECTION-AWARE OVERLAY (Slides in from Top/Right/Bottom/Left) */}
            <div className="direction-overlay bg-gradient-to-br from-background/98 via-background/95 to-background/90 dark:from-card/98 dark:via-card/95 dark:to-card/90 backdrop-blur-2xl p-7 rounded-3xl border border-primary/40 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-sm">
                    <card.icon size={24} />
                  </div>
                  <span className="text-[11px] px-3 py-1 rounded-full bg-primary/15 text-primary font-black uppercase tracking-wider border border-primary/30">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-display font-black text-foreground mb-1">
                  {card.title}
                </h3>
                <p className="text-primary font-bold text-xs mb-3">
                  {card.subtitle}
                </p>

                <p className="text-foreground/90 font-medium text-xs leading-relaxed mb-4">
                  {card.description}
                </p>

                {/* Key Strategic Pillars */}
                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  {card.pillars.map((pillar) => (
                    <div key={pillar} className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <card.accentIcon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{pillar}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Brand Guarantee */}
              <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                <span>SA Consultant Standard</span>
                <span className="text-primary font-extrabold">100% Commitment</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default About;
