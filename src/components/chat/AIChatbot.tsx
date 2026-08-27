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
  HelpCircle,
  Code2,
  Users,
  Award,
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
    text: 'Hello! 👋 I am **SA Elevate AI**, your intelligent Recruitment & Career Assistant.\n\nAsk me **any question** about jobs, hiring candidates, resume building, technical skills, pricing, or career advice!',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    quickReplies: [
      { label: '🏢 Post a Job (Client Portal)', action: 'client_portal' },
      { label: '📄 Career & Resume Services', action: 'career_services' },
      { label: '💰 Subscription Pricing', action: 'pricing' },
      { label: '👥 Find Verified Talent', action: 'find_candidates' },
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
    await new Promise((r) => setTimeout(r, 600));
    setIsTyping(false);

    let reply: Message;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. GREETINGS & INTRODUCTIONS
    if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|sup|hola)\b/i.test(q)) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Hello! 👋 Welcome to **SA Elevate AI Assistant**.\n\nI can assist you across all our services and engineering solutions:\n\n• 🌐 **Website & Software Development Procedure**\n• 🤝 **Talent Partner & Vendor Programs**\n• 👤 **Candidate Portal & Job Applications**\n• 🏢 **Client Portal & Job Postings**\n• 💰 **Pricing & Subscription Plans**\n• 📄 **Career & Resume Packages**\n\nWhat would you like to explore?',
        timestamp: now,
        quickReplies: [
          { label: '🌐 Web Development Procedure', action: 'web_dev' },
          { label: '🤝 Talent Partner Program', action: 'partner_portal' },
          { label: '👤 Candidate Portal', action: 'candidate_portal' },
          { label: '🏢 Client Portal (Post Job)', action: 'client_portal' },
          { label: '💰 Pricing Plans', action: 'pricing' },
        ],
      };
    }
    // 2. WEBSITE DEVELOPMENT PROCEDURE & SOFTWARE ENGINEERING
    else if (q.includes('website development') || q.includes('web development') || q.includes('procedure') || q.includes('software development') || q.includes('how to build') || q.includes('development process') || q.includes('development lifecycle') || q.includes('sdlc') || q.includes('app development')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🌐 **Our End-to-End Website & Software Development Procedure:**\n\nAt **SA Consultant & Staffing**, our engineering teams follow an agile 5-stage development methodology:\n\n1. **Discovery & Architecture Planning**:\n   • Business requirement analysis & scope definition\n   • Technology stack selection (React, Next.js, Node.js, Python, PostgreSQL/Supabase)\n   • Database schema and API specification\n\n2. **UI/UX Design & Prototyping**:\n   • Wireframing and responsive interactive mockups in Figma\n   • Design system, accessibility, and modern glassmorphism aesthetics\n\n3. **Full-Stack Engineering & Agile Sprints**:\n   • Clean modular frontend components\n   • Scalable backend REST/GraphQL APIs & database integrations\n   • Bi-weekly sprint demos and client review milestones\n\n4. **Rigorous Quality Assurance & Security**:\n   • Automated unit & integration testing\n   • Cross-browser & mobile responsiveness verification\n   • Security audits, authentication & data encryption\n\n5. **Cloud Deployment & Post-Launch Support**:\n   • CI/CD automated deployment pipelines (AWS, Vercel, Docker)\n   • Performance optimization, SEO indexing, and SLA maintenance.\n\nNeed to hire a dedicated development team or build a custom web application?',
        timestamp: now,
        cta: { label: 'Schedule Tech Consultation', path: '/book' },
        quickReplies: [
          { label: '🏢 Post Web Requirement', action: 'client_portal' },
          { label: '👥 Find Full-Stack Developers', action: 'find_candidates' },
          { label: '📅 Book 15-Min Call', action: 'book_call' },
        ],
      };
    }
    // 3. TALENT PARTNER & VENDOR COLLABORATION
    else if (q.includes('talent partner') || q.includes('partner') || q.includes('partnership') || q.includes('vendor') || q.includes('c2c') || q.includes('supplier') || q.includes('sub-vendor') || q.includes('agency')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🤝 **SA Consultant Talent Partner & Vendor Program:**\n\nWe collaborate with top-tier staffing agencies, IT vendors, and independent talent recruiters nationwide.\n\n**How the Partnership Works:**\n• **Co-Delivery Model**: Submit your vetted bench candidates for high-priority client requirements.\n• **Transparent Margins**: Fast net-payment cycles with competitive C2C and direct placement splits.\n• **Vendor Portal Access**: Track client feedback, submission statuses, and interview schedules in real time.\n• **Verified Onboarding**: Simple MSA (Master Services Agreement) and fast vendor registration.\n\nReady to become an authorized Talent Partner?',
        timestamp: now,
        cta: { label: 'Join Talent Partner Program', path: '/partnership' },
        quickReplies: [
          { label: '🤝 Open Partnership Page', action: 'partner_portal' },
          { label: '🏢 View Client Openings', action: 'client_portal' },
          { label: '✉️ Contact Partner Desk', action: 'contact_support' },
        ],
      };
    }
    // 4. CANDIDATE PORTAL & JOB SEEKERS
    else if (q.includes('candidate portal') || q.includes('job seeker') || q.includes('apply for job') || q.includes('candidate account') || q.includes('find job') || q.includes('apply')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '👤 **Candidate Portal & Job Seeker Hub:**\n\nOur Candidate Portal empowers talent to connect directly with hiring managers and Fortune 500 opportunities:\n\n**What you can do:**\n• **Profile & Resume Upload**: Upload PDF resumes with AI auto-parsing into your verified profile.\n• **1-Click Job Applications**: Apply directly to full-time, contract, and remote tech roles.\n• **Application Tracking**: View live interview stages (Reviewing, Shortlisted, Interviewing, Offer).\n• **Career Enhancement**: Access resume rewriting, mock interviews, and career coaching.',
        timestamp: now,
        cta: { label: 'Open Candidate Portal', path: '/candidate-portal' },
        quickReplies: [
          { label: '💼 Browse Active Jobs', action: 'jobs' },
          { label: '📄 Resume Services ($99)', action: 'career_services' },
          { label: '👤 Candidate Portal Login', action: 'candidate_portal' },
        ],
      };
    }
    // 5. CLIENT PORTAL & EMPLOYERS
    else if (q.includes('client portal') || q.includes('post job') || q.includes('post a job') || q.includes('hire someone') || q.includes('need developer') || q.includes('employer portal') || q.includes('hiring manager')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🏢 **Client Portal for Employers & Hiring Teams:**\n\nThe Client Portal is your dedicated platform for high-velocity technical hiring:\n\n**Key Capabilities:**\n1. **Instant Job Posting**: Post vacancies in under 2 minutes with title, skills, salary range, and urgency.\n2. **Curated Candidate Matching**: Instantly discover pre-vetted engineers and consultants matching your stack.\n3. **1-Click Profile Requests**: Request verified candidate portfolios, code samples, and interview scheduling.\n4. **Cloud Synchronization**: All postings are synced in real time to our Admin Recruitment Desk.\n5. **Dedicated Support**: Direct assistance at `support@saconsultantandstaffing.com`.',
        timestamp: now,
        cta: { label: 'Go to Client Portal', path: '/client-portal' },
        quickReplies: [
          { label: '🏢 Post a Job Now', action: 'client_portal' },
          { label: '👥 Search Talent Database', action: 'find_candidates' },
          { label: '📅 Book Hiring Strategy Call', action: 'book_call' },
        ],
      };
    }
    // 6. PRICING & SUBSCRIPTION PACKAGES
    else if (q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('how much') || q.includes('package') || q.includes('plan') || q.includes('subscription')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '💰 **Transparent Pricing & Subscription Packages:**\n\nWe offer clear options tailored for hiring managers:\n\n• **Free Plan ($0/month)**: *(Active & Available)*\n  - Post unlimited job listings\n  - Basic ATS to manage applicants\n  - 3 free resume unlocks\n  - Candidate matching notifications\n\n• **Starter Plan ($39/month)**: *(Under Development)*\n  - AI Resume Auto-parsing\n  - Direct apply links & direct email resumes\n  - In-portal candidate messaging\n  - 50% off database unlocks ($2/resume)\n\n• **Career Services Packages**:\n  - Professional Resume Package: **$99**\n  - Interview Preparation: **$79**\n  - Job Search Assistance: **$79**',
        timestamp: now,
        cta: { label: 'View Pricing Page', path: '/pricing' },
        quickReplies: [
          { label: '🚀 Start Free Plan ($0)', action: 'signup_free' },
          { label: '📄 Career Services Packages', action: 'career_services' },
          { label: '🏢 Client Portal', action: 'client_portal' },
        ],
      };
    }
    // 7. CAREER SERVICES (Resume, Interview Prep, Job Search)
    else if (q.includes('resume') || q.includes('career') || q.includes('interview prep') || q.includes('mock interview') || q.includes('job assistance')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '📄 **Professional Career Acceleration Packages:**\n\nDesigned to help candidates land top-tier tech roles:\n\n1. **Professional Resume Package ($99)**:\n   • ATS-optimized layout and keyword matching\n   • Achievement-focused bullet points\n   • Delivered in editable PDF & DOCX formats\n\n2. **Interview Preparation ($79)**:\n   • 60-minute 1-on-1 mock interview\n   • Behavioral & technical question frameworks\n   • Personalized feedback & scorecards\n\n3. **Job Search Assistance ($79)**:\n   • Targeted job matching and application guidance\n   • Application tracking and recruiter outreach strategy',
        timestamp: now,
        cta: { label: 'View Career Packages', path: '/career-services' },
        quickReplies: [
          { label: '📝 Get Resume Package ($99)', action: 'career_services' },
          { label: '🎯 Interview Prep ($79)', action: 'career_services' },
          { label: '💼 Job Search Assistance ($79)', action: 'career_services' },
        ],
      };
    }
    // 8. TECHNICAL & CODING QUESTIONS (React, Java, Python, Cloud, DevOps, AI, Database)
    else if (q.includes('react') || q.includes('python') || q.includes('java') || q.includes('javascript') || q.includes('typescript') || q.includes('aws') || q.includes('devops') || q.includes('docker') || q.includes('kubernetes') || q.includes('sql') || q.includes('database') || q.includes('ai') || q.includes('frontend') || q.includes('backend') || q.includes('full stack') || q.includes('node')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `💻 **Technical Competency & Engineering Overview for "${rawQ}":**\n\nAt **SA Consultant & Staffing**, our software architects and pre-screened developers specialize in enterprise-grade technologies:\n\n• **Frontend**: React, Next.js, TypeScript, Vue, Angular, Tailwind CSS, responsive UI/UX\n• **Backend & APIs**: Node.js, Python (Django/FastAPI), Java (Spring Boot), Go, REST & GraphQL\n• **Cloud & DevOps**: AWS, GCP, Azure, Docker, Kubernetes, CI/CD automation, Terraform\n• **Data & AI**: PostgreSQL, Supabase, MongoDB, Redis, LLM integrations & AI data pipelines\n\nWe provide technical talent vetting, code assessments, and end-to-end software delivery for these technologies.`,
        timestamp: now,
        cta: { label: 'Find Developers in this Stack', path: '/client-portal' },
        quickReplies: [
          { label: '🏢 Post Tech Requirement', action: 'client_portal' },
          { label: '🌐 Development Procedure', action: 'web_dev' },
          { label: '📅 Book Tech Consultation', action: 'book_call' },
        ],
      };
    }
    // 9. BOOKING & CONSULTATIONS
    else if (q.includes('book') || q.includes('consult') || q.includes('schedule') || q.includes('call') || q.includes('meeting')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '📅 **Schedule a 1-on-1 Consultation:**\n\nSpeak directly with our Senior Talent Director to discuss:\n• Immediate contract or full-time staffing requirements\n• Custom team assembly and project delivery timelines\n• Enterprise partnership and vendor agreements',
        timestamp: now,
        cta: { label: 'Book 15-Min Meeting', path: '/book' },
        quickReplies: [
          { label: '✉️ Email Support Desk', action: 'contact_support' },
          { label: '🏢 Client Portal', action: 'client_portal' },
        ],
      };
    }
    // 10. CONTACT & SUPPORT
    else if (q.includes('contact') || q.includes('email') || q.includes('support') || q.includes('phone') || q.includes('reach')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '✉️ **Contact SA Consultant & Staffing:**\n\n• **General Inquiries & Support**: `support@saconsultantandstaffing.com`\n• **Client & Hiring Desk**: `clients@saconsultantandstaffing.com`\n• **Working Hours**: Monday – Friday, 8:00 AM – 6:00 PM EST\n• **Coverage**: Serving clients and candidates across all 50 US states.',
        timestamp: now,
        cta: { label: 'Go to Contact Page', path: '/contact' },
        quickReplies: [
          { label: '📅 Book a Consultation', action: 'book_call' },
          { label: '🏢 Client Portal', action: 'client_portal' },
        ],
      };
    }
    // 11. UNIVERSAL COMPREHENSIVE INTELLIGENCE (ANY OTHER QUESTION)
    else {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `✨ **Regarding "${rawQ}":**\n\nThank you for asking! As your **SA Elevate AI Assistant**, here is an overview of how we can address your inquiry:\n\n• **Software & Web Solutions**: Full lifecycle architecture, agile web development, and cloud deployment.\n• **Client Portal**: Post technical vacancies and hire verified developers.\n• **Talent Partnering**: Vendor co-delivery, C2C staffing, and recruiter network collaboration.\n• **Candidate Portal**: Profile management, ATS resume parsing, and active job applications.\n• **Transparent Pricing**: $0 Free plan and flexible staffing tiers.\n\nWhich area would you like to dive into?`,
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
              : 'w-[calc(100vw-32px)] sm:w-[400px] h-[580px] max-h-[85vh]'
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
                      className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                          : 'bg-card border border-border/60 text-foreground rounded-tl-none space-y-2.5'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed text-xs">
                        {msg.text.split('\n\n').map((paragraph, pIdx) => (
                          <p key={pIdx} className={pIdx > 0 ? 'mt-1.5' : ''}>
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
                        <div className="flex flex-wrap gap-1.5 pt-1">
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
                    placeholder="Ask any question about hiring, jobs, resumes, tech..."
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
                  <span className="font-semibold text-primary">Instant Response</span>
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
