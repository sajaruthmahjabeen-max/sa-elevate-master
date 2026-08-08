import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Star } from "lucide-react";

import { ResumeServiceModal } from "@/components/career/ResumeServiceModal";

interface ResumePlan {
  id: string;
  name: string;
  price: string;
  features: string[];
}

const CAREER_PLANS: ResumePlan[] = [
  {
    id: "professional-resume-package",
    name: "Professional Resume Package",
    price: "$99",
    features: [
      "ATS-Friendly Resume",
      "Professional Formatting",
      "Job-Specific Customization",
      "Achievement-Focused Content",
      "Final Resume in PDF & DOCX",
    ],
  },
  {
    id: "interview-preparation",
    name: "Interview Preparation",
    price: "$79",
    features: [
      "Mock Interview",
      "Common Interview Question Practice",
      "Personalized Feedback",
      "Interview Improvement Tips",
      "60-Minute Session",
    ],
  },
  {
    id: "career-coaching",
    name: "Career Coaching",
    price: "$99",
    features: [
      "Career Goal Planning",
      "Job Search Strategy",
      "LinkedIn Guidance",
      "Personalized Career Advice",
      "60-Minute Coaching Session",
    ],
  },
  {
    id: "training-programs",
    name: "Training Programs",
    price: "$149",
    features: [
      "Job-Relevant Skill Training",
      "Practical Learning",
      "Expert Guidance",
      "Career-Focused Skills",
      "Certificate of Completion",
    ],
  },
  {
    id: "job-search-assistance",
    name: "Job Search Assistance",
    price: "$79",
    features: [
      "Job Search Strategy",
      "Job Matching Guidance",
      "Job Application Guidance",
      "Job Alerts",
      "Application Tracking Support",
    ],
  },
];

const CareerServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState("Professional Resume Package");

  const handleGetStarted = (planName: string) => {
    setSelectedPlan(planName);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans antialiased">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-4 text-center max-w-4xl mx-auto mb-12">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-none font-semibold px-3 py-1 mb-4 rounded-full text-xs uppercase tracking-wide inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Career Support Services
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
            Career Services
          </h1>
          <p className="text-xl md:text-2xl font-bold text-primary mt-3">
            Resume Building, Coaching, Training & Job Assistance
          </p>
          <p className="text-muted-foreground text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Get professional resume support, interview coaching, career strategy, skill training, and job search guidance to achieve your goals.
          </p>
        </section>

        {/* Pricing Cards Section */}
        <section className="px-4 sm:px-6 max-w-[1440px] mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-3 xl:gap-5 items-stretch">
            {CAREER_PLANS.map((plan) => (
              <Card
                key={plan.id}
                className="w-full flex flex-col justify-between rounded-3xl p-5 xl:p-6 glass-strong border-2 border-primary/30 hover:border-primary shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  {/* Card Title & Price */}
                  <div className="text-center pb-5 border-b border-border/60">
                    <h3 className="text-lg xl:text-xl font-extrabold text-foreground min-h-[56px] flex items-center justify-center leading-tight">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 mt-2">
                      <span className="text-3xl font-black text-primary tracking-tight">
                        {plan.price}
                      </span>
                    </div>
                  </div>

                  {/* Feature List */}
                  <div className="my-5">
                    <p className="text-[10px] xl:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Includes:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span className="text-xs text-foreground/90 font-medium leading-tight">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-3">
                  <Button
                    onClick={() => handleGetStarted(plan.name)}
                    className="w-full h-11 rounded-xl font-extrabold text-xs xl:text-sm gradient-bg text-white hover:opacity-95 hover:shadow-lg transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 px-3"
                  >
                    Get Started <span className="text-base">→</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="px-4 max-w-4xl mx-auto mt-16 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mx-auto italic">
            Career services are optional professional support services. Purchasing a resume service does not guarantee employment, interviews, job offers, or placement.
          </p>
        </section>
      </main>

      <ResumeServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPlan={selectedPlan}
      />

      <Footer />
    </div>
  );
};

export default CareerServicesPage;
