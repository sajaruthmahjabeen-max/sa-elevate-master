import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  Mail,
  ChevronRight,
  Minimize2,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Handshake,
  UserCheck,
  FileCode2,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: { label: string; action: string; path?: string }[];
  cta?: { label: string; path: string; icon?: string };
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    sender: 'bot',
    text: 'Hello! 👋 I am **SA Elevate AI**, your intelligent Assistant for **SA Consultant & Staffing**.\n\nAsk me **ANY question** about:\n• 🌐 **Website Development Procedure & Engineering**\n• 🤝 **Talent Partner & Vendor Programs**\n• 👤 **Candidate Portal & Job Applications**\n• 🏢 **Client Portal & Job Postings**\n• 💰 **Pricing & Subscription Plans**\n• 💡 **Technical Stacks, Cloud & DevOps**\n\nHow can I help you today?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    quickReplies: [
      { label: '🌐 Website Development Procedure', action: 'web_dev' },
      { label: '🤝 Talent Partner Program', action: 'partner_portal' },
      { label: '👤 Candidate Portal', action: 'candidate_portal' },
      { label: '🏢 Client Portal (Post Job)', action: 'client_portal' },
      { label: '💰 Pricing Plans', action: 'pricing' },
      { label: '📅 Book 1-on-1 Consultation', action: 'book_call' },
    ],
  },
];

