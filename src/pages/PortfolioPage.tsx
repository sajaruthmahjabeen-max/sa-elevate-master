import Navbar from '@/components/Navbar';
import Portfolio from '@/components/Portfolio';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useSEO } from '@/hooks/useSEO';

const PortfolioPage = () => {
  useScrollReveal();
  useSEO({
    title: "Portfolio | Our Work | SA Consultant",
    description: "Explore the projects, enterprise solutions, and custom software delivered by SA Consultant & Staffing.",
    canonical: "https://www.saconsultantandstaffing.com/portfolio"
  });

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <Navbar />
      <Portfolio />
      <Footer />
    </div>
  );
};

export default PortfolioPage;
