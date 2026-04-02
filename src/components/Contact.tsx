import { useState, useEffect } from 'react';
import { Send, MapPin, Mail, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [settings, setSettings] = useState({
    contact_email: 'mahjabeensajaruth@gmail.com',
    contact_phone: '+1 (609) 313-9192, 9384797751',
    contact_address: 'New Jersey, USA',
    whatsapp_number: '9384797751'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*');
      if (data) {
        const settingsMap = data.reduce((acc: any, item: any) => {
          acc[item.id] = item.value;
          return acc;
        }, {});
        setSettings({
          contact_email: settingsMap.contact_email || settings.contact_email,
          contact_phone: settingsMap.contact_phone || settings.contact_phone,
          contact_address: settingsMap.contact_address || settings.contact_address,
          whatsapp_number: settingsMap.whatsapp_number || settings.whatsapp_number
        });
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Store in Supabase first
      const { error } = await supabase
        .from('inquiries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          }
        ]);

      if (error) throw error;

      // 2. Construct WhatsApp message and redirect
      const whatsappMessage = `*New Inquiry from SA Elevate Website*%0A%0A` +
        `*Name:* ${formData.name}%0A` +
        `*Email:* ${formData.email}%0A` +
        `*Phone:* ${formData.phone}%0A%0A` +
        `*Message:*%0A${formData.message}`;

      const whatsappUrl = `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${whatsappMessage}`;
      
      // Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // 3. Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert('There was an error sending your message. Please try again.');
    }
  };

  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/10 blur-[120px]" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 scroll-reveal">
          <span className="text-accent text-sm font-semibold tracking-widest uppercase">Contact</span>
          <h2 className="fluid-h2 font-display font-bold mt-3 mb-6">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your business? Get in touch with us today.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="scroll-reveal space-y-8">
            <div>
              <h3 className="text-2xl font-display font-semibold mb-4">Get In Touch</h3>
              <p className="text-muted-foreground">
                We'd love to hear about your project. Reach out and let's create something extraordinary together.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: MapPin, label: 'Address', value: settings.contact_address },
                { icon: Mail, label: 'Email', value: settings.contact_email },
                { icon: Phone, label: 'Phone', value: settings.contact_phone },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 overflow-hidden">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} className="text-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-foreground font-medium break-words md:break-normal whitespace-pre-wrap">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="scroll-reveal glass rounded-2xl p-5 sm:p-8 space-y-6 max-w-full">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                placeholder="+1 (123) 456-7890"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-foreground"
                placeholder="Tell us about your project..."
              />
            </div>
            <button
              type="submit"
              className="w-full gradient-bg py-4 rounded-lg font-semibold text-foreground hover-lift hover-glow flex items-center justify-center gap-2 transition-all duration-300"
            >
              Send Message <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