export const AIChatbot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem('sa_chatbot_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  useEffect(() => {
    sessionStorage.setItem('sa_chatbot_messages', JSON.stringify(messages));
  }, [messages]);

  // Handle opening widget
  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  // Reset conversation
  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    sessionStorage.removeItem('sa_chatbot_messages');
    toast.info('Chat conversation reset.');
  };

  // Universal Smart AI Response Engine
  const generateBotReply = async (userText: string) => {
    const rawQ = userText.trim();
    const q = rawQ.toLowerCase();

    // Natural typing delay simulation
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 650));
    setIsTyping(false);

    let reply: Message;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. WEBSITE DEVELOPMENT PROCEDURE & ENGINEERING
    if (
      q.includes('website development') ||
      q.includes('web development') ||
      q.includes('procedure') ||
      q.includes('software development') ||
      q.includes('how to build website') ||
      q.includes('development process') ||
      q.includes('development lifecycle') ||
      q.includes('sdlc') ||
      q.includes('web dev') ||
      q.includes('build an app') ||
      q.includes('engineering process')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🌐 **Comprehensive Website Development Procedure at SA Consultant:**

We follow a rigorous, enterprise-grade 5-phase Software Development Lifecycle (SDLC):

### 1️⃣ Phase 1: Requirements Discovery & Technical Architecture
• **Stakeholder Workshops**: Define core business goals, target audience, and feature roadmaps.
• **Tech Stack Selection**: High-performance stack choices (React / Next.js / TypeScript for frontend; Node.js / Python / Spring Boot for backend; PostgreSQL / Supabase for database).
• **System Architecture**: API blueprinting (REST/GraphQL), cloud topology, and security standards.

### 2️⃣ Phase 2: UI/UX Design & Interactive Prototyping
• **Wireframing**: User journey maps, information hierarchy, and layout structures.
• **High-Fidelity UI**: Modern aesthetics in Figma featuring accessible color systems, dark/light modes, and responsive breakpoints.
• **Interactive Click-Through Prototype**: Validated with clients prior to writing code.

### 3️⃣ Phase 3: Agile Full-Stack Development
• **Modular Component Architecture**: Reusable UI components styled with Vanilla CSS / Tailwind.
• **Backend & Database Integration**: Secure authentication, role-based access control (RBAC), and low-latency database queries.
• **Sprint Cycles**: Bi-weekly sprint demos to review functional increments.

### 4️⃣ Phase 4: Quality Assurance, Security & Performance Testing
• **Automated & Manual QA**: Unit testing, cross-browser compatibility, and mobile responsiveness.
• **Security Hardening**: Data encryption, SQL injection prevention, and SSL/TLS configuration.
• **Performance Audits**: Lighthouse 90+ scores, optimized asset bundles, and Core Web Vitals compliance.

### 5️⃣ Phase 5: Cloud Deployment & Continuous Maintenance
• **Automated CI/CD**: Seamless deployment pipelines with AWS, Vercel, or Docker containerization.
• **SEO & Analytics**: Metadata optimization, search engine indexing, and real-time monitoring.
• **Post-Launch Support**: SLA monitoring, periodic upgrades, and feature expansions.`,
        timestamp: now,
        cta: { label: 'Explore Engineering Services', path: '/services' },
        quickReplies: [
          { label: '🏢 Post Web Requirement', action: 'client_portal' },
          { label: '👥 Find Full-Stack Developers', action: 'find_candidates' },
          { label: '📅 Book Tech Consultation', action: 'book_call' },
        ],
      };
    }
    // 2. TALENT PARTNER & VENDOR COLLABORATION
    else if (
      q.includes('talent partner') ||
      q.includes('partner') ||
      q.includes('partnership') ||
      q.includes('vendor') ||
      q.includes('c2c') ||
      q.includes('corp to corp') ||
      q.includes('sub-vendor') ||
      q.includes('agency partner') ||
      q.includes('supplier')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🤝 **SA Consultant Talent Partner & Vendor Program:**

We collaborate closely with leading IT staffing agencies, prime vendors, and specialized consulting firms across the United States.

### 🌟 Key Pillars of our Partner Program:
1. **Co-Delivery Model**:
   • Submit your vetted bench candidates for exclusive direct client requirements.
   • Rapid submission review with direct client presentation within 24 hours.

2. **Transparent Commercials & Terms**:
   • Competitive C2C hourly billing rates with transparent recruiter margins.
   • Predictable, guaranteed net-payment terms (Net-15 / Net-30).

3. **Dedicated Vendor Portal**:
   • Direct portal to submit resumes, track interview progression, and receive instant feedback.
   • Streamlined digital onboarding with standard Master Services Agreements (MSAs) and Statements of Work (SOWs).

4. **Diverse High-Demand Domains**:
   • Full Stack, Cloud (AWS/Azure/GCP), DevOps, AI/ML, Cybersecurity, Java, Python, and UI/UX.`,
        timestamp: now,
        cta: { label: 'Join Talent Partner Program', path: '/partnership' },
        quickReplies: [
          { label: '🤝 Open Partnership Page', action: 'partner_portal' },
          { label: '🏢 View Current Client Vacancies', action: 'client_portal' },
          { label: '✉️ Contact Partner Desk', action: 'contact_support' },
        ],
      };
    }
    // 3. CANDIDATE PORTAL & JOB SEEKER WORKFLOW
    else if (
      q.includes('candidate portal') ||
      q.includes('candidate account') ||
      q.includes('job seeker') ||
      q.includes('how to apply') ||
      q.includes('apply for job') ||
      q.includes('upload resume') ||
      q.includes('job portal')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `👤 **Candidate Portal Overview & Job Seeker Workflow:**

The **Candidate Portal** is designed to accelerate job seekers into high-paying contract, remote, and full-time tech roles.

### 🚀 How Candidates Use the Portal:
1. **Profile Creation & Resume Parsing**:
   • Sign up and upload your latest resume (PDF/Word).
   • Our system automatically parses your technical skills, work history, and job titles.

2. **Explore & 1-Click Apply**:
   • Browse verified open positions across engineering, design, data, and management.
   • Apply with 1 click using your pre-verified profile credentials.

3. **Real-Time Application Status Tracker**:
   • Monitor your applications live: \`Applied\` ➔ \`Under Review\` ➔ \`Interview Scheduled\` ➔ \`Offer Extended\`.

4. **Career Support Upgrades**:
   • Access Professional Resume Packages ($99), 1-on-1 Mock Interview Prep ($79), and targeted Job Search Assistance ($79).`,
        timestamp: now,
        cta: { label: 'Go to Candidate Portal', path: '/candidate-portal' },
        quickReplies: [
          { label: '💼 Browse Open Jobs', action: 'jobs' },
          { label: '📄 Resume Services ($99)', action: 'career_services' },
          { label: '👤 Candidate Portal Login', action: 'candidate_portal' },
        ],
      };
    }
    // 4. CLIENT PORTAL & EMPLOYER WORKFLOW
    else if (
      q.includes('client portal') ||
      q.includes('post job') ||
      q.includes('post a job') ||
      q.includes('hire candidate') ||
      q.includes('hire developer') ||
      q.includes('employer portal') ||
      q.includes('employer') ||
      q.includes('hiring manager')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🏢 **Client Portal for Employers & Hiring Teams:**

The **Client Portal** gives hiring managers and business clients immediate access to our verified technical talent pool.

### ⚡ Client Portal Core Capabilities:
1. **Rapid Job Posting (< 2 Minutes)**:
   • Submit role title, required skills, experience level, salary/rate budget, and hiring urgency.
   • Instant real-time cloud synchronization with our Admin recruitment team.

2. **Pre-Screened Candidate Database**:
   • Discover pre-vetted engineers (React, Node.js, Python, Java, DevOps, UI/UX).
   • View verified competencies, years of experience, and location availability.

3. **1-Click Profile & Interview Requests**:
   • Click *"Request Candidate Profile & Intro"* to receive full resumes and schedule screening calls within 2 business hours.

4. **Direct Recruitment Support**:
   • Dedicated client desk support at \`support@saconsultantandstaffing.com\`.`,
        timestamp: now,
        cta: { label: 'Go to Client Portal', path: '/client-portal' },
        quickReplies: [
          { label: '🏢 Post a Job in Portal', action: 'client_portal' },
          { label: '👥 Search Talent Database', action: 'find_candidates' },
          { label: '📅 Book Hiring Strategy Call', action: 'book_call' },
        ],
      };
    }
    // 5. PRICING & SUBSCRIPTION PACKAGES
    else if (
      q.includes('price') ||
      q.includes('pricing') ||
      q.includes('cost') ||
      q.includes('how much') ||
      q.includes('package') ||
      q.includes('plan') ||
      q.includes('subscription') ||
      q.includes('free plan') ||
      q.includes('starter plan')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `💰 **SA Elevate Transparent Pricing & Plans:**

We offer flexible plans for businesses and candidates:

### 🏢 Employer Hiring Plans:
• **Free Plan ($0 / month)** — **[Active & Available Now]**:
  - Post unlimited job listings
  - Basic Applicant Tracking System (ATS)
  - 3 free candidate profile unlocks
  - Real-time candidate matching notifications

• **Starter Plan ($39 / month)** — **[Currently Under Development]**:
  - AI Resume Auto-parsing
  - Direct apply links & custom email reception
  - In-portal candidate direct messaging
  - Discounted resume database access ($2 / profile)
  - Priority support desk

### 📄 Career Acceleration Packages:
• **Professional Resume Package ($99)**: ATS-optimized formatting, custom content in PDF & DOCX.
• **Interview Preparation ($79)**: 60-minute 1-on-1 mock interview with personalized feedback.
• **Job Search Assistance ($79)**: Targeted matching strategy and direct application guidance.`,
        timestamp: now,
        cta: { label: 'View Pricing Page', path: '/pricing' },
        quickReplies: [
          { label: '🚀 Start Free Plan ($0)', action: 'signup_free' },
          { label: '📄 Career Services Packages', action: 'career_services' },
          { label: '🏢 Client Portal', action: 'client_portal' },
        ],
      };
    }
    // 6. CAREER SERVICES (Resume, Interview Prep, Job Search)
    else if (
      q.includes('resume') ||
      q.includes('career service') ||
      q.includes('interview prep') ||
      q.includes('mock interview') ||
      q.includes('job search assistance') ||
      q.includes('ats resume')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `📄 **Professional Career Acceleration Packages:**

We help candidates stand out and land top compensation packages:

1. **Professional Resume Package ($99)**:
   • 100% ATS-compliant layout and structure.
   • Highlighting key technical achievements and quantifiable metrics.
   • Delivered in editable Microsoft Word (.docx) and ready-to-send PDF formats.

2. **Interview Preparation ($79)**:
   • 60-minute live 1-on-1 session with senior tech interviewers.
   • Practicing STAR-method behavioral and technical domain questions.
   • Actionable feedback scorecard to refine your delivery.

3. **Job Search Assistance ($79)**:
   • Curated matching to active client requirements and partner pipelines.
   • Application guidance and strategic follow-ups.`,
        timestamp: now,
        cta: { label: 'View Career Packages', path: '/career-services' },
        quickReplies: [
          { label: '📝 Get Resume Package ($99)', action: 'career_services' },
          { label: '🎯 Interview Prep ($79)', action: 'career_services' },
          { label: '💼 Job Search Assistance ($79)', action: 'career_services' },
        ],
      };
    }
    // 7. TECHNICAL CONCEPTS, CODING, TECH STACK & ARCHITECTURE
    else if (
      q.includes('react') ||
      q.includes('python') ||
      q.includes('java') ||
      q.includes('javascript') ||
      q.includes('typescript') ||
      q.includes('aws') ||
      q.includes('cloud') ||
      q.includes('devops') ||
      q.includes('docker') ||
      q.includes('kubernetes') ||
      q.includes('sql') ||
      q.includes('database') ||
      q.includes('ai') ||
      q.includes('api') ||
      q.includes('full stack') ||
      q.includes('frontend') ||
      q.includes('backend') ||
      q.includes('node')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `💻 **Technical & Architectural Guidance for "${rawQ}":**

At **SA Consultant & Staffing**, our engineers and technical consultants specialize in modern scalable stacks:

### 🛠️ Technology Capabilities:
• **Frontend Engineering**: React 18, Next.js, TypeScript, state management (Zustand/Redux), Tailwind CSS, SSR/SSG.
• **Backend & Microservices**: Node.js / Express, Python (FastAPI/Django), Java (Spring Boot, Microservices), Go.
• **Databases & Storage**: PostgreSQL, Supabase, MySQL, MongoDB, Redis caching.
• **Cloud Infrastructure & DevOps**: AWS (ECS, Lambda, S3, RDS), Docker, Kubernetes, CI/CD pipelines (GitHub Actions), Terraform Infrastructure-as-Code.
• **AI & Automation**: LLM integrations, embeddings, AI chatbot copilot implementation, automated resume parsing.

Are you looking to hire vetted engineers in this stack or build custom software?`,
        timestamp: now,
        cta: { label: 'Find Developers in this Stack', path: '/client-portal' },
        quickReplies: [
          { label: '🏢 Post Tech Requirement', action: 'client_portal' },
          { label: '🌐 Web Development Procedure', action: 'web_dev' },
          { label: '📅 Book Tech Consultation', action: 'book_call' },
        ],
      };
    }
    // 8. STAFFING MODELS (C2C, W2, 1099, Direct Hire, Staff Augmentation)
    else if (
      q.includes('w2') ||
      q.includes('1099') ||
      q.includes('direct hire') ||
      q.includes('contract to hire') ||
      q.includes('staff augmentation') ||
      q.includes('staffing model')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `💼 **Flexible Staffing Models at SA Consultant:**

We provide tailored engagement models based on your project duration and budget:

1. **Corp-to-Corp (C2C) & Contract Staffing**:
   • Deploy specialized contractors for rapid 3–12 month project deliveries.
   • Zero employer overhead; fast payroll and vendor management.

2. **Contract-to-Hire (C2H)**:
   • Evaluate candidate technical ability and team culture fit before converting to permanent staff.

3. **Direct Hire (Permanent Placement)**:
   • Full lifecycle recruitment: sourcing, multi-stage technical screening, background checks, and offer negotiation.

4. **Dedicated Dedicated Engineering Teams (Staff Augmentation)**:
   • Scale your core engineering capacity with dedicated full-stack squads.`,
        timestamp: now,
        cta: { label: 'Discuss Staffing Models', path: '/book' },
        quickReplies: [
          { label: '🏢 Post Vacancy', action: 'client_portal' },
          { label: '🤝 Talent Partner Program', action: 'partner_portal' },
          { label: '📅 Book Consultation', action: 'book_call' },
        ],
      };
    }
    // 9. BOOKINGS & CONSULTATIONS
    else if (
      q.includes('book') ||
      q.includes('consult') ||
      q.includes('schedule') ||
      q.includes('call') ||
      q.includes('meeting') ||
      q.includes('appointment')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `📅 **Schedule a 1-on-1 Hiring Consultation:**

Speak directly with our Senior Talent Director to discuss:
• Custom technical staffing specifications
• Dedicated software development project roadmaps
• Vendor and prime partnership arrangements
• Turnaround time: candidates presented within 24–48 hours.`,
        timestamp: now,
        cta: { label: 'Book 15-Min Meeting', path: '/book' },
        quickReplies: [
          { label: '✉️ Email Support Desk', action: 'contact_support' },
          { label: '🏢 Client Portal', action: 'client_portal' },
        ],
      };
    }
    // 10. CONTACT & SUPPORT
    else if (
      q.includes('contact') ||
      q.includes('email') ||
      q.includes('support') ||
      q.includes('phone') ||
      q.includes('reach') ||
      q.includes('office') ||
      q.includes('address')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `✉️ **Contact SA Consultant & Staffing:**

• **General & Technical Support**: \`support@saconsultantandstaffing.com\`
• **Client & Hiring Desk**: \`clients@saconsultantandstaffing.com\`
• **Operating Hours**: Monday – Friday, 8:00 AM – 6:00 PM EST
• **Coverage**: Serving clients and candidates across the United States.`,
        timestamp: now,
        cta: { label: 'Go to Contact Page', path: '/contact' },
        quickReplies: [
          { label: '📅 Book a Consultation', action: 'book_call' },
          { label: '🏢 Client Portal', action: 'client_portal' },
        ],
      };
    }
    // 11. UNIVERSAL COMPREHENSIVE INTELLIGENCE FOR ANY OTHER QUESTION
    else {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `💡 **Answering your question regarding "${rawQ}":**

At **SA Consultant & Staffing**, we provide specialized end-to-end IT staffing and software solutions. Here is how we can address this:

• **🌐 Custom Engineering & Web Development**: Full SDLC, modern web app architecture, UI/UX design, cloud deployment, and API integrations.
• **🏢 Client Portal**: Instant job postings, talent matching, and requesting verified candidate profiles.
• **🤝 Talent Partner Program**: High-velocity co-delivery, transparent C2C margins, and vendor management.
• **👤 Candidate Portal**: Profile management, AI resume parsing, and verified job applications.
• **💰 Pricing Plans**: Free $0 plan for employers and affordable career support packages.

Would you like more specific details on our development procedure, client portal, or talent solutions?`,
        timestamp: now,
        quickReplies: [
          { label: '🌐 Web Development Procedure', action: 'web_dev' },
          { label: '🤝 Talent Partner Program', action: 'partner_portal' },
          { label: '👤 Candidate Portal', action: 'candidate_portal' },
          { label: '🏢 Client Portal', action: 'client_portal' },
          { label: '💰 Pricing Plans', action: 'pricing' },
          { label: '✉️ Contact Support', action: 'contact_support' },
        ],
      };
    }

    setMessages((prev) => [...prev, reply]);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const textToProcess = inputText.trim();
    setInputText('');
    generateBotReply(textToProcess);
  };

  const handleQuickReply = (action: string) => {
    switch (action) {
      case 'web_dev':
        navigate('/services');
        setIsOpen(false);
        break;
      case 'candidate_portal':
        navigate('/candidate-portal');
        setIsOpen(false);
        break;
      case 'client_portal':
        navigate('/client-portal');
        setIsOpen(false);
        break;
      case 'career_services':
        navigate('/career-services');
        setIsOpen(false);
        break;
      case 'pricing':
        navigate('/pricing');
        setIsOpen(false);
        break;
      case 'find_candidates':
        navigate('/client-portal');
        setIsOpen(false);
        break;
      case 'jobs':
        navigate('/jobs');
        setIsOpen(false);
        break;
      case 'book_call':
        navigate('/book');
        setIsOpen(false);
        break;
      case 'contact_support':
        navigate('/contact');
        setIsOpen(false);
        break;
      case 'partner_portal':
        navigate('/partnership');
        setIsOpen(false);
        break;
      case 'signup_free':
        navigate('/auth?mode=signup&returnTo=%2Fbusiness%2Fonboarding');
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-fade-in">
          {/* Welcome Tooltip Badge */}
          <div
            onClick={handleToggleChat}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-card border border-primary/20 shadow-xl cursor-pointer hover:border-primary transition-all duration-300 text-xs font-semibold text-foreground group"
          >
            <Sparkles className="w-4 h-4 text-primary animate-spin-slow" />
            <span>Need help? Ask AI Assistant anything!</span>
          </div>

          <button
            onClick={handleToggleChat}
            aria-label="Open AI Assistant"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary via-primary to-amber-600 text-white shadow-2xl hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center relative group border-2 border-white/20"
          >
            <Bot className="w-7 h-7 transition-transform group-hover:rotate-6" />
            {/* Online Indicator Badge */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background shadow-sm animate-pulse" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 flex flex-col bg-card/95 backdrop-blur-xl border border-border/70 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
            isMinimized
              ? 'w-[320px] sm:w-[360px] h-[72px]'
              : 'w-[calc(100vw-32px)] sm:w-[420px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-primary via-primary/95 to-amber-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner relative">
                <Bot className="w-6 h-6 text-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-primary" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  SA Elevate AI
                  <Badge className="bg-white/20 hover:bg-white/30 text-[10px] text-white px-1.5 py-0 border-none font-semibold">
                    Online
                  </Badge>
                </h3>
                <p className="text-[11px] text-white/80 font-medium">Ask any question • Instant replies</p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleResetChat}
                title="Restart chat"
                className="w-8 h-8 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="w-8 h-8 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="w-8 h-8 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-background/50 via-background to-muted/20 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] rounded-2xl p-3.5 shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                          : 'bg-card border border-border/60 text-foreground rounded-tl-none space-y-2.5'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed text-xs space-y-1.5">
                        {msg.text.split('\n\n').map((paragraph, pIdx) => (
                          <p key={pIdx}>
                            {paragraph.split('**').map((chunk, cIdx) =>
                              cIdx % 2 === 1 ? <strong key={cIdx}>{chunk}</strong> : chunk
                            )}
                          </p>
                        ))}
                      </div>

                      {/* CTA Button in Message */}
                      {msg.cta && (
                        <Button
                          onClick={() => {
                            navigate(msg.cta!.path);
                            setIsOpen(false);
                          }}
                          size="sm"
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold h-8 rounded-xl flex items-center justify-center gap-1.5 shadow-sm mt-2"
                        >
                          <span>{msg.cta.label}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      )}

                      {/* Quick Reply Chips */}
                      {msg.quickReplies && msg.quickReplies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {msg.quickReplies.map((qr, qrIdx) => (
                            <button
                              key={qrIdx}
                              onClick={() => handleQuickReply(qr.action)}
                              className="px-2.5 py-1 rounded-lg bg-primary/5 hover:bg-primary/15 border border-primary/20 text-primary font-semibold text-[11px] transition-colors flex items-center gap-1 text-left"
                            >
                              <span>{qr.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <span
                        className={`text-[9px] block text-right mt-1 ${
                          msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0 mt-0.5 border border-border">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-card border border-border/60 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-card border-t border-border/60">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Input
                    placeholder="Ask about web dev, talent partner, portals, pricing..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 text-xs h-10 rounded-xl bg-background border-border/70 focus-visible:ring-primary"
                  />
                  <Button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>

                {/* Fast Action Shortcuts */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2 px-1">
                  <span>💡 Powered by SA Elevate AI</span>
                  <span className="font-semibold text-primary">Instant Answers</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatbot;
