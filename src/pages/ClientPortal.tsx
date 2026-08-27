import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Briefcase,
  Building2,
  Users,
  Search,
  PlusCircle,
  CheckCircle2,
  DollarSign,
  MapPin,
  Clock,
  Sparkles,
  Send,
  Loader2,
  ArrowRight,
  Filter,
  Check,
  Calendar,
  Eye,
  MessageSquare,
  ShieldCheck,
  Zap,
  PhoneCall,
  Mail,
  UserCheck,
  ChevronRight,
  UserX
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ClientJob {
  id: string;
  title: string;
  department: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  job_type: string;
  workplace_type: string;
  experience_level: string;
  location: string;
  salary_range: string;
  urgency: string;
  skills: string[];
  description: string;
  status: 'New' | 'Reviewing' | 'Matched' | 'In Interview' | 'Fulfilled' | 'Closed';
  created_at: string;
  match_count?: number;
}

interface CandidateProfile {
  id: string;
  name: string;
  title: string;
  skills: string[];
  experience: string;
  location: string;
  availability: string;
  rate: string;
  status: string;
  matchScore?: number;
}

export default function ClientPortal() {
  useSEO({
    title: 'Client Portal | Post Jobs & Find Top Talent | SA Consultant & Staffing',
    description: 'Post your company job vacancies, discover pre-vetted top tier candidates, and manage hiring requirements seamlessly with SA Consultant.',
    canonical: 'https://www.saconsultantandstaffing.com/client-portal',
  });

  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'post-job' | 'my-jobs' | 'talent-match' | 'support'>('post-job');
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  // Real Database Candidates state
  const [realCandidates, setRealCandidates] = useState<CandidateProfile[]>([]);

  // Form State for Posting a Job
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Engineering & Technology',
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    job_type: 'Full-Time',
    workplace_type: 'Remote',
    experience_level: 'Mid-Senior (3-6 yrs)',
    location: 'United States (Remote)',
    salary_range: '$80,000 - $120,000 / year',
    urgency: 'Immediate (1-2 weeks)',
    skillsInput: '',
    description: '',
  });

  const [skillsList, setSkillsList] = useState<string[]>(['React', 'TypeScript', 'Node.js']);
  const [postedJobs, setPostedJobs] = useState<ClientJob[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // 1. Fetch Real Candidates from Supabase
  useEffect(() => {
    const fetchCandidatesFromDB = async () => {
      try {
        setLoadingCandidates(true);
        // Fetch candidates from both candidates and vendor_candidates
        const [candRes, vendorCandRes] = await Promise.all([
          supabase.from('candidates').select('*').order('created_at', { ascending: false }),
          supabase.from('vendor_candidates').select('*').order('created_at', { ascending: false })
        ]);

        const combined: CandidateProfile[] = [];

        if (candRes.data && candRes.data.length > 0) {
          candRes.data.forEach((c: any) => {
            let parsedSkills: string[] = [];
            if (Array.isArray(c.skills)) {
              parsedSkills = c.skills;
            } else if (typeof c.skills === 'string') {
              try {
                parsedSkills = JSON.parse(c.skills);
              } catch (e) {
                parsedSkills = c.skills.split(',').map((s: string) => s.trim());
              }
            } else if (c.parsed_data?.skills) {
              parsedSkills = Array.isArray(c.parsed_data.skills) ? c.parsed_data.skills : [c.parsed_data.skills];
            }

            combined.push({
              id: c.id,
              name: c.name || 'Candidate',
              title: c.job_title || 'Specialist',
              skills: parsedSkills.filter(Boolean),
              experience: c.experience_years ? `${c.experience_years} Yrs Exp` : '5+ Yrs',
              location: c.location || 'Remote',
              availability: 'Available Now',
              rate: 'Competitive',
              status: c.status || 'Verified Available',
              matchScore: 95,
            });
          });
        }

        if (vendorCandRes.data && vendorCandRes.data.length > 0) {
          vendorCandRes.data.forEach((vc: any) => {
            let parsedSkills: string[] = [];
            if (Array.isArray(vc.skills)) {
              parsedSkills = vc.skills;
            } else if (typeof vc.skills === 'string') {
              try {
                parsedSkills = JSON.parse(vc.skills);
              } catch (e) {
                parsedSkills = vc.skills.split(',').map((s: string) => s.trim());
              }
            }

            combined.push({
              id: vc.id,
              name: vc.name || 'Partner Talent',
              title: vc.parsed_data?.job_title || 'Senior Consultant',
              skills: parsedSkills.filter(Boolean),
              experience: vc.experience_years ? `${vc.experience_years} Yrs Exp` : '6+ Yrs',
              location: vc.location || 'Remote / Hybrid',
              availability: vc.availability || 'Immediate',
              rate: vc.salary_expectation || 'Open',
              status: vc.status || 'Available',
              matchScore: 92,
            });
          });
        }

        setRealCandidates(combined);
      } catch (err) {
        console.warn('Error fetching candidates from database:', err);
      } finally {
        setLoadingCandidates(false);
      }
    };

    fetchCandidatesFromDB();
  }, []);

  // 2. Fetch Posted Jobs
  const loadJobs = async () => {
    try {
      setLoadingJobs(true);
      // Attempt fetch from client_job_posts first
      const { data, error } = await supabase
        .from('client_job_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0 && !error) {
        const formatted: ClientJob[] = data.map((j: any) => ({
          id: j.id,
          title: j.title || 'Untitled Role',
          department: j.department || 'General',
          company_name: j.company_name || 'Client Co.',
          contact_name: j.contact_name || '',
          contact_email: j.contact_email || '',
          contact_phone: j.contact_phone || '',
          job_type: j.job_type || 'Full-Time',
          workplace_type: j.workplace_type || 'Remote',
          experience_level: j.experience_level || 'Mid-Senior',
          location: j.location || 'Remote',
          salary_range: j.salary_range || 'Competitive',
          urgency: j.urgency || 'Active',
          skills: Array.isArray(j.skills) ? j.skills : [],
          description: j.description || '',
          status: j.status || 'New',
          created_at: j.created_at || new Date().toISOString(),
          match_count: (j.assigned_candidates?.length) || 0,
        }));
        setPostedJobs(formatted);
      } else {
        // Fallback to local storage if table not yet populated
        const localSaved = localStorage.getItem('sa_client_posted_jobs');
        if (localSaved) {
          try {
            const parsed = JSON.parse(localSaved);
            if (Array.isArray(parsed)) {
              setPostedJobs(parsed);
            }
          } catch (e) {
            console.error('Error parsing local jobs:', e);
          }
        }
      }
    } catch (err) {
      console.warn('Fallback to local state:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Pre-fill user profile if logged in
  useEffect(() => {
    if (profile || user) {
      setJobForm((prev) => ({
        ...prev,
        contact_name: prev.contact_name || profile?.name || '',
        contact_email: prev.contact_email || user?.email || '',
      }));
    }
  }, [profile, user]);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const val = jobForm.skillsInput.trim();
    if (val && !skillsList.includes(val)) {
      setSkillsList([...skillsList, val]);
      setJobForm({ ...jobForm, skillsInput: '' });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobForm.title.trim() || !jobForm.company_name.trim() || !jobForm.contact_email.trim()) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please fill in the Job Title, Company Name, and Contact Email.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    const newJob: ClientJob = {
      id: 'cj-' + Date.now(),
      title: jobForm.title,
      department: jobForm.department,
      company_name: jobForm.company_name,
      contact_name: jobForm.contact_name,
      contact_email: jobForm.contact_email,
      contact_phone: jobForm.contact_phone,
      job_type: jobForm.job_type,
      workplace_type: jobForm.workplace_type,
      experience_level: jobForm.experience_level,
      location: jobForm.location,
      salary_range: jobForm.salary_range,
      urgency: jobForm.urgency,
      skills: skillsList.length > 0 ? skillsList : ['General'],
      description: jobForm.description,
      status: 'New',
      created_at: new Date().toISOString(),
      match_count: 0,
    };

    try {
      // 1. Insert into client_job_posts for Admin Portal to pick up
      const { error: insertErr } = await supabase.from('client_job_posts').insert([
        {
          title: newJob.title,
          department: newJob.department,
          company_name: newJob.company_name,
          contact_name: newJob.contact_name,
          contact_email: newJob.contact_email,
          contact_phone: newJob.contact_phone,
          job_type: newJob.job_type,
          workplace_type: newJob.workplace_type,
          experience_level: newJob.experience_level,
          location: newJob.location,
          salary_range: newJob.salary_range,
          urgency: newJob.urgency,
          skills: newJob.skills,
          description: newJob.description,
          status: 'New',
        },
      ]);

      if (insertErr) {
        console.warn('Insert to client_job_posts notice:', insertErr.message);
      }

      // 2. Also insert into jobs table for general visibility
      await supabase.from('jobs').insert([
        {
          title: newJob.title,
          department: newJob.department,
          location: `${newJob.location} (${newJob.workplace_type})`,
          employment_type: newJob.job_type,
          description: `Company: ${newJob.company_name}\nContact: ${newJob.contact_name} (${newJob.contact_email}, ${newJob.contact_phone})\nUrgency: ${newJob.urgency}\nSkills: ${newJob.skills.join(', ')}\n\n${newJob.description}`,
          salary_range: newJob.salary_range,
          status: 'Open',
        },
      ]);
    } catch (err) {
      console.log('Supabase sync notice:', err);
    }

    // Update local state and storage
    const updated = [newJob, ...postedJobs];
    setPostedJobs(updated);
    localStorage.setItem('sa_client_posted_jobs', JSON.stringify(updated));

    setSubmitting(false);
    setSuccessModalOpen(true);

    // Reset Form
    setJobForm({
      title: '',
      department: 'Engineering & Technology',
      company_name: jobForm.company_name,
      contact_name: jobForm.contact_name,
      contact_email: jobForm.contact_email,
      contact_phone: jobForm.contact_phone,
      job_type: 'Full-Time',
      workplace_type: 'Remote',
      experience_level: 'Mid-Senior (3-6 yrs)',
      location: 'United States (Remote)',
      salary_range: '$80,000 - $120,000 / year',
      urgency: 'Immediate (1-2 weeks)',
      skillsInput: '',
      description: '',
    });
  };

  const handleRequestCandidate = (candidate: CandidateProfile) => {
    setSelectedCandidate(candidate);
    setCandidateModalOpen(true);
  };

  const handleConfirmRequest = () => {
    toast({
      title: 'Candidate Profile Requested! 🚀',
      description: `Our recruitment executive will send full vetted profile of ${selectedCandidate?.name} to your email within 2 business hours.`,
    });
    setCandidateModalOpen(false);
  };

  const filteredCandidates = useMemo(() => {
    return realCandidates.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        (Array.isArray(c.skills) && c.skills.some((s) => s.toLowerCase().includes(q)));
      const matchesRole =
        filterRole === 'all' ||
        c.title.toLowerCase().includes(filterRole.toLowerCase());
      return matchesSearch && matchesRole;
    });
  }, [realCandidates, searchQuery, filterRole]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-28 pb-16 overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] opacity-40 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider animate-fade-in">
              <Building2 className="w-4 h-4" />
              <span>Client Portal</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              Client <span className="text-primary gradient-text">Portal</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Post your job vacancies, access pre-vetted industry experts, and accelerate your hiring pipeline with SA Consultant's elite staffing solutions.
            </p>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 max-w-3xl mx-auto">
              <div className="p-3 sm:p-4 rounded-xl glass border border-border/50 text-center">
                <div className="text-xl sm:text-2xl font-bold text-foreground">24-48 hrs</div>
                <div className="text-xs text-muted-foreground">Average Match Time</div>
              </div>
              <div className="p-3 sm:p-4 rounded-xl glass border border-border/50 text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary">10,000+</div>
                <div className="text-xs text-muted-foreground">Pre-Vetted Talents</div>
              </div>
              <div className="p-3 sm:p-4 rounded-xl glass border border-border/50 text-center">
                <div className="text-xl sm:text-2xl font-bold text-foreground">96%</div>
                <div className="text-xs text-muted-foreground">Placement Retention</div>
              </div>
              <div className="p-3 sm:p-4 rounded-xl glass border border-border/50 text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary">1-on-1</div>
                <div className="text-xs text-muted-foreground">Dedicated Account Lead</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8">
        <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="space-y-8">
          {/* Navigation Tab List */}
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-3xl h-auto p-1.5 bg-muted/60 backdrop-blur rounded-xl border border-border/50">
              <TabsTrigger
                value="post-job"
                className="py-2.5 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post a Job</span>
              </TabsTrigger>
              <TabsTrigger
                value="my-jobs"
                className="py-2.5 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                <Briefcase className="w-4 h-4" />
                <span>Posted Jobs</span>
                {postedJobs.length > 0 && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 ml-1">
                    {postedJobs.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="talent-match"
                className="py-2.5 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Find Candidates</span>
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="py-2.5 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Hiring Support</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: POST A JOB FORM */}
          <TabsContent value="post-job" className="space-y-6 max-w-4xl mx-auto focus:outline-none">
            <Card className="border border-border/60 shadow-lg bg-card/80 backdrop-blur">
              <CardHeader className="border-b border-border/40 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2.5 text-foreground">
                      <Briefcase className="w-6 h-6 text-primary" />
                      Post Job Vacancy & Hire Candidates
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mt-1">
                      Specify your job requirements. Your posting is received in the Admin Portal and matched with top candidates immediately.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit text-primary border-primary/30 bg-primary/5">
                    ✨ Live Admin Sync
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSubmitJob} className="space-y-6">
                  {/* Company & Contact Section */}
                  <div className="bg-muted/30 p-4 sm:p-5 rounded-xl border border-border/40 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      Company & Hiring Contact Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="company_name" className="text-xs font-semibold">
                          Company / Organization Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="company_name"
                          required
                          placeholder="e.g. Apex Tech Enterprises"
                          value={jobForm.company_name}
                          onChange={(e) => setJobForm({ ...jobForm, company_name: e.target.value })}
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="department" className="text-xs font-semibold">
                          Department / Business Unit
                        </Label>
                        <Select
                          value={jobForm.department}
                          onValueChange={(val) => setJobForm({ ...jobForm, department: val })}
                        >
                          <SelectTrigger id="department" className="bg-background">
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Engineering & Technology">Engineering & Technology</SelectItem>
                            <SelectItem value="Product & Design">Product & Design</SelectItem>
                            <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
                            <SelectItem value="Cloud & Cyber Security">Cloud & Cyber Security</SelectItem>
                            <SelectItem value="Sales & Business Development">Sales & Business Development</SelectItem>
                            <SelectItem value="Healthcare & Life Sciences">Healthcare & Life Sciences</SelectItem>
                            <SelectItem value="Finance & Accounting">Finance & Accounting</SelectItem>
                            <SelectItem value="Human Resources & Operations">Human Resources & Operations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      <div className="space-y-1.5">
                        <Label htmlFor="contact_name" className="text-xs font-semibold">
                          Hiring Manager / Contact Name
                        </Label>
                        <Input
                          id="contact_name"
                          placeholder="e.g. Jane Doe"
                          value={jobForm.contact_name}
                          onChange={(e) => setJobForm({ ...jobForm, contact_name: e.target.value })}
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="contact_email" className="text-xs font-semibold">
                          Contact Work Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="contact_email"
                          type="email"
                          required
                          placeholder="e.g. hiring@company.com"
                          value={jobForm.contact_email}
                          onChange={(e) => setJobForm({ ...jobForm, contact_email: e.target.value })}
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="contact_phone" className="text-xs font-semibold">
                          Contact Phone Number
                        </Label>
                        <Input
                          id="contact_phone"
                          type="tel"
                          placeholder="e.g. +1 (555) 000-0000"
                          value={jobForm.contact_phone}
                          onChange={(e) => setJobForm({ ...jobForm, contact_phone: e.target.value })}
                          className="bg-background"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Job Details Section */}
                  <div className="bg-muted/30 p-4 sm:p-5 rounded-xl border border-border/40 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Role Specifications & Criteria
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-xs font-semibold">
                          Job Role / Vacancy Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="title"
                          required
                          placeholder="e.g. Senior Java Full Stack Developer"
                          value={jobForm.title}
                          onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="job_type" className="text-xs font-semibold">
                          Employment Type
                        </Label>
                        <Select
                          value={jobForm.job_type}
                          onValueChange={(val) => setJobForm({ ...jobForm, job_type: val })}
                        >
                          <SelectTrigger id="job_type" className="bg-background">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full-Time">Full-Time (Direct Hire)</SelectItem>
                            <SelectItem value="Contract (C2C/W2)">Contract (C2C / W2)</SelectItem>
                            <SelectItem value="Contract-to-Hire">Contract-to-Hire</SelectItem>
                            <SelectItem value="Part-Time">Part-Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="workplace_type" className="text-xs font-semibold">
                          Workplace Arrangement
                        </Label>
                        <Select
                          value={jobForm.workplace_type}
                          onValueChange={(val) => setJobForm({ ...jobForm, workplace_type: val })}
                        >
                          <SelectTrigger id="workplace_type" className="bg-background">
                            <SelectValue placeholder="Workplace" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Remote">100% Remote</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                            <SelectItem value="On-Site">On-Site</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="experience_level" className="text-xs font-semibold">
                          Experience Level Required
                        </Label>
                        <Select
                          value={jobForm.experience_level}
                          onValueChange={(val) => setJobForm({ ...jobForm, experience_level: val })}
                        >
                          <SelectTrigger id="experience_level" className="bg-background">
                            <SelectValue placeholder="Experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Entry Level (0-2 yrs)">Entry Level (0-2 yrs)</SelectItem>
                            <SelectItem value="Mid-Senior (3-6 yrs)">Mid-Senior (3-6 yrs)</SelectItem>
                            <SelectItem value="Senior (7-10 yrs)">Senior (7-10 yrs)</SelectItem>
                            <SelectItem value="Lead / Executive (10+ yrs)">Lead / Executive (10+ yrs)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="urgency" className="text-xs font-semibold">
                          Hiring Urgency / Target Start
                        </Label>
                        <Select
                          value={jobForm.urgency}
                          onValueChange={(val) => setJobForm({ ...jobForm, urgency: val })}
                        >
                          <SelectTrigger id="urgency" className="bg-background">
                            <SelectValue placeholder="Urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Immediate (1-2 weeks)">🔥 Immediate (1-2 weeks)</SelectItem>
                            <SelectItem value="Within 1 month">Within 1 month</SelectItem>
                            <SelectItem value="Within 60 days">Within 60 days</SelectItem>
                            <SelectItem value="Pipeline / Future">Building Talent Pipeline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="location" className="text-xs font-semibold">
                          Location / Target Region
                        </Label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            id="location"
                            placeholder="e.g. Dallas, TX or Remote (USA)"
                            value={jobForm.location}
                            onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                            className="bg-background pl-9"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="salary_range" className="text-xs font-semibold">
                          Budget / Compensation Range
                        </Label>
                        <div className="relative">
                          <DollarSign className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            id="salary_range"
                            placeholder="e.g. $100k - $125k / yr or $60/hr"
                            value={jobForm.salary_range}
                            onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })}
                            className="bg-background pl-9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills & Job Description Section */}
                  <div className="bg-muted/30 p-4 sm:p-5 rounded-xl border border-border/40 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Required Skills & Full Description
                    </h3>

                    {/* Skill Tags Input */}
                    <div className="space-y-2">
                      <Label htmlFor="skillsInput" className="text-xs font-semibold">
                        Key Skills & Technologies (Press Enter to add tag)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="skillsInput"
                          placeholder="e.g. React, Node.js, AWS, Python, Kubernetes"
                          value={jobForm.skillsInput}
                          onChange={(e) => setJobForm({ ...jobForm, skillsInput: e.target.value })}
                          onKeyDown={handleAddSkill}
                          className="bg-background"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleAddSkill}
                          className="shrink-0"
                        >
                          Add Skill
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {skillsList.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5 rounded-md"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="hover:text-destructive text-muted-foreground ml-1"
                            >
                              &times;
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <Label htmlFor="description" className="text-xs font-semibold">
                        Job Description & Key Responsibilities
                      </Label>
                      <Textarea
                        id="description"
                        rows={5}
                        placeholder="Provide details on project scope, primary deliverables, qualification requirements, and team structure..."
                        value={jobForm.description}
                        onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                        className="bg-background resize-y"
                      />
                    </div>
                  </div>

                  {/* Submission Action */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      100% confidential. Reviewed by dedicated SA recruitment specialists.
                    </p>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-6 text-base font-bold bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Publishing Job Requirement...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Post Job Vacancy & Find Candidates
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: MY POSTED JOBS */}
          <TabsContent value="my-jobs" className="space-y-6 max-w-5xl mx-auto focus:outline-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary" />
                  Your Posted Job Vacancies
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Track active openings, review candidate suggestions, and monitor staffing progress.
                </p>
              </div>

              <Button
                onClick={() => setActiveTab('post-job')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 flex items-center gap-2 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                Post Another Job
              </Button>
            </div>

            {loadingJobs ? (
              <div className="py-16 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground mt-2">Loading posted jobs...</p>
              </div>
            ) : postedJobs.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-2">
                <Briefcase className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-foreground">No Jobs Posted Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-6">
                  Post your first vacancy to start receiving verified, high-matching candidate profiles from our talent network.
                </p>
                <Button onClick={() => setActiveTab('post-job')} className="bg-primary">
                  Post Your First Job Now
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {postedJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="hover:border-primary/50 transition-all shadow-sm border border-border/70 overflow-hidden"
                  >
                    <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-bold text-foreground">{job.title}</h3>
                          <Badge
                            className={
                              job.status === 'New'
                                ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                                : job.status === 'Reviewing'
                                ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                                : 'bg-purple-500/10 text-purple-600 border-purple-500/30'
                            }
                          >
                            {job.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {job.job_type}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1.5 gap-x-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-muted-foreground/70" />
                            <span>{job.company_name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-muted-foreground/70" />
                            <span>{job.location} ({job.workplace_type})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold text-foreground">{job.salary_range}</span>
                          </div>
                        </div>

                        {/* Skill Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {job.skills?.slice(0, 5).map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[11px] px-2 py-0.5">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills?.length > 5 && (
                            <span className="text-[11px] text-muted-foreground self-center">
                              +{job.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Action Area */}
                      <div className="flex flex-row md:flex-col items-center sm:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l border-border/50 pt-3 md:pt-0 md:pl-6 shrink-0">
                        <div className="text-left md:text-right">
                          <span className="text-xs text-muted-foreground block">Candidates Assigned</span>
                          <span className="text-base font-bold text-primary flex items-center md:justify-end gap-1">
                            <Users className="w-4 h-4" />
                            {job.match_count || 0} Assigned
                          </span>
                        </div>

                        <Button
                          onClick={() => {
                            setFilterRole(job.title);
                            setActiveTab('talent-match');
                          }}
                          variant="outline"
                          size="sm"
                          className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground font-semibold flex items-center gap-1.5"
                        >
                          <span>Explore Candidates</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 3: TALENT MATCH & CANDIDATE SEARCH (REAL CANDIDATES FROM DB) */}
          <TabsContent value="talent-match" className="space-y-6 max-w-5xl mx-auto focus:outline-none">
            {/* Search and Filters Bar */}
            <Card className="border border-border/60 bg-card/60 backdrop-blur p-4 sm:p-5">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates by skills, role, or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full md:w-[220px] bg-background text-xs sm:text-sm">
                      <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Developer">Developers</SelectItem>
                      <SelectItem value="Engineer">Engineers</SelectItem>
                      <SelectItem value="DevOps">DevOps & Cloud</SelectItem>
                      <SelectItem value="Data">Data & AI</SelectItem>
                      <SelectItem value="Manager">Management</SelectItem>
                    </SelectContent>
                  </Select>

                  {searchQuery && (
                    <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="text-xs">
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Candidate Results Grid */}
            {loadingCandidates ? (
              <div className="py-20 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground mt-2">Loading vetted candidates from database...</p>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-2 bg-card/40">
                <UserX className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-foreground">No Candidates Found</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-6">
                  {searchQuery || filterRole !== 'all'
                    ? 'No candidates match your current search filters. Try clearing your search or filtering by all roles.'
                    : 'Our talent pool is constantly growing. Post your job vacancy in the Post a Job tab and our recruitment specialists will source custom candidates for you immediately.'}
                </p>
                <Button onClick={() => setActiveTab('post-job')} className="bg-primary">
                  Post Your Job Requirement
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCandidates.map((candidate) => (
                  <Card
                    key={candidate.id}
                    className="hover:border-primary/60 transition-all duration-300 shadow-sm border border-border/70 flex flex-col justify-between"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base shrink-0">
                            {candidate.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                              {candidate.name}
                              <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                                {candidate.status}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm font-medium text-foreground/80">
                              {candidate.title}
                            </CardDescription>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs border border-emerald-500/20">
                            <Zap className="w-3 h-3" />
                            {candidate.matchScore || 95}% Match
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3.5 pb-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-2 gap-2 text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/30">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>Exp: <strong className="text-foreground">{candidate.experience}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>Start: <strong className="text-foreground">{candidate.availability}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span className="truncate">{candidate.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold text-foreground">{candidate.rate}</span>
                        </div>
                      </div>

                      {/* Skill Tags */}
                      {candidate.skills && candidate.skills.length > 0 && (
                        <div>
                          <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                            Core Competencies:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {candidate.skills.slice(0, 6).map((skill, sIdx) => (
                              <Badge
                                key={sIdx}
                                variant="secondary"
                                className="text-[11px] px-2 py-0.5 bg-background border border-border/60"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-border/40">
                        <Button
                          onClick={() => handleRequestCandidate(candidate)}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5"
                        >
                          <UserCheck className="w-4 h-4" />
                          Request Candidate Profile & Intro
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 4: HIRING SUPPORT & DEDICATED CONSULTATION */}
          <TabsContent value="support" className="space-y-6 max-w-4xl mx-auto focus:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Consultation Card */}
              <Card className="border border-border/60 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-primary" />
                    Dedicated Hiring Consultation
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Have complex hiring specifications or need a specialized team assembled fast? Speak directly with our senior talent director.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/30">
                      <Mail className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">Executive Staffing Desk</div>
                        <div className="text-sm font-semibold text-foreground">clients@saconsultantandstaffing.com</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/30">
                      <PhoneCall className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">Client Hotline & WhatsApp</div>
                        <div className="text-sm font-semibold text-foreground">+1 (800) 555-SA-JOBS</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link to="/book">
                      <Button className="w-full bg-primary hover:bg-primary/90 font-bold flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Schedule 15-Min Hiring Consultation
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Guarantees & Benefits */}
              <Card className="border border-border/60 shadow-md bg-gradient-to-br from-card via-card to-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    SA Consultant Staffing Guarantee
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Why Fortune 500s and high-growth startups trust our staffing ecosystem.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-foreground/90">
                      <strong>Rigorous Technical Screening:</strong> All candidates undergo multi-stage technical and soft-skill evaluations before presentation.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-foreground/90">
                      <strong>90-Day Replacement Guarantee:</strong> Zero risk placement guarantee for direct hire roles.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-foreground/90">
                      <strong>Rapid Deployment:</strong> Initial candidate profiles submitted within 24 to 48 hours of requirement posting.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-foreground/90">
                      <strong>Full Compliance & Background Checks:</strong> Background checks, right to work, and NDA compliance handled end-to-end.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* SUCCESS MODAL AFTER POSTING */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 flex items-center justify-center mx-auto sm:mx-0 mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold">Job Vacancy Posted Successfully!</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground pt-1">
              Your requirement has been sent directly to our Admin Talent Management desk. Our recruitment specialists are actively matching qualified candidate profiles for your review.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/40 p-4 rounded-xl space-y-2 border border-border/40 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-semibold text-foreground">Received by Admin Desk</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Candidate Profiles Sent:</span>
              <span className="font-semibold text-primary">Within 24 Hours</span>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => {
                setSuccessModalOpen(false);
                setActiveTab('my-jobs');
              }}
            >
              View My Posted Jobs
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setSuccessModalOpen(false);
                setActiveTab('talent-match');
              }}
            >
              Explore Candidates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REQUEST CANDIDATE PROFILE MODAL */}
      <Dialog open={candidateModalOpen} onOpenChange={setCandidateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Request Candidate Introduction
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Request full resume, screening notes, and interview availability for <strong>{selectedCandidate?.name}</strong> ({selectedCandidate?.title}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3 bg-muted/40 rounded-lg space-y-1.5 border border-border/40">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Experience:</span>
                <span className="font-semibold text-foreground">{selectedCandidate?.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-semibold text-foreground">{selectedCandidate?.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Availability:</span>
                <span className="font-semibold text-emerald-600">{selectedCandidate?.availability}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Your Notification Email</Label>
              <Input
                defaultValue={jobForm.contact_email || user?.email || ''}
                placeholder="your-email@company.com"
                className="bg-background"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCandidateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRequest} className="bg-primary hover:bg-primary/90">
              Send Candidate Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
