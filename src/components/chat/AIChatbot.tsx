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
        text: 'Hello there! 👋 How can I assist you today? Feel free to ask me anything about:\n\n• **Hiring & Staffing** (Post jobs, find vetted developers)\n• **Career Support** (Resume writing, mock interviews, job search)\n• **Technical Skills** (React, Java, Python, Cloud, DevOps)\n• **Pricing & Consultations**',
        timestamp: now,
        quickReplies: [
          { label: '🏢 Post a Job', action: 'client_portal' },
          { label: '📄 Resume Services ($99)', action: 'career_services' },
          { label: '👥 Find Developers', action: 'find_candidates' },
          { label: '📅 Book a Consultation', action: 'book_call' },
        ],
      };
    }
    // 2. WHO ARE YOU / IDENTITY
    else if (q.includes('who are you') || q.includes('what is your name') || q.includes('what can you do') || q.includes('about you')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🤖 I am **SA Elevate AI**, an intelligent recruitment and career co-pilot for **SA Consultant & Staffing**.\n\nI can answer questions on:\n1. 🏢 **Client Portal**: Posting vacancies and hiring talent\n2. 📄 **Career Services**: Resume packages, interview coaching\n3. 💡 **Technical Knowledge**: Tech stacks, IT staffing, hiring models\n4. 💰 **Pricing & Plans**: Free and Starter subscriptions\n5. 📅 **Consultation Booking**: Direct access to talent directors',
        timestamp: now,
        cta: { label: 'Explore Client Portal', path: '/client-portal' },
        quickReplies: [
          { label: '🏢 Post a Job', action: 'client_portal' },
          { label: '📄 Career Services', action: 'career_services' },
        ],
      };
    }
    // 3. POSTING JOBS & CLIENT PORTAL
    else if (q.includes('post job') || q.includes('post a job') || q.includes('hire someone') || q.includes('need developer') || q.includes('client portal')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🏢 **Post a Job in the Client Portal:**\n\nOur Client Portal allows employers to:\n• Post hiring requirements in under 2 minutes\n• Define skills, seniority, salary range, and urgency\n• Match directly with our verified talent database\n• Track candidate assignments in real time',
        timestamp: now,
        cta: { label: 'Go to Client Portal', path: '/client-portal' },
        quickReplies: [
          { label: '👥 Explore Candidate Database', action: 'find_candidates' },
          { label: '📅 Book Hiring Consultation', action: 'book_call' },
        ],
      };
    }
    // 4. CAREER SERVICES, RESUME & INTERVIEW
    else if (q.includes('resume') || q.includes('career service') || q.includes('interview') || q.includes('job search assistance')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '📄 **Professional Career Services:**\n\nWe provide 3 targeted career acceleration packages:\n\n1. **Professional Resume Package ($99)**: ATS-optimized formatting, job-tailored content in PDF & DOCX.\n2. **Interview Preparation ($79)**: 60-min 1-on-1 mock interview with personalized feedback and behavioral tips.\n3. **Job Search Assistance ($79)**: Targeted job matching strategy, direct application guidance, and tracking support.',
        timestamp: now,
        cta: { label: 'View Career Packages', path: '/career-services' },
        quickReplies: [
          { label: '📝 Get Resume Package ($99)', action: 'career_services' },
          { label: '🎯 Book Interview Prep ($79)', action: 'career_services' },
        ],
      };
    }
    // 5. PRICING & PLANS
    else if (q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('how much') || q.includes('plan')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '💰 **Subscription & Hiring Plans:**\n\n• **Free Plan ($0/mo)**: Post unlimited job listings, basic ATS applicant management, candidate matching notifications.\n• **Starter Plan ($39/mo)**: *(Currently Under Development)* — Will include AI resume auto-parsing, direct application links, SMS alerts, and discounted resume unlocks.',
        timestamp: now,
        cta: { label: 'View Full Pricing Table', path: '/pricing' },
        quickReplies: [
          { label: '🚀 Start on Free Plan', action: 'signup_free' },
          { label: '🏢 Post in Client Portal', action: 'client_portal' },
        ],
      };
    }
    // 6. CANDIDATES & TALENT POOL
    else if (q.includes('candidate') || q.includes('talent') || q.includes('developer') || q.includes('engineer') || q.includes('designer')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '👥 **Pre-Screened Talent Database:**\n\nWe specialize in vetted professionals across top disciplines:\n• **Full Stack & Frontend**: React, TypeScript, Vue, Angular, Next.js\n• **Backend & Cloud**: Java, Spring Boot, Python, Node.js, AWS, Azure, GCP\n• **DevOps & Data**: Kubernetes, Docker, Terraform, CI/CD, SQL, AI/ML\n• **UI/UX & Design**: Figma, Design Systems, Graphic & Product Design\n\nAll candidates are pre-screened for technical proficiency.',
        timestamp: now,
        cta: { label: 'Browse Candidates', path: '/client-portal' },
        quickReplies: [
          { label: '🏢 Post Your Vacancy', action: 'client_portal' },
          { label: '📅 Book Consultation', action: 'book_call' },
        ],
      };
    }
    // 7. TECHNICAL & CODING QUESTIONS (React, Python, Java, Cloud, DevOps, etc.)
    else if (q.includes('react') || q.includes('python') || q.includes('java') || q.includes('javascript') || q.includes('typescript') || q.includes('aws') || q.includes('devops') || q.includes('docker') || q.includes('kubernetes') || q.includes('sql') || q.includes('backend') || q.includes('frontend') || q.includes('full stack')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `💻 **Technical Competency & Staffing:**\n\nYou asked about **${rawQ}**.\n\nAt **SA Consultant & Staffing**, our engineers and consultants possess extensive hands-on expertise in modern software stacks, cloud infrastructure, and DevOps pipelines. We evaluate candidates through rigorous code reviews and architectural assessments.\n\nLooking to hire specialists with these skills, or seeking career guidance in this domain?`,
        timestamp: now,
        cta: { label: 'Find Skilled Candidates', path: '/client-portal' },
        quickReplies: [
          { label: '🏢 Post Requirement', action: 'client_portal' },
          { label: '📄 Resume Review ($99)', action: 'career_services' },
        ],
      };
    }
    // 8. INTERVIEW TIPS & ADVICE
    else if (q.includes('interview tip') || q.includes('prepare for interview') || q.includes('tell me about yourself') || q.includes('salary negotiation') || q.includes('ats')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🎯 **Key Interview & Career Tips:**\n\n1. **STAR Method**: Structure answers using *Situation, Task, Action, and Result*.\n2. **Quantify Achievements**: Use metrics (e.g. *"Improved latency by 35%"*, *"Delivered $1.2M in pipeline"*).\n3. **ATS Optimization**: Mirror keywords from the target job description naturally in your resume.\n4. **Mock Practice**: 1-on-1 mock sessions build confidence and highlight blind spots.',
        timestamp: now,
        cta: { label: 'Book 1-on-1 Mock Session ($79)', path: '/career-services' },
        quickReplies: [
          { label: '🎯 Interview Preparation ($79)', action: 'career_services' },
          { label: '📄 Professional Resume ($99)', action: 'career_services' },
        ],
      };
    }
    // 9. C2C / W2 / STAFFING MODELS
    else if (q.includes('c2c') || q.includes('corp to corp') || q.includes('w2') || q.includes('1099') || q.includes('contract') || q.includes('direct hire') || q.includes('staff augmentation')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '💼 **Our Flexible Staffing Models:**\n\n• **Contract / C2C (Corp-to-Corp)**: High-speed deployment of specialized contractors.\n• **Contract-to-Hire**: Evaluate candidate culture fit and performance before full-time transition.\n• **Direct Hire / Permanent Placement**: End-to-end sourcing, screening, and placement for permanent roles.\n• **Staff Augmentation**: Rapidly scale your existing engineering and product teams.',
        timestamp: now,
        cta: { label: 'Consult with Staffing Director', path: '/book' },
        quickReplies: [
          { label: '🏢 Post Vacancy', action: 'client_portal' },
          { label: '🤝 Partnership Program', action: 'partner_portal' },
        ],
      };
    }
    // 10. BOOKING & CONSULTATIONS
    else if (q.includes('book') || q.includes('consult') || q.includes('schedule') || q.includes('call') || q.includes('meeting')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '📅 **Schedule a Dedicated Consultation:**\n\nBook a direct 15-minute consultation with our Senior Talent Director to discuss:\n• Immediate technical hiring specifications\n• Dedicated team assembly\n• Custom enterprise staffing contracts',
        timestamp: now,
        cta: { label: 'Book 15-Min Meeting', path: '/book' },
        quickReplies: [
          { label: '✉️ Contact Support', action: 'contact_support' },
          { label: '🏢 Client Portal', action: 'client_portal' },
        ],
      };
    }
    // 11. CONTACT & SUPPORT
    else if (q.includes('contact') || q.includes('email') || q.includes('support') || q.includes('phone') || q.includes('reach')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '✉️ **Contact SA Consultant & Staffing:**\n\n• **General Support**: `support@saconsultantandstaffing.com`\n• **Client & Staffing Desk**: `clients@saconsultantandstaffing.com`\n• **Working Hours**: Monday – Friday, 8:00 AM – 6:00 PM EST\n• **Location**: Serving clients and talent across the United States.',
        timestamp: now,
        cta: { label: 'Go to Contact Page', path: '/contact' },
        quickReplies: [
          { label: '📅 Book a Consultation', action: 'book_call' },
          { label: '🏢 Post in Client Portal', action: 'client_portal' },
        ],
      };
    }
    // 12. DYNAMIC CONVERSATIONAL SYNTHESIS (FOR ANY OTHER QUESTION)
    else {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `✨ **Regarding "${rawQ}":**\n\nThank you for asking! As your **SA Elevate AI Copilot**, I can provide direct answers, strategic guidance, and connect you with the right staffing solutions.\n\nHere is how we can help:\n• **Employers**: Post job specifications in our Client Portal to receive matched candidate profiles within 24–48 hours.\n• **Candidates**: Explore professional resume building, interview prep, and active job postings.\n• **Consultations**: Book a 1-on-1 strategy call with our recruitment team.\n\nWould you like more details on any of these options?`,
        timestamp: now,
        quickReplies: [
          { label: '🏢 Post a Job (Client Portal)', action: 'client_portal' },
          { label: '📄 Career Services Packages', action: 'career_services' },
          { label: '💰 Subscription Plans', action: 'pricing' },
          { label: '📅 Book Consultation', action: 'book_call' },
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
