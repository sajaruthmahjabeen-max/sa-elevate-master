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
  Smile,
  Heart,
  Coffee,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Square,
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
    text: 'Hello! 👋 I am **SA Elevate AI**, your intelligent Assistant.\n\nYou can chat with me using **text or your voice 🎙️** and ask **ANY question**! From everyday questions (*"What do you eat?"*, *"What are you doing?"*) to **Website Development**, **Talent Partnering**, **Candidate & Client Portals**, and **Pricing**.\n\nHow can I help you today?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    quickReplies: [
      { label: '🌐 Website Development Procedure', action: 'web_dev' },
      { label: '🤝 Talent Partner Program', action: 'partner_portal' },
      { label: '👤 Candidate Portal', action: 'candidate_portal' },
      { label: '🏢 Client Portal (Post Job)', action: 'client_portal' },
      { label: '💰 Pricing Plans', action: 'pricing' },
      { label: '😄 Tell me a joke!', action: 'joke' },
    ],
  },
];

// Helper to strip markdown for crystal-clear text-to-speech
function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/[*_~`#]/g, '') // remove markdown symbols
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // replace links with label
    .replace(/•/g, '') // remove bullet points
    .replace(/[-+]\s/g, '') // remove dashes
    .replace(/Phase \d+:/gi, 'Phase: ')
    .replace(/Step \d+:/gi, 'Step: ')
    .replace(/\s+/g, ' ')
    .trim();
}

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

  // Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

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

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Text-To-Speech (Speak Out Loud)
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast.error('Text-to-speech is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any previous speech
    const cleanText = stripMarkdownForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.includes('en-US') || v.lang.includes('en-GB') || v.lang.includes('en')
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop Speaking
  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Speech-To-Text (Voice Recognition)
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('🎙️ Listening... speak now!');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast.error('Microphone permission was denied. Please allow microphone access.');
        } else if (event.error !== 'no-speech') {
          toast.error(`Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  // Handle opening widget
  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  // Reset conversation
  const handleResetChat = () => {
    stopSpeaking();
    setMessages(INITIAL_MESSAGES);
    sessionStorage.removeItem('sa_chatbot_messages');
    toast.info('Chat conversation reset.');
  };

  // Universal ChatGPT-Style Intelligent Conversation Engine
  const generateBotReply = async (userText: string) => {
    const rawQ = userText.trim();
    // Normalize string: lowercase, remove non-alphanumeric except spaces, trim extra whitespace
    const q = rawQ.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

    // Natural typing delay simulation
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 650));
    setIsTyping(false);

    let reply: Message;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // ==========================================
    // 🍕 CASUAL & CHATGPT-STYLE CONVERSATIONS
    // ==========================================

    // Warm Welcome on Hi / Hello / Hey / Greetings
    const isGreeting =
      q === 'hi' ||
      q === 'hii' ||
      q === 'hiii' ||
      q === 'hello' ||
      q === 'helloo' ||
      q === 'hey' ||
      q === 'heyy' ||
      q === 'hi there' ||
      q === 'hello there' ||
      q === 'hey there' ||
      q === 'greetings' ||
      q === 'welcome' ||
      q === 'good morning' ||
      q === 'good afternoon' ||
      q === 'good evening' ||
      q.startsWith('hi ') ||
      q.startsWith('hii ') ||
      q.startsWith('hello ') ||
      q.startsWith('hey ') ||
      q.includes('good morning') ||
      q.includes('good afternoon') ||
      q.includes('good evening');

    if (isGreeting) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `👋 **Warm Welcome to SA Consultant & Staffing!** ✨\n\nI am thrilled to have you here! I am **SA Elevate AI**, your intelligent Assistant.\n\nWhether you are a **student or job seeker** looking for your dream job, an **employer/client** searching for top talent, or looking for **website development**, I'm here to assist you!\n\nHow can I help you today?`,
        timestamp: now,
        quickReplies: [
          { label: '👤 Candidate Portal (Find a Job)', action: 'candidate_portal' },
          { label: '🏢 Client Portal (Hire Talent)', action: 'client_portal' },
          { label: '💼 View Job Postings', action: 'jobs' },
          { label: '🌐 Web Development Procedure', action: 'web_dev' },
          { label: '🌟 Our Services', action: 'services_info' },
        ],
      };
    }

    // What do you eat?
    else if (
      q.includes('what you eat') ||
      q.includes('what do you eat') ||
      q.includes('do you eat') ||
      q.includes('what is your food') ||
      q.includes('what do you drink') ||
      q.includes('what did you eat')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🍕 **Haha, what do I eat?**\n\nAs an AI, I don't eat food or drink water! I run entirely on **cloud compute, electricity, algorithms, and clean code** ⚡.\n\n...Though if I *could* eat, I'd probably love a slice of hot cheesy pizza, some biryani, and a warm cup of coffee ☕!\n\nWhat is your favorite food? Or is there something exciting I can help you build today?`,
        timestamp: now,
        quickReplies: [
          { label: '🍕 What else can you do?', action: 'what_can_you_do' },
          { label: '🌐 Website Development Procedure', action: 'web_dev' },
          { label: '😄 Tell me a joke', action: 'joke' },
        ],
      };
    }
    // What are you doing?
    else if (
      q.includes('what are you doing') ||
      q.includes('what r u doing') ||
      q.includes('what you doing') ||
      q.includes('what doing') ||
      q.includes('what are u doing')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `💬 **What am I doing right now?**\n\nI am right here having a great conversation with you! 😊\n\nBesides chatting, I'm also helping clients post jobs, guiding developers through our Candidate Portal, and explaining website engineering procedures.\n\nHow is your day going? What are you working on today?`,
        timestamp: now,
        quickReplies: [
          { label: '😄 Tell me a joke', action: 'joke' },
          { label: '🌐 Web Development Procedure', action: 'web_dev' },
          { label: '🏢 Client Portal', action: 'client_portal' },
        ],
      };
    }
    // How are you?
    else if (
      q.includes('how are you') ||
      q.includes('how r u') ||
      q.includes('how are u') ||
      q.includes('hows it going') ||
      q.includes("how's it going") ||
      q.includes('how do you do')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `✨ I am doing fantastic! Thank you for asking. 🚀\n\nMy servers are running at 100% speed and I'm ready to answer any question you have — whether you want to chat casually, write some code, explore tech stacks, or hire top talent.\n\nHow are you doing today?`,
        timestamp: now,
        quickReplies: [
          { label: 'I am doing great!', action: 'doing_great' },
          { label: '🌐 Web Development Procedure', action: 'web_dev' },
          { label: '🤝 Talent Partner Program', action: 'partner_portal' },
        ],
      };
    }
    // Doing great response
    else if (q.includes('doing great') || q.includes('i am good') || q.includes('im good') || q.includes('doing fine') || q.includes('all good')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Awesome to hear that! 🎉 Positive energy is the best.\n\nWhat would you like to explore today? I'm ready for anything you want to throw at me!`,
        timestamp: now,
        quickReplies: [
          { label: '🌐 Website Development Procedure', action: 'web_dev' },
          { label: '🏢 Client Portal', action: 'client_portal' },
          { label: '💰 Pricing Plans', action: 'pricing' },
          { label: '😄 Tell me a joke', action: 'joke' },
        ],
      };
    }
    // Tell me a joke
    else if (q.includes('joke') || q.includes('make me laugh') || q.includes('funny')) {
      const jokes = [
        "Why do programmers prefer dark mode?\n\nBecause light attracts bugs! 🐛😂",
        "Why did the JavaScript developer wear glasses?\n\nBecause they didn't C#! 👓🤣",
        "There are 10 types of people in the world:\n\nThose who understand binary, and those who don't! 🤖",
        "Why did the web developer leave the restaurant?\n\nBecause of the table layout! 🍽️💻",
        "A SQL query walks into a bar, walks up to two tables and asks: *'Can I join you?'* 🍻",
      ];
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `😄 **Here's a joke for you:**\n\n${randomJoke}\n\nWant another one, or have any other questions for me?`,
        timestamp: now,
        quickReplies: [
          { label: '😂 Tell another joke!', action: 'joke' },
          { label: '🌐 Web Development Procedure', action: 'web_dev' },
          { label: '🤝 Talent Partner Program', action: 'partner_portal' },
        ],
      };
    }
    // Who are you / Identity
    else if (
      q.includes('who are you') ||
      q.includes('what is your name') ||
      q.includes('who created you') ||
      q.includes('who made you') ||
      q.includes('what are you') ||
      q.includes('what can you do')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🤖 **I am SA Elevate AI!**\n\nThink of me like your friendly AI co-pilot (similar to ChatGPT), equipped with **voice recognition 🎙️**, **speech audio 🔊**, and extensive knowledge in **software engineering**, **recruitment**, and **general human conversation**!\n\n**You can ask me:**\n• 🌐 **Website Development Procedure**: 4-step process (Requirements ➔ Development ➔ Testing ➔ Deploy).\n• 👤 **Candidate Portal**: Submit resumes and we find the right job for you.\n• 💼 **Job Postings**: Active company openings at SA Consultant.\n• 🏢 **Client Portal**: Post job openings and we match top talent.\n• 🌟 **Our 4 Services**: Website Creation, Marketing, Staffing & Content.\n• 💰 **Pricing & Plans**: Free plan, Starter plan, and career packages.\n• 💬 **Any everyday or technical question!**`,
        timestamp: now,
        quickReplies: [
          { label: '🌐 Web Development Procedure', action: 'web_dev' },
          { label: '🤝 Talent Partner Program', action: 'partner_portal' },
          { label: '🏢 Client Portal', action: 'client_portal' },
          { label: '💰 Pricing Plans', action: 'pricing' },
        ],
      };
    }
    // Gratitude & Politeness
    else if (q.includes('thank') || q.includes('thanks') || q.includes('thx') || q.includes('appreciate') || q.includes('tq')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `You're very welcome! 😊 Glad I could help.\n\nFeel free to speak or type anything else whenever you're curious!`,
        timestamp: now,
        quickReplies: [
          { label: '🌐 Web Development Procedure', action: 'web_dev' },
          { label: '🏢 Client Portal', action: 'client_portal' },
          { label: '📅 Book a Consultation', action: 'book_call' },
        ],
      };
    }
    // Goodbyes
    else if (q.includes('bye') || q.includes('goodbye') || q.includes('good night') || q.includes('see you') || q.includes('cya')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Goodbye! 👋 Have a wonderful day/night ahead! Whenever you need anything, I'll be right here waiting. Take care! ✨`,
        timestamp: now,
      };
    }
    // Story or Creative writing
    else if (q.includes('tell me a story') || q.includes('write a poem') || q.includes('story')) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `📖 **The Tale of the Dream Code:**\n\nOnce upon a time in Silicon Valley, a passionate developer sat beneath the glow of dual monitors. The clock struck midnight, and a challenging bug lingered on line 42.\n\nInstead of giving up, they took a sip of warm coffee, refactored their state management, and deployed to production. Suddenly, the build turned **🟢 Green** across all CI/CD pipelines.\n\nThe moral? *With determination, great architecture, and the right team, any digital dream can become reality!* 🚀\n\nWhat kind of digital project are you building?`,
        timestamp: now,
        quickReplies: [
          { label: '🌐 Website Development Procedure', action: 'web_dev' },
          { label: '🏢 Post a Job Requirement', action: 'client_portal' },
        ],
      };
    }

    // ==========================================
    // 🌐 CORE DOMAIN KNOWLEDGE & SPECIFIC TOPICS
    // ==========================================

    // 0A. ABOUT SA CONSULTANT / WHO WE ARE
    else if (
      q.includes('about sa consultant') ||
      q.includes('about us') ||
      q.includes('who is sa consultant') ||
      q.includes('tell me about sa consultant') ||
      q.includes('what is sa consultant') ||
      q.includes('about company') ||
      q.includes('about your company') ||
      q.includes('tell me about the company') ||
      q === 'about'
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🏢 **About SA Consultant & Staffing Solutions:**

**SA Consultant & Staffing Solutions** is a premier consulting and staffing agency that blends digital innovation with top-tier talent solutions to help businesses thrive.

### 🎯 Our Mission
• To empower businesses with innovative digital solutions and exceptional staffing services that drive measurable growth and lasting success.

### 👁️ Our Vision
• To be the most trusted global partner for businesses seeking transformation through technology, talent, and strategic consulting.

### ⚡ Our Core Values
• **Excellence**: High-performance software engineering and top 1% candidate vetting.
• **Integrity**: Transparent margins, predictable net-terms, and long-term client trust.
• **Innovation**: Modern tech stacks (React, Node, Cloud, AI), agile sprints, and automated ATS matching.

### 🌟 What We Deliver:
1. **🌐 Website Creation**: Custom, SEO-optimized, high-converting web apps.
2. **📢 Digital Marketing**: PPC, social media growth, and analytics.
3. **👥 Staffing Solutions**: Executive search, C2C, and contract-to-hire.
4. **🎨 Content Creation**: Branding, video production, and UI/UX design.`,
        timestamp: now,
        cta: { label: 'Visit About Us Page', path: '/about' },
        quickReplies: [
          { label: '🌟 Our Core Services', action: 'services_info' },
          { label: '🌐 Web Development Procedure', action: 'web_dev' },
          { label: '🏢 Client Portal (Post Job)', action: 'client_portal' },
          { label: '🤝 Talent Partner Program', action: 'partner_portal' },
        ],
      };
    }

    // 0B. WHAT SERVICES DO WE PROVIDE / OUR SERVICES
    else if (
      q.includes('what are the services') ||
      q.includes('what services') ||
      q.includes('our services') ||
      q.includes('services provided') ||
      q.includes('services we offer') ||
      q.includes('services we provide') ||
      q.includes('what do you provide') ||
      q.includes('what do you offer') ||
      q === 'services'
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🌟 **Our Core Services at SA Consultant & Staffing:**

We offer 4 comprehensive solutions designed to elevate your business:

### 1️⃣ 🌐 Website Creation
• Stunning, high-performance websites and web applications tailored to your brand and built for high conversion.
• **Key Features**: Custom Design, SEO Optimized, Mobile-First Architecture.

### 2️⃣ 📢 Digital Marketing
• Data-driven marketing strategies that amplify your brand presence and deliver measurable ROI.
• **Key Features**: Social Media Campaigns, PPC Ads, Analytics & Conversion Tracking.

### 3️⃣ 👥 Staffing Solutions
• Connect with vetted, top-tier technical talent to build high-performing engineering squads.
• **Key Features**: Executive Search, Contract / C2C Staffing, Direct Placement, RPO.

### 4️⃣ 🎨 Content Creation
• Engaging digital content that tells your story, captivates audiences, and builds brand authority.
• **Key Features**: Video Production, High-Converting Copywriting, Brand Identity.`,
        timestamp: now,
        cta: { label: 'Explore Services Page', path: '/services' },
        quickReplies: [
          { label: '🌐 Web Development Procedure', action: 'web_dev' },
          { label: '👥 Find Technical Talent', action: 'find_candidates' },
          { label: '🏢 Client Portal (Post Job)', action: 'client_portal' },
          { label: '🤝 Talent Partner Program', action: 'partner_portal' },
        ],
      };
    }

    // 1. WEBSITE DEVELOPMENT PROCEDURE & SOFTWARE ENGINEERING
    else if (
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
        text: `🌐 **Website Development Procedure at SA Consultant:**

We follow a structured 4-step procedure to deliver high-quality websites and applications:

### 1️⃣ Step 1: Client Requirements
• Gathering your business goals, target audience, branding, and feature specifications.
• Defining project scope, timeline, and technology stack.

### 2️⃣ Step 2: Development
• Crafting responsive UI/UX designs and writing clean, modern, and scalable code.
• Full-stack frontend and backend engineering with database and API integrations.

### 3️⃣ Step 3: Testing
• Comprehensive quality assurance (QA), cross-browser, and mobile device testing.
• Security checks, performance optimization, and bug fixing.

### 4️⃣ Step 4: Deploy
• Cloud server configuration, SSL certificate setup, and live launch.
• Final client walkthrough, go-live verification, and ongoing maintenance support.`,
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
      q.includes('student') ||
      q.includes('how to apply') ||
      q.includes('apply for job') ||
      q.includes('upload resume') ||
      q.includes('submit resume') ||
      q.includes('job portal')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `👤 **Candidate Portal at SA Consultant:**

The **Candidate Portal** is where **students and job seekers submit their resumes**, and **we will find the right job for you!**

### 🚀 How It Works:
1. **Submit Your Resume**: Sign up and upload your resume (PDF/Word).
2. **AI Profile Matching**: Our system organizes your skills, education, and experience.
3. **We Find the Right Job**: Our recruitment team matches your profile with top open tech roles.
4. **Track Your Application**: Live status tracking from review to interview and offer!

### 📄 Career Growth Services:
• **Professional Resume Package ($99)**: ATS-optimized layout
• **1-on-1 Mock Interview Prep ($79)**: Practice with technical mentors
• **Job Search Assistance ($79)**: Targeted career guidance and matching`,
        timestamp: now,
        cta: { label: 'Submit Resume in Candidate Portal', path: '/candidate-portal' },
        quickReplies: [
          { label: '👤 Open Candidate Portal', action: 'candidate_portal' },
          { label: '💼 View Job Postings', action: 'jobs' },
          { label: '📄 Resume Services ($99)', action: 'career_services' },
        ],
      };
    }
    // 4A. JOB POSTING (SA CONSULTANT OPENINGS)
    else if (
      q.includes('job posting') ||
      q.includes('job postings') ||
      q.includes('open jobs') ||
      q.includes('vacancies') ||
      q.includes('active jobs') ||
      q.includes('postings')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `💼 **Job Postings at SA Consultant:**

Whenever **SA Consultant has any job openings**, we **post them on our platform** so students and professionals can view and apply!

### 🔍 How Job Postings Work:
• **Active Openings**: Explore verified vacancies across Software Development, Full Stack, Cloud, DevOps, UI/UX, and more.
• **1-Click Apply**: Easily submit your profile for any open role directly through the platform.
• **Direct Review**: Our hiring team evaluates incoming applications and contacts qualified candidates for interviews.`,
        timestamp: now,
        cta: { label: 'Explore Active Job Postings', path: '/jobs' },
        quickReplies: [
          { label: '💼 View Active Jobs', action: 'jobs' },
          { label: '👤 Candidate Portal', action: 'candidate_portal' },
          { label: '🏢 Client Portal', action: 'client_portal' },
        ],
      };
    }
    // 4B. CLIENT PORTAL (FOR CLIENTS POSTING JOBS)
    else if (
      q.includes('client portal') ||
      q.includes('post job') ||
      q.includes('post a job') ||
      q.includes('hire candidate') ||
      q.includes('hire developer') ||
      q.includes('employer portal') ||
      q.includes('employer') ||
      q.includes('hiring manager') ||
      q.includes('client')
    ) {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🏢 **Client Portal at SA Consultant:**

If any **client or employer has a job opening**, they can **post it in the Client Portal**, and **we will search and find the best pre-vetted candidates for them!**

### ⚡ How the Client Portal Works for Clients:
1. **Post Your Job**: Enter your job requirements, skills, experience level, budget, and urgency.
2. **Instant Sync**: Your job is immediately submitted to our specialized recruiting team.
3. **We Search Candidates For You**: We review our vetted candidate database and identify top-tier talent matching your requirements.
4. **Direct Intro & Interviews**: Request candidate intros and start interviewing top candidates quickly!`,
        timestamp: now,
        cta: { label: 'Go to Client Portal', path: '/client-portal' },
        quickReplies: [
          { label: '🏢 Post a Job in Client Portal', action: 'client_portal' },
          { label: '👥 Search Talent Database', action: 'find_candidates' },
          { label: '📅 Book a Hiring Call', action: 'book_call' },
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

• **Email Support**: \`support@saconsultantandstaffing.com\`
• **Coverage**: Serving clients and candidates across the United States.`,
        timestamp: now,
        cta: { label: 'Go to Contact Page', path: '/contact' },
        quickReplies: [
          { label: '📅 Book a Consultation', action: 'book_call' },
          { label: '🏢 Client Portal', action: 'client_portal' },
        ],
      };
    }
    // 11. GENERAL KNOWLEDGE / CONVERSATION SYNTHESIZER
    else {
      reply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `💡 **Regarding "${rawQ}":**\n\nThat's an interesting question! Here is my breakdown:\n\n• **Core Concept**: Whether you're exploring technical architectures, career strategies, or general knowledge, having a structured approach and clear roadmap yields the best outcome.\n• **Tech & Staffing Angle**: At **SA Consultant & Staffing**, we apply structured engineering methodologies for web development, talent acquisition, and software modernization.\n• **Next Steps**: Let me know if you would like me to dive deeper into this topic, write code, or guide you through our engineering & staffing solutions!`,
        timestamp: now,
        quickReplies: [
          { label: '🌐 Web Development Procedure', action: 'web_dev' },
          { label: '🤝 Talent Partner Program', action: 'partner_portal' },
          { label: '👤 Candidate Portal', action: 'candidate_portal' },
          { label: '🏢 Client Portal', action: 'client_portal' },
          { label: '💰 Pricing Plans', action: 'pricing' },
          { label: '😄 Tell me a joke', action: 'joke' },
        ],
      };
    }

    setMessages((prev) => [...prev, reply]);

    // If auto voice output is enabled, speak the answer out loud
    if (isVoiceOutputEnabled) {
      speakText(reply.text);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    if (isSpeaking) {
      stopSpeaking();
    }

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
    if (isSpeaking) stopSpeaking();

    switch (action) {
      case 'services_info':
        generateBotReply('What are the services we provide?');
        break;
      case 'web_dev':
        generateBotReply('What is the website development procedure?');
        break;
      case 'partner_portal':
        generateBotReply('Tell me about the Talent Partner Program');
        break;
      case 'candidate_portal':
        generateBotReply('How does the Candidate Portal work?');
        break;
      case 'client_portal':
        generateBotReply('How does the Client Portal work and how do I post a job?');
        break;
      case 'pricing':
        generateBotReply('What are the pricing plans and packages?');
        break;
      case 'joke':
        generateBotReply('Tell me a funny joke!');
        break;
      case 'what_can_you_do':
        generateBotReply('What can you do?');
        break;
      case 'doing_great':
        generateBotReply('I am doing great!');
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
      case 'career_services':
        navigate('/career-services');
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
            <span>Voice Assistant & Chatbot! 🎙️</span>
          </div>

          <button
            onClick={handleToggleChat}
            aria-label="Open AI Voice Assistant"
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
              : 'w-[calc(100vw-32px)] sm:w-[430px] h-[610px] max-h-[88vh]'
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
                  <Badge className="bg-white/20 hover:bg-white/30 text-[10px] text-white px-1.5 py-0 border-none font-semibold flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 text-emerald-300 animate-pulse" />
                    Voice Ready
                  </Badge>
                </h3>
                <p className="text-[11px] text-white/80 font-medium">Talk or Type • Instant answers</p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              {/* Voice Output Toggle */}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (isVoiceOutputEnabled) {
                    stopSpeaking();
                    setIsVoiceOutputEnabled(false);
                    toast.info('Voice audio output muted 🔇');
                  } else {
                    setIsVoiceOutputEnabled(true);
                    toast.success('Voice audio output enabled 🔊 (AI will read replies out loud)');
                  }
                }}
                title={isVoiceOutputEnabled ? 'Mute audio output' : 'Enable audio speech output'}
                className={`w-8 h-8 rounded-full ${
                  isVoiceOutputEnabled
                    ? 'bg-white/25 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {isVoiceOutputEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4" />}
              </Button>

              {/* Stop Speaking Button (visible only when speaking) */}
              {isSpeaking && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={stopSpeaking}
                  title="Stop Speaking"
                  className="w-8 h-8 rounded-full bg-red-500/30 text-white animate-pulse hover:bg-red-500/50"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </Button>
              )}

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
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
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
                      className={`max-w-[88%] rounded-2xl p-3.5 shadow-sm relative group ${
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
                            stopSpeaking();
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

                      <div className="flex items-center justify-between pt-1 mt-1 border-t border-border/30">
                        {/* Audio Listen Button for Bot Messages */}
                        {msg.sender === 'bot' && (
                          <button
                            onClick={() => speakText(msg.text)}
                            title="Read this message out loud"
                            className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </button>
                        )}
                        <span
                          className={`text-[9px] ml-auto ${
                            msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
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

              {/* Listening Active Pulse Bar */}
              {isListening && (
                <div className="px-4 py-2 bg-gradient-to-r from-red-500/10 via-primary/10 to-red-500/10 border-t border-red-500/20 flex items-center justify-between text-xs font-semibold text-red-500 animate-pulse">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 animate-bounce" />
                    <span>Listening to your voice... Speak your question!</span>
                  </div>
                  <button
                    onClick={toggleListening}
                    className="text-[11px] underline hover:text-red-700 font-bold"
                  >
                    Done
                  </button>
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 bg-card border-t border-border/60">
                <form onSubmit={handleSendMessage} className="flex items-center gap-1.5">
                  <Input
                    placeholder={isListening ? "Listening to your voice..." : "Type or speak ('Web dev procedure', 'Hi')..."}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 text-xs h-10 rounded-xl bg-background border-border/70 focus-visible:ring-primary"
                  />

                  {/* Microphone Voice Input Button */}
                  <Button
                    type="button"
                    onClick={toggleListening}
                    title={isListening ? 'Stop listening' : 'Click to Speak (Voice Input)'}
                    className={`h-10 w-10 rounded-xl shrink-0 transition-all duration-300 shadow-sm ${
                      isListening
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse ring-2 ring-red-400'
                        : 'bg-muted hover:bg-primary/15 text-muted-foreground hover:text-primary border border-border'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>

                  {/* Send Button */}
                  <Button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>

                {/* Voice Status Indicator & Fast Shortcuts */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2 px-1">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>🎙️ Mic enabled • 🔊 Audio ready</span>
                  </div>
                  <span className="font-semibold text-primary">SA Elevate AI</span>
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
