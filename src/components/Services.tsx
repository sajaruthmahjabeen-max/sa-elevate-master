import { Globe, Megaphone, Users, Palette } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Website Creation',
    description: 'Stunning, high-performance websites and web applications tailored to your brand and built for conversion.',
    features: ['Custom Design', 'SEO Optimized', 'Mobile First'],
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    description: 'Data-driven marketing strategies that amplify your brand presence and deliver measurable ROI.',
    features: ['Social Media', 'PPC Campaigns', 'Analytics'],
  },
  {
    icon: Users,
    title: 'Staffing Solutions',
    description: 'Connect with vetted, top-tier talent to build high-performing teams that drive business success.',
    features: ['Executive Search', 'Contract Staffing', 'RPO'],
  },
  {
    icon: Palette,
    title: 'Content Creation',
    description: 'Engaging digital content that tells your story, captivates audiences, and builds brand authority.',
    features: ['Video Production', 'Copywriting', 'Branding'],
  },
];

const Services = () => (
  <section id="services" className="section-padding relative">
    <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#3b82f6]/10 blur-[120px]" />

    <div className="container mx-auto relative z-10">
      <div className="text-center mb-16 scroll-reveal">
        <span className="text-accent text-sm font-semibold tracking-widest uppercase">Our Services</span>
        <h2 className="fluid-h2 font-display font-black tracking-tight mt-3 mb-6">
          What We <span className="gradient-text">Offer</span>
        </h2>
        <p className="text-foreground font-semibold max-w-2xl mx-auto text-lg leading-relaxed">
          Comprehensive solutions designed to elevate your business to new heights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, i) => (
          <div
            key={service.title}
            className="scroll-reveal glass rounded-2xl p-8 hover-lift hover-glow group relative overflow-hidden"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {/* Shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:gradient-bg transition-all duration-500">
              <service.icon size={24} className="text-primary group-hover:text-foreground transition-colors duration-500" />
            </div>
            <h3 className="text-lg font-display font-bold mb-3">{service.title}</h3>
            <p className="text-foreground font-medium text-sm leading-relaxed mb-5">{service.description}</p>
            <div className="flex flex-wrap gap-2">
              {service.features.map((f) => (
                <span key={f} className="text-xs px-3 py-1 rounded-full bg-secondary text-foreground font-bold border border-primary/20">
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
