import { ArrowRight, ChevronDown } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={heroBg}
        className="absolute inset-0 w-full h-full object-contain md:object-cover bg-white"
        style={{ filter: 'brightness(1.05) saturate(1.02)' }}
      >
        {/* Primary: local video — always works, no CDN dependency */}
        <source src="/office-bg.mp4" type="video/mp4" />
        {/* Fallback: Pexels people brainstorming in bright meeting room */}
        <source src="https://videos.pexels.com/video-files/8125803/8125803-hd_1920_1080_25fps.mp4" type="video/mp4" />
        <source src="https://assets.mixkit.co/videos/preview/mixkit-open-office-space-914-large.mp4" type="video/mp4" />
      </video>
      {/* Overlay — subtle white gradient: video stays vivid, bottom fade keeps text legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/20 to-white/80" />

      {/* Animated blue glow orbs */}


      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#3b82f6]/15 blur-[120px] animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 container mx-auto text-center px-4 sm:px-6 mt-16 md:mt-24">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass border border-primary/20 mb-4 sm:mb-6 animate-fade-in text-foreground">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide">SA Consultant & Staffing</span>
        </div>

        <h1 className="fluid-h1 font-display font-black tracking-tight leading-tight mb-4 sm:mb-6 max-w-5xl mx-auto text-gray-900 drop-shadow-sm text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          Empowering Businesses with{' '}
          <span className="gradient-text">Smart Digital &amp; Staffing Solutions</span>
        </h1>

        <p className="text-sm sm:text-lg md:text-xl text-foreground font-bold max-w-2xl mx-auto mb-3 sm:mb-4 px-2 tracking-wide">
          Website Creation &nbsp;|&nbsp; Digital Marketing &nbsp;|&nbsp; Staffing &nbsp;|&nbsp; Content Creation
        </p>

        <p className="text-sm sm:text-base text-foreground font-semibold max-w-xl mx-auto mb-8 sm:mb-10 px-2 leading-relaxed">
          We deliver world-class consulting and staffing services that drive growth,
          innovation, and lasting success for businesses worldwide.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
          <a
            href="#services"
            className="gradient-bg px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-white hover-lift hover-glow inline-flex items-center justify-center gap-2 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
          >
            Get Started <ArrowRight size={18} />
          </a>
          <a
            href="#contact"
            className="gradient-bg px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-white hover-lift hover-glow inline-flex items-center justify-center transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
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
