import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface Review {
  name: string;
  rating: number;
  message: string;
  status: string;
}

const defaultTestimonials: Review[] = [
  {
    name: 'Sarah Johnson',
    rating: 5,
    message: 'SA Consultant transformed our digital presence completely. Their strategic approach and attention to detail delivered results that exceeded our expectations.',
    status: 'approved'
  },
  {
    name: 'Michael Chen',
    rating: 5,
    message: 'The staffing solutions provided were exceptional. They understood our culture and delivered top-tier candidates that have become invaluable team members.',
    status: 'approved'
  },
];

const Testimonials = () => {
  const { user, isAdmin } = useAuth();
  const [current, setCurrent] = useState(0);
  const [reviews, setReviews] = useState<Review[]>(defaultTestimonials); // Starts with default ones immediately
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('name, rating, message, status')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // COMBINE: Always keep defaults and append dynamic ones
        const dynamicReviews = data || [];
        setReviews([...defaultTestimonials, ...dynamicReviews]);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        // On error, we still have the default reviews in state
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    // Set up real-time subscription
    const channel = supabase
      .channel('public:reviews')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => {
        fetchReviews();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews]);

  const prev = () => setCurrent((c) => (c - 1 + reviews.length) % reviews.length);
  const next = () => setCurrent((c) => (c + 1) % reviews.length);

  // REMOVED THE if (loading) return SPINNER BLOCK
  // This ensures the section is VISIBLE IMMEDIATELY with default data

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden bg-secondary/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 revealed"> {/* Using 'revealed' to ensure visibility */}
          <span className="text-accent text-sm font-semibold tracking-widest uppercase">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-3 mb-6">
            Client <span className="gradient-text">Stories</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto revealed">
          <div className="glass rounded-2xl p-8 md:p-12 text-center relative min-h-[400px] flex flex-col justify-center">
            <Quote className="absolute top-8 left-8 text-primary/10 w-16 h-16 -z-10" />
            
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  className={i < reviews[current]?.rating ? "fill-accent text-accent" : "text-muted-foreground/20"} 
                />
              ))}
            </div>

            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-8 font-light italic">
              "{reviews[current]?.message || 'Loading client stories...'}"
            </p>

            <div>
              <p className="font-display font-semibold text-foreground">{reviews[current]?.name}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-widest text-[10px] mt-1">Verified Client</p>
            </div>

            {/* Navigation */}
            {reviews.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 mb-8">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 gradient-bg' : 'bg-muted-foreground/30'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            <div className="flex justify-center mt-4">
              <Button asChild className="gradient-bg border-none gap-2 hover-lift">
                <Link to={user ? (isAdmin ? "/admin" : "/dashboard") : "/auth"}>
                  Add Your Review <Star size={16} fill="currentColor" />
                </Link>
              </Button>
            </div>
            
            {loading && (
              <div className="absolute bottom-4 right-4 animate-spin rounded-full h-4 w-4 border-t-2 border-primary"></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
