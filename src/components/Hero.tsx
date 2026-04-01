import { ArrowRight, ChevronDown } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/60" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[hsl(330,80%,60%)]/20 blur-[120px] animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 container mx-auto text-center px-4">

        <h1 className="fluid-h1 font-display font-bold leading-tight mb-6 max-w-5xl mx-auto">
          Empowering Businesses with{' '}
          <span className="gradient-text">Smart Digital & Staffing Solutions</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
          Website Creation | Marketing | Staffing | Digital Content Creation
        </p>

        <p className="text-muted-foreground/70 max-w-xl mx-auto mb-10">
          We deliver world-class consulting and staffing services that drive growth,
          innovation, and lasting success for businesses worldwide.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#services"
            className="gradient-bg px-8 py-4 rounded-lg font-semibold text-foreground hover-lift hover-glow inline-flex items-center justify-center gap-2 transition-all duration-300"
          >
            Get Started <ArrowRight size={18} />
          </a>
          <a
            href="#contact"
            className="glass px-8 py-4 rounded-lg font-semibold text-foreground hover:border-accent/50 hover:text-accent transition-all duration-300 inline-flex items-center justify-center"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce"
      >
        <ChevronDown size={28} />
      </a>
    </section>
  );
};

export default Hero;
