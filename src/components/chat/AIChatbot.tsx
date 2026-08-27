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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
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
    text: 'Hello! 👋 Welcome to **SA Consultant & Staffing**.\n\nI am your dedicated **AI Recruitment & Career Assistant**. How can I help you today?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    quickReplies: [
      { label: '🏢 Post a Job (Client Portal)', action: 'client_portal' },
      { label: '💼 Career & Resume Services', action: 'career_services' },
      { label: '💰 Subscription Pricing', action: 'pricing' },
      { label: '👥 Find Top Talent', action: 'find_candidates' },
      { label: '📅 Book a Consultation', action: 'book_call' },
    ],
  },
];

export const AIChatbot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
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
    setHasUnread(false);
  };

  // Reset conversation
  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    sessionStorage.removeItem('sa_chatbot_messages');
    toast.info('Chat conversation reset.');
  };

  // Smart Knowledge Base Matcher
  const generateBotReply = async (userText: string) => {
    const q = userText.toLowerCase().trim();

    // Small delay for typing simulation
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 650));
    setIsTyping(false);

    let reply: Message;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (q.includes('job') && (q.includes('post') || q.includes('hire') || q.includes('client') || q.includes('portal'))) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🏢 **Post a Job in the Client Portal:**\n\nYou can easily post your staffing vacancies, define skill requirements, and immediately match with pre-screened professionals in our Client Portal.\n\nWould you like to head to the Client Portal now?',
        timestamp: now,
        cta: { label: 'Open Client Portal', path: '/client-portal', icon: 'building' },
        quickReplies: [
          { label: '👥 Find Available Candidates', action: 'find_candidates' },
          { label: '📞 Speak with Senior Recruiter', action: 'book_call' },
        ],
      };
    } else if (q.includes('resume') || q.includes('career') || q.includes('interview') || q.includes('coaching')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '📄 **Professional Career Services:**\n\nWe offer industry-leading packages tailored for job seekers:\n\n• **Professional Resume Package ($99)**: ATS-friendly formatting, customized content in PDF & DOCX.\n• **Interview Preparation ($79)**: 60-min 1-on-1 mock interview with expert feedback.\n• **Job Search Assistance ($79)**: Targeted job matches, application strategy & tracking.',
        timestamp: now,
        cta: { label: 'View Career Services', path: '/career-services', icon: 'briefcase' },
        quickReplies: [
          { label: '📝 Get Resume Package ($99)', action: 'career_services' },
          { label: '🎯 Interview Prep ($79)', action: 'career_services' },
        ],
      };
    } else if (q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('starter') || q.includes('free')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '💰 **Subscription & Hiring Plans:**\n\n• **Free Plan ($0/mo)**: Post unlimited job listings, basic ATS, and candidate matching notifications.\n• **Starter Plan ($39/mo)**: Currently *Under Development* with AI Resume Auto-parsing, direct apply links, and premium database access coming soon.',
        timestamp: now,
        cta: { label: 'Explore Pricing Plans', path: '/pricing', icon: 'dollar' },
        quickReplies: [
          { label: '🚀 Start on Free Plan', action: 'signup_free' },
          { label: '🏢 Post a Job Now', action: 'client_portal' },
        ],
      };
    } else if (q.includes('candidate') || q.includes('talent') || q.includes('developer') || q.includes('engineer') || q.includes('search')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '👥 **Find Pre-Vetted Candidates:**\n\nWe maintain a curated database of verified software engineers, full-stack developers, UI/UX designers, and executive personnel ready for immediate placement.',
        timestamp: now,
        cta: { label: 'Explore Candidate Database', path: '/client-portal', icon: 'users' },
        quickReplies: [
          { label: '🏢 Post Your Requirement', action: 'client_portal' },
          { label: '📅 Book Hiring Consultation', action: 'book_call' },
        ],
      };
    } else if (q.includes('book') || q.includes('consult') || q.includes('call') || q.includes('meeting') || q.includes('schedule')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '📅 **Schedule a Consultation:**\n\nSpeak 1-on-1 with our Senior Talent Director to assemble a specialized team or discuss your custom staffing specifications.',
        timestamp: now,
        cta: { label: 'Book 15-Min Meeting', path: '/book', icon: 'calendar' },
        quickReplies: [
          { label: '✉️ Email Support Desk', action: 'contact_support' },
          { label: '🏢 Go to Client Portal', action: 'client_portal' },
        ],
      };
    } else if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('support') || q.includes('help')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '✉️ **Reach Our Support Team:**\n\n• **Email**: `support@saconsultantandstaffing.com`\n• **Staffing Inquiries**: `clients@saconsultantandstaffing.com`\n• **Office Hours**: Mon - Fri, 8:00 AM - 6:00 PM EST\n\nYou can also submit an inquiry on our contact page.',
        timestamp: now,
        cta: { label: 'Go to Contact Page', path: '/contact', icon: 'mail' },
        quickReplies: [
          { label: '📅 Book Consultation', action: 'book_call' },
          { label: '🏢 Client Portal', action: 'client_portal' },
        ],
      };
    } else if (q.includes('partner') || q.includes('vendor') || q.includes('c2c') || q.includes('supplier')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🤝 **Partner with SA Consultant:**\n\nWe collaborate with top IT staffing agencies, prime vendors, and recruiters to co-deliver top technical talent across the USA.',
        timestamp: now,
        cta: { label: 'Partnership Program', path: '/partnership', icon: 'shield' },
        quickReplies: [
          { label: '🏢 Client Portal', action: 'client_portal' },
          { label: '✉️ Contact Support', action: 'contact_support' },
        ],
      };
    } else {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "Thank you for asking! I can help you post vacancies in our **Client Portal**, explore **Career Services**, check **Pricing Plans**, or schedule a **1-on-1 Consultation** with our staffing directors.",
        timestamp: now,
        quickReplies: [
          { label: '🏢 Post a Job (Client Portal)', action: 'client_portal' },
          { label: '📄 Career Services Packages', action: 'career_services' },
          { label: '💰 View Pricing Plans', action: 'pricing' },
          { label: '📅 Book 15-Min Call', action: 'book_call' },
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
            <span>Need help? Chat with AI Assistant</span>
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
                <p className="text-[11px] text-white/80 font-medium">Recruitment & Staffing Copilot</p>
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
                              className="px-2.5 py-1 rounded-lg bg-primary/5 hover:bg-primary/15 border border-primary/20 text-primary font-semibold text-[11px] transition-colors flex items-center gap-1"
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
                    placeholder="Ask about jobs, pricing, resumes, candidates..."
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
                  <span>💡 Instant AI assistance</span>
                  <span className="font-semibold text-primary">SA Consultant Staffing</span>
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
