import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CreateJobModal } from "@/components/dashboard/CreateJobModal";
import { CreateCandidateModal } from "@/components/dashboard/CreateCandidateModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Share2,
  Search,
  Users,
  Briefcase,
  Calendar as CalendarIcon,
  PlusCircle,
  Plus,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  Video,
  Trash2,
  Copy,
  QrCode,
  Filter,
  Mail,
  UserCheck,
  Building2,
  UserPlus,
  FileText,
  FileCheck,
  Phone,
  CheckCircle2,
  Lock,
  Unlock,
  Bookmark,
  Sparkles,
  GraduationCap,
  Eye,
  Download,
  ExternalLink,
  Pencil,
  Upload,
  Loader2,
  CreditCard,
  ShieldCheck,
  DollarSign,
  Award,
  Zap,
  ArrowUpRight,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keywordParam = searchParams.get("keyword");
  const locationParam = searchParams.get("location");
  const tabParam = searchParams.get("tab");
  const planParam = searchParams.get("plan");

  const [subscriptionPlan, setSubscriptionPlan] = useState<"free" | "starter">("starter");

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "jobshare" | "candidatesearch" | "candidatehub" | "recruiting" | "calendar" | "pricing"
  >(
    tabParam && ["dashboard", "jobshare", "candidatesearch", "candidatehub", "recruiting", "calendar", "pricing"].includes(tabParam)
      ? (tabParam as any)
      : "dashboard"
  );

  useEffect(() => {
    if (tabParam && ["dashboard", "jobshare", "candidatesearch", "candidatehub", "recruiting", "calendar", "pricing"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
    if (planParam === "starter") {
      setSubscriptionPlan("starter");
      toast.success("Starter Plan activated with 14-day free trial!");
    }
    if (keywordParam) setSearchKeyword(keywordParam);
    if (locationParam) setSearchLocation(locationParam);
  }, [tabParam, keywordParam, locationParam, planParam]);

  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [createCandidateOpen, setCreateCandidateOpen] = useState(false);
  const [profile, setProfile] = useState<{
    businessName: string;
    location: string;
    logo?: string;
  }>({
    businessName: "",
    location: "",
  });

  // Edit Profile Modal State
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editBusinessName, setEditBusinessName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editLogo, setEditLogo] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setEditBusinessName(profile.businessName || "");
      setEditLocation(profile.location || "");
      setEditLogo(profile.logo || null);
    }
  }, [profile.businessName, profile.location, profile.logo]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBusinessName.trim()) {
      toast.error("Please enter a valid business name.");
      return;
    }
    setSavingProfile(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Session expired. Please sign in again.");
        return;
      }

      const { error } = await supabase
        .from("business_profiles")
        .upsert({
          user_id: user.id,
          business_name: editBusinessName,
          location: editLocation,
          logo_url: editLogo || null,
        }, { onConflict: "user_id" });

      if (error) throw error;

      const updatedObj = {
        businessName: editBusinessName,
        location: editLocation,
        logo: editLogo,
      };

      localStorage.setItem(`sa_business_profile_${user.id}`, JSON.stringify(updatedObj));

      setProfile({
        businessName: editBusinessName,
        location: editLocation,
        logo: editLogo || undefined,
      });

      toast.success("Business profile updated successfully!");
      setEditProfileOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update business profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogoUploadInModal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditLogo(reader.result as string);
        toast.success("Logo uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };


  // State Management
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // WorkOnward Candidate Search State
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [unlockedCandidateIds, setUnlockedCandidateIds] = useState<string[]>([]);
  const [bookmarkedCandidateIds, setBookmarkedCandidateIds] = useState<string[]>([]);
  const [credits, setCredits] = useState<number>(3);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [filterUnlockedOnly, setFilterUnlockedOnly] = useState(false);
  const [filterWithResume, setFilterWithResume] = useState(false);
  const [filterFullTime, setFilterFullTime] = useState(false);
  const [searchCandidatesList, setSearchCandidatesList] = useState<any[]>([]);

  // Email composer modal state
  const [emailModalCandidate, setEmailModalCandidate] = useState<any | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleUnlockProfile = (candidateId: string, candidateName: string) => {
    if (unlockedCandidateIds.includes(candidateId)) {
      toast.info(`${candidateName}'s profile is already unlocked!`);
      return;
    }
    if (credits <= 0) {
      toast.error("No profile unlock credits remaining. Upgrade plan to unlock more!");
      return;
    }
    setUnlockedCandidateIds((prev) => [...prev, candidateId]);
    setCredits((prev) => prev - 1);
    toast.success(`Unlocked ${candidateName}'s contact & resume! 1 credit deducted.`);
  };

  const toggleBookmark = (candidateId: string) => {
    setBookmarkedCandidateIds((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId]
    );
    toast.success("Candidate bookmark updated!");
  };

  const handleDownloadResume = (candidate: any) => {
    if (!candidate) return;
    const name = candidate.name || "Candidate";
    const resumeUrl = candidate.resume_url;

    if (resumeUrl && typeof resumeUrl === "string" && (resumeUrl.startsWith("http") || resumeUrl.startsWith("data:") || resumeUrl.startsWith("blob:"))) {
      const link = document.createElement("a");
      link.href = resumeUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = `${name.replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${name}'s PDF resume...`);
    } else {
      const skillsStr = normalizeSkills(candidate.skills).join(", ") || "General Professional Skills";
      const fileContent = `===========================================================
SA ELEVATE CANDIDATE RESUME PROFILE
===========================================================

FULL NAME   : ${candidate.name || "Candidate"}
TITLE / ROLE: ${candidate.title || candidate.job_title || "Professional"}
LOCATION    : ${candidate.location || "Location not specified"}
EXPERIENCE  : ${candidate.experience || (candidate.experience_years ? `${candidate.experience_years} years` : "Experienced")}
EMAIL       : ${candidate.email || "Not specified"}
PHONE       : ${candidate.phone || "Not specified"}
STATUS      : ${candidate.status || "Active Candidate"}

-----------------------------------------------------------
SUMMARY & OVERVIEW
-----------------------------------------------------------
${candidate.summary || candidate.bio || "Candidate with proven expertise in " + skillsStr + "."}

-----------------------------------------------------------
SKILLS & COMPETENCIES
-----------------------------------------------------------
${skillsStr}

-----------------------------------------------------------
EDUCATION
-----------------------------------------------------------
${typeof candidate.education === 'string' ? candidate.education : (Array.isArray(candidate.education) ? candidate.education.join(' • ') : "Bachelor Degree / Professional Qualification")}

===========================================================
Generated by SA Elevate Candidate Management System
===========================================================`;

      const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name.replace(/\s+/g, "_")}_Resume.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${name}'s resume document!`);
    }
  };

  const openEmailModal = (candidate: any) => {
    if (!candidate) return;
    setEmailModalCandidate(candidate);
    setEmailSubject(`Career Opportunity at ${profile.businessName || "SA Elevate Business Partner"}`);
    setEmailBody(`Hi ${candidate.name || "Candidate"},\n\nWe came across your profile on SA Elevate and were impressed by your experience as ${candidate.title || "a professional"}.\n\nWe would love to connect with you regarding potential opportunities at ${profile.businessName || "our organization"}.\n\nPlease let us know your availability for a brief call.\n\nBest regards,\n${profile.businessName || "Hiring Manager"}`);
  };

  const handleSendEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalCandidate) return;
    setSendingEmail(true);

    const targetEmail = emailModalCandidate.email || "candidate@example.com";
    const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    setTimeout(() => {
      setSendingEmail(false);
      toast.success(`Opening mail client to send email to ${targetEmail}`);
      setEmailModalCandidate(null);
    }, 400);
  };

  // WorkOnward-style Calendar State
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [calendarViewMode, setCalendarViewMode] = useState<"month" | "agenda">("month");
  const [calendarCategoryFilter, setCalendarCategoryFilter] = useState<string>("all");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState<any | null>(null);

  // New Event Form State
  const [eventForm, setEventForm] = useState({
    title: "",
    type: "interview",
    candidateName: "",
    candidateEmail: "",
    jobTitle: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    duration: "30 mins",
    meetingUrl: "https://meet.google.com/new",
    location: "Google Meet Video Call",
    notes: "",
  });

  useEffect(() => {
    const loadCalendarEvents = () => {
      try {
        const stored = localStorage.getItem("sa_calendar_events");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setEvents(parsed);
            return;
          }
        }
      } catch (err) {
        console.error(err);
      }

      const todayStr = new Date().toISOString().split("T")[0];
      const sampleEvents = [
        {
          id: "ev-1",
          title: "Technical Interview - sajaruth",
          candidate: "sajaruth",
          candidateEmail: "salihathasneem3@gmail.com",
          role: "WEB DEVELOPER",
          type: "interview",
          date: todayStr,
          time: "10:30 AM",
          duration: "45 mins",
          meetingUrl: "https://meet.google.com/abc-defg-hij",
          location: "Google Meet",
          status: "Scheduled",
          notes: "Focus on React, TypeScript, and frontend state management.",
        },
        {
          id: "ev-2",
          title: "Initial HR Screening - Mohamed Ibrahim M",
          candidate: "Mohamed Ibrahim M",
          candidateEmail: "msdibu3@gmail.com",
          role: "Full Stack Developer",
          type: "screening",
          date: todayStr,
          time: "02:00 PM",
          duration: "30 mins",
          meetingUrl: "https://meet.google.com/xyz-uvwx-rst",
          location: "Google Meet",
          status: "Confirmed",
          notes: "Discuss availability, salary expectations, and notice period.",
        },
        {
          id: "ev-3",
          title: "SA Elevate Tech Recruitment Webinar",
          candidate: "Multiple Applicants",
          candidateEmail: "info@saconsultant.com",
          role: "Engineering Team",
          type: "webinar",
          date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
          time: "11:00 AM",
          duration: "1 hour",
          meetingUrl: "https://meet.google.com/webinar-sa-elevate",
          location: "Online Live Stream",
          status: "Upcoming",
          notes: "Live Q&A session with candidates and hiring partners.",
        },
      ];
      setEvents(sampleEvents);
      localStorage.setItem("sa_calendar_events", JSON.stringify(sampleEvents));
    };

    loadCalendarEvents();
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCalendarDate(new Date());
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEv = {
      id: `ev-${Date.now()}`,
      title: eventForm.title || `${eventForm.type.toUpperCase()} - ${eventForm.candidateName || "Candidate"}`,
      candidate: eventForm.candidateName || "Candidate",
      candidateEmail: eventForm.candidateEmail || "",
      role: eventForm.jobTitle || "Applicant",
      type: eventForm.type,
      date: eventForm.date,
      time: eventForm.time,
      duration: eventForm.duration,
      meetingUrl: eventForm.meetingUrl || "https://meet.google.com/new",
      location: eventForm.location || "Google Meet Video Call",
      status: "Scheduled",
      notes: eventForm.notes,
    };

    const updated = [newEv, ...events];
    setEvents(updated);
    localStorage.setItem("sa_calendar_events", JSON.stringify(updated));
    toast.success(`Scheduled ${newEv.type} for ${newEv.candidate}!`);
    setScheduleModalOpen(false);
    setEventForm({
      title: "",
      type: "interview",
      candidateName: "",
      candidateEmail: "",
      jobTitle: "",
      date: new Date().toISOString().split("T")[0],
      time: "10:00 AM",
      duration: "30 mins",
      meetingUrl: "https://meet.google.com/new",
      location: "Google Meet Video Call",
      notes: "",
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    const updated = events.filter((ev) => ev.id !== eventId);
    setEvents(updated);
    localStorage.setItem("sa_calendar_events", JSON.stringify(updated));
    setSelectedEventDetails(null);
    toast.success("Event cancelled successfully.");
  };

const normalizeSkills = (rawSkills: any): string[] => {
  if (!rawSkills) return [];
  if (Array.isArray(rawSkills)) {
    const list: string[] = [];
    rawSkills.forEach((item) => {
      if (typeof item === "string" && item.trim()) {
        list.push(item.trim());
      } else if (typeof item === "object" && item !== null) {
        if (Array.isArray(item.items)) {
          item.items.forEach((sub: any) => {
            if (typeof sub === "string" && sub.trim()) list.push(sub.trim());
          });
        } else if (typeof item.category === "string" && item.category.trim()) {
          list.push(item.category.trim());
        }
      }
    });
    return list;
  }
  if (typeof rawSkills === "string") {
    return rawSkills.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

  const filteredCandidates = (searchCandidatesList || []).filter((c) => {
    if (!c) return false;
    const name = (c.name || "Candidate").toString();
    const title = (c.title || c.job_title || "Professional").toString();
    const location = (c.location || "").toString();
    const skillsList = normalizeSkills(c.skills);

    const matchesKeyword =
      !searchKeyword ||
      name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      skillsList.some((s: string) => s.toLowerCase().includes(searchKeyword.toLowerCase()));

    const matchesLocation = !searchLocation || location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesUnlocked = !filterUnlockedOnly || unlockedCandidateIds.includes(c.id);
    const matchesResume = !filterWithResume || Boolean(c.resume_url);
    const matchesFullTime = !filterFullTime || (c.type || "Full-Time").toLowerCase().includes("full-time");

    return matchesKeyword && matchesLocation && matchesUnlocked && matchesResume && matchesFullTime;
  });


  const handleCandidateCreated = (newCandidate: any) => {
    setCandidates((prev) => [newCandidate, ...prev]);
  };

  // Load admin-assigned candidates ONLY from Supabase
  const loadAdminAssignedCandidates = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id || '';

      const assignedList: any[] = [];

      // 1. Fetch from business_candidate_assignments table
      try {
        let aData: any[] | null = null;
        const { data: joinData, error: joinError } = await supabase
          .from('business_candidate_assignments')
          .select(`
            id, candidate_id, business_user_id, note, assigned_at,
            candidates (
              id, name, full_name, email, phone, job_title, title,
              experience_years, experience, location, skills,
              resume_url, status, summary, bio
            )
          `)
          .order('assigned_at', { ascending: false });

        if (!joinError && joinData) {
          aData = joinData;
        } else {
          // Fallback select without relational join if RLS or join restricted
          const { data: directData } = await supabase
            .from('business_candidate_assignments')
            .select('id, candidate_id, business_user_id, note, assigned_at')
            .order('assigned_at', { ascending: false });
          if (directData) aData = directData;
        }

        if (aData && Array.isArray(aData)) {
          aData.forEach((row: any) => {
            let c = row.candidates;

            // Parse snapshot JSON stored in note field if join returned null
            if (!c && row.note) {
              try {
                c = typeof row.note === 'string' ? JSON.parse(row.note) : row.note;
              } catch {
                c = null;
              }
            }

            if (c) {
              const skills = normalizeSkills(c.skills);
              const candidateName = c.name || c.full_name || 'Candidate';
              const candidateEmail = c.email || 'candidate@example.com';
              const candidatePhone = c.phone || '+1 (555) 000-0000';
              const maskedEmail = c.maskedEmail || candidateEmail.replace(/(.{2})(.*)(?=@)/, '$1***');
              const maskedPhone = c.maskedPhone || (candidatePhone.length > 6 ? candidatePhone.slice(0, 6) + '****' : '+1 (***) ***-****');

              assignedList.push({
                id: c.id || row.candidate_id || row.id,
                name: candidateName,
                title: c.title || c.job_title || 'Professional',
                location: c.location || 'Location not specified',
                experience: c.experience || (c.experience_years ? `${c.experience_years} years` : 'Experience not listed'),
                skills: skills.length > 0 ? skills : ['Verified Candidate'],
                status: c.status || 'Assigned by Admin',
                email: candidateEmail,
                phone: candidatePhone,
                maskedEmail,
                maskedPhone,
                resume_url: c.resume_url || null,
                summary: c.summary || c.bio || 'Candidate assigned by SA Elevate recruiter.',
                assignedAt: row.assigned_at,
                assignedByAdmin: true,
              });
            }
          });
        }
      } catch (err) {
        console.warn('Assignments fetch catch:', err);
      }

      // 2. Fetch from localStorage fallback (shared admin assignments)
      try {
        const stored = localStorage.getItem('sa_admin_assigned_candidates');
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            list.forEach((c: any) => {
              const skills = normalizeSkills(c.skills);
              const candidateName = c.name || 'Candidate';
              const candidateEmail = c.email || 'candidate@example.com';
              const candidatePhone = c.phone || '+1 (555) 000-0000';
              const maskedEmail = c.maskedEmail || candidateEmail.replace(/(.{2})(.*)(?=@)/, '$1***');
              const maskedPhone = c.maskedPhone || (candidatePhone.length > 6 ? candidatePhone.slice(0, 6) + '****' : '+1 (***) ***-****');

              assignedList.push({
                id: c.id,
                name: candidateName,
                title: c.title || c.job_title || 'Professional',
                location: c.location || 'Location not specified',
                experience: c.experience || (c.experience_years ? `${c.experience_years} years` : 'Experience not listed'),
                skills: skills.length > 0 ? skills : ['Verified Candidate'],
                status: c.status || 'Assigned by Admin',
                email: candidateEmail,
                phone: candidatePhone,
                maskedEmail,
                maskedPhone,
                resume_url: c.resume_url || null,
                summary: c.summary || c.bio || 'Candidate assigned by SA Elevate recruiter.',
                assignedAt: new Date().toISOString(),
                assignedByAdmin: true,
              });
            });
          }
        }
      } catch (err) {
        console.warn('LocalStorage candidates fetch catch:', err);
      }

      // 2. Fetch from job_matches table (Admin Master Brain assignments)
      try {
        const { data: mData, error: mError } = await supabase
          .from('job_matches')
          .select(`
            id, candidate_id, job_id, company_name, match_percentage, location_fit, status, created_at,
            vendor_candidates ( id, name, email, phone, skills, resume_url, location, experience_years )
          `)
          .order('created_at', { ascending: false });

        if (!mError && mData && Array.isArray(mData)) {
          mData.forEach((row: any) => {
            let c = row.vendor_candidates;
            if (!c && row.location_fit && String(row.location_fit).startsWith('{')) {
              try {
                c = JSON.parse(row.location_fit);
              } catch {
                c = null;
              }
            }

            if (c) {
              const skills = normalizeSkills(c.skills || c.skills_list);
              const candidateName = c.name || c.cand_name || 'Candidate';
              const candidateEmail = c.email || c.cand_email || 'candidate@example.com';
              const candidatePhone = c.phone || c.cand_phone || '+1 (555) 000-0000';
              const maskedEmail = candidateEmail.replace(/(.{2})(.*)(?=@)/, '$1***');
              const maskedPhone = candidatePhone.length > 6 ? candidatePhone.slice(0, 6) + '****' : '+1 (***) ***-****';

              assignedList.push({
                id: c.id || row.candidate_id || row.id,
                name: candidateName,
                title: c.title || c.job_title || 'Matched Candidate',
                location: c.location || 'Location not specified',
                experience: c.experience || (c.experience_years ? `${c.experience_years} years` : 'Experienced'),
                skills: skills.length > 0 ? skills : ['Matched Candidate'],
                status: row.status || 'Match Assigned',
                email: candidateEmail,
                phone: candidatePhone,
                maskedEmail,
                maskedPhone,
                resume_url: c.resume_url || null,
                summary: `Assigned candidate match (${row.match_percentage || '95'}% Match Fit)`,
                assignedAt: row.created_at,
                assignedByAdmin: true,
              });
            }
          });
        }
      } catch (err) {
        console.warn('Job matches fetch catch:', err);
      }

      // Deduplicate assigned candidates by id or candidate name
      const uniqueAssigned: any[] = [];
      const seenIds = new Set();
      const seenNames = new Set();

      assignedList.forEach((item) => {
        const nameKey = (item.name || '').toLowerCase().trim();
        if (!seenIds.has(item.id) && !seenNames.has(nameKey)) {
          seenIds.add(item.id);
          seenNames.add(nameKey);
          uniqueAssigned.push(item);
        }
      });

      setSearchCandidatesList(uniqueAssigned);
    } catch (err) {
      console.error('Error loading admin-assigned candidates:', err);
      setSearchCandidatesList([]);
    }
  };

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // 1. Query user-specific business profile from Supabase
          const { data } = await supabase
            .from("business_profiles")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

          if (data && data.business_name) {
            setProfile({
              businessName: data.business_name || "",
              location: data.location || "",
              logo: data.logo_url || undefined,
            });
            return;
          }

          // 2. Check user-specific localStorage key
          const userSaved = localStorage.getItem(`sa_business_profile_${user.id}`);
          if (userSaved) {
            try {
              const parsed = JSON.parse(userSaved);
              if (parsed && parsed.businessName) {
                setProfile({
                  businessName: parsed.businessName,
                  location: parsed.location || "",
                  logo: parsed.logo || undefined,
                });
                return;
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching business profile from Supabase:", err);
      }

      // Default: clean state if no profile for this specific user
      setProfile({ businessName: "", location: "" });
    };

    fetchBusinessProfile();
    // Load admin-assigned candidates from Supabase
    loadAdminAssignedCandidates();
  }, []);


  const handleJobCreated = (newJob: any) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const copyJobLink = (jobTitle: string) => {
    navigator.clipboard.writeText(`https://saconsultantandstaffing.com/jobs/share?title=${encodeURIComponent(jobTitle)}`);
    toast.success(`Share link for "${jobTitle}" copied to clipboard!`);
  };

  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicantsCount || 0), 0);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans antialiased">
      {/* Website Top Navbar */}
      <Navbar />

      {/* Main Container - Full Width */}
      <div className="flex-1 pt-24 pb-12 w-full px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Left Sidebar Navigation */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <Card className="glass border-primary/20 shadow-lg rounded-2xl p-4 sticky top-28">
              {/* Profile Header */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
                <div className="w-11 h-11 rounded-xl gradient-bg text-white flex items-center justify-center font-bold text-lg overflow-hidden flex-shrink-0 shadow-md">
                  {profile.logo ? (
                    <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : profile.businessName ? (
                    profile.businessName.charAt(0).toUpperCase()
                  ) : (
                    <Building2 className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-foreground text-sm truncate">
                      {profile.businessName || "Business Account"}
                    </h4>
                    <button
                      onClick={() => setEditProfileOpen(true)}
                      className="text-xs text-primary hover:text-primary/80 p-1 rounded-md hover:bg-primary/10 transition-colors shrink-0"
                      title="Edit Business Profile"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 truncate mt-0.5">
                    <MapPin className="w-3 h-3 text-primary flex-shrink-0" />{" "}
                    {profile.location || "Location not set"}
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === "dashboard"
                      ? "gradient-bg text-white font-bold shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab("jobshare")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === "jobshare"
                      ? "gradient-bg text-white font-bold shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>Job Share</span>
                </button>

                <button
                  onClick={() => setActiveTab("candidatesearch")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === "candidatesearch"
                      ? "gradient-bg text-white font-bold shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Candidate Search</span>
                </button>

                <button
                  onClick={() => setActiveTab("candidatehub")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === "candidatehub"
                      ? "gradient-bg text-white font-bold shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Candidate Hub</span>
                </button>

                <button
                  onClick={() => setActiveTab("recruiting")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === "recruiting"
                      ? "gradient-bg text-white font-bold shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Recruiting</span>
                </button>

                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === "calendar"
                      ? "gradient-bg text-white font-bold shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Calendar</span>
                </button>
              </nav>

              <hr className="my-4 border-border" />

              {/* Quick Action Button */}
              <Button
                onClick={() => setCreateJobOpen(true)}
                className="w-full gradient-bg font-bold h-11 text-xs rounded-xl flex items-center justify-center gap-2 shadow-md text-white"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Job</span>
              </Button>
            </Card>
          </aside>

          {/* Right Main Content Area */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 w-full">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">
                      Welcome back{profile.businessName ? `, ${profile.businessName}` : ""}! 👋
                    </h1>
                    <p className="text-muted-foreground text-xs md:text-sm mt-1">
                      Here is your hiring overview and active job metrics.
                    </p>
                  </div>
                  <Button
                    onClick={() => setCreateJobOpen(true)}
                    className="gradient-bg font-bold rounded-xl h-11 px-5 shadow-md flex items-center gap-2 text-white"
                  >
                    <PlusCircle className="w-4 h-4" /> Post a Job
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  <Card className="glass border-primary/20 p-5 rounded-2xl shadow-sm">
                    <p className="text-xs text-muted-foreground font-semibold">Active Job Posts</p>
                    <h3 className="text-3xl font-black text-foreground mt-1">{jobs.length}</h3>
                    <p className="text-[11px] text-emerald-500 font-semibold mt-1">✓ Unlimited Free Posts</p>
                  </Card>

                  <Card className="glass border-primary/20 p-5 rounded-2xl shadow-sm">
                    <p className="text-xs text-muted-foreground font-semibold">Total Applicants</p>
                    <h3 className="text-3xl font-black text-foreground mt-1">{totalApplicants}</h3>
                    <p className="text-[11px] text-muted-foreground font-semibold mt-1">Real-time applications</p>
                  </Card>

                  <Card className="glass border-primary/20 p-5 rounded-2xl shadow-sm">
                    <p className="text-xs text-muted-foreground font-semibold">Interviews Scheduled</p>
                    <h3 className="text-3xl font-black text-foreground mt-1">{events.length}</h3>
                    <p className="text-[11px] text-muted-foreground font-semibold mt-1">Calendar events</p>
                  </Card>

                  <Card className="glass border-primary/20 p-5 rounded-2xl shadow-sm">
                    <p className="text-xs text-muted-foreground font-semibold">Profile Views</p>
                    <h3 className="text-3xl font-black text-foreground mt-1">0</h3>
                    <p className="text-[11px] text-emerald-500 font-semibold mt-1">Local job seekers</p>
                  </Card>
                </div>

                {/* Active Jobs Card */}
                <Card className="glass border-primary/20 shadow-md rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                      <CardTitle className="text-lg font-bold">Active Job Posts</CardTitle>
                      <CardDescription className="text-xs">Manage your current active vacancies</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("recruiting")}
                      className="text-xs font-bold text-primary"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {jobs.length === 0 ? (
                      <div className="py-12 px-4 text-center flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl w-full">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <h4 className="text-base font-bold text-foreground">No active job posts yet</h4>
                        <p className="text-xs text-muted-foreground mt-1 max-w-md">
                          Create your first job vacancy to start receiving applications from local candidates across SA Elevate.
                        </p>
                        <Button
                          onClick={() => setCreateJobOpen(true)}
                          className="mt-4 text-xs font-bold rounded-xl h-10 px-5 gradient-bg text-white shadow-md"
                        >
                          <PlusCircle className="w-4 h-4 mr-1.5" /> Create Your First Job
                        </Button>
                      </div>
                    ) : (
                      jobs.map((j) => (
                        <div
                          key={j.id}
                          className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <h4 className="font-bold text-foreground text-base">{j.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-primary" /> {j.location}
                              </span>
                              <span className="font-semibold">{j.type}</span>
                              <span>Posted {j.postedDate}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-primary/10 text-primary font-bold text-xs px-3 py-1">
                              {j.applicantsCount} Applicants
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyJobLink(j.title)}
                              className="h-9 text-xs rounded-xl"
                            >
                              <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* TAB 2: JOB SHARE */}
            {activeTab === "jobshare" && (
              <div className="space-y-6 w-full">
                <div>
                  <h1 className="text-2xl font-display font-bold gradient-text">Job Share & Syndication</h1>
                  <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                    Share your active job listings across social media, messaging, and Google Jobs.
                  </p>
                </div>

                {jobs.length === 0 ? (
                  <Card className="glass border-primary/20 border-2 border-dashed shadow-md rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">No Jobs Available to Share</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-md">
                      Post a job vacancy first to get shareable links, QR codes, and social syndication features.
                    </p>
                    <Button
                      onClick={() => setCreateJobOpen(true)}
                      className="mt-4 text-xs font-bold rounded-xl h-10 px-5 gradient-bg text-white shadow-md"
                    >
                      <PlusCircle className="w-4 h-4 mr-1.5" /> Create Job Now
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {jobs.map((j) => (
                      <Card key={j.id} className="glass border-primary/20 shadow-md rounded-2xl p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <Badge className="bg-emerald-500/10 text-emerald-500 font-bold text-xs mb-2">
                              Active Listing
                            </Badge>
                            <h3 className="text-lg font-bold text-foreground">{j.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                              <span>📍 {j.location}</span> • <span>{j.salary}</span>
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => copyJobLink(j.title)}
                              className="gradient-bg text-white font-semibold text-xs rounded-xl h-9 px-4"
                            >
                              <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Share Link
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs rounded-xl h-9 px-4">
                              <QrCode className="w-3.5 h-3.5 mr-1.5" /> Download QR
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CANDIDATE SEARCH (WorkOnward Style) */}
            {activeTab === "candidatesearch" && (
              <div className="space-y-6 w-full">
                {/* Header Title & Credits Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-display font-bold gradient-text flex items-center gap-2">
                      <Search className="w-6 h-6 text-primary" /> Candidate Search
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                      Find, preview, and unlock verified local candidates and resumes in your area.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    <div className="text-xs">
                      <span className="font-bold text-foreground">Credits: </span>
                      <span className="font-extrabold text-amber-600 dark:text-amber-400">{credits} Free Unlocks Left</span>
                    </div>
                    <Button size="sm" onClick={() => navigate("/pricing")} className="gradient-bg text-white font-bold text-[11px] h-7 px-3 rounded-xl ml-2 shadow-sm">
                      Get More
                    </Button>
                  </div>
                </div>

                {/* Dual Input Search Bar & Filter Controls */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.success(`Search applied: ${filteredCandidates.length} candidate profiles match.`);
                  }}
                  className="glass border-primary/20 p-4 rounded-2xl shadow-md space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="relative md:col-span-4">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
                      <Input
                        placeholder="Search by location (e.g. Seattle, WA)..."
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="pl-10 h-11 rounded-xl text-xs bg-background/80"
                      />
                    </div>
                    <div className="relative md:col-span-6">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
                      <Input
                        placeholder="Job title, skill, or keywords (e.g. Developer, AWS, Sales)..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="pl-10 h-11 rounded-xl text-xs bg-background/80"
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <Button type="submit" className="w-full gradient-bg text-white font-bold h-11 rounded-xl text-xs shadow-md">
                        <Search className="w-4 h-4 mr-1.5" /> Search
                      </Button>
                    </div>
                  </div>

                  {/* Filter Chips Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="px-3 py-1 font-semibold flex items-center gap-1">
                        <Filter className="w-3 h-3 text-primary" /> Filters
                      </Badge>
                      <Badge
                        onClick={() => setFilterUnlockedOnly(!filterUnlockedOnly)}
                        className={`cursor-pointer px-3 py-1 font-semibold transition-all ${
                          filterUnlockedOnly
                            ? "bg-primary text-white border-primary"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {filterUnlockedOnly ? "✓ Unlocked Only" : "Unlocked Only"}
                      </Badge>
                      <Badge
                        onClick={() => setFilterWithResume(!filterWithResume)}
                        className={`cursor-pointer px-3 py-1 font-semibold transition-all ${
                          filterWithResume
                            ? "bg-primary text-white border-primary"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {filterWithResume ? "✓ With Resume" : "With Resume"}
                      </Badge>
                      <Badge
                        onClick={() => setFilterFullTime(!filterFullTime)}
                        className={`cursor-pointer px-3 py-1 font-semibold transition-all ${
                          filterFullTime
                            ? "bg-primary text-white border-primary"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {filterFullTime ? "✓ Full-Time" : "Full-Time"}
                      </Badge>
                      {(searchKeyword || searchLocation || filterUnlockedOnly || filterWithResume || filterFullTime) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSearchKeyword("");
                            setSearchLocation("");
                            setFilterUnlockedOnly(false);
                            setFilterWithResume(false);
                            setFilterFullTime(false);
                            toast.info("Search & filters reset.");
                          }}
                          className="h-7 text-[11px] font-bold text-primary hover:bg-primary/10 px-2.5 rounded-lg"
                        >
                          Reset Filters
                        </Button>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Showing {filteredCandidates.length} candidate profiles
                    </p>
                  </div>
                </form>

                {/* Candidate List Cards Grid */}
                {filteredCandidates.length === 0 ? (
                  <Card className="glass border-primary/20 border-2 border-dashed shadow-md rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">No Candidates Matched Yet</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-md">
                      Search for candidates by location or keywords above, or post a job vacancy to receive candidate submissions from SA Elevate recruiters.
                    </p>
                    <Button
                      onClick={() => setCreateJobOpen(true)}
                      className="mt-4 text-xs font-bold rounded-xl h-10 px-5 gradient-bg text-white shadow-md flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" /> Post a Job Requisition
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {filteredCandidates.map((c) => {
                    const isUnlocked = unlockedCandidateIds.includes(c.id);
                    const isBookmarked = bookmarkedCandidateIds.includes(c.id);
                    const skillsList: string[] = normalizeSkills(c.skills);
                    const initials = (c.name || "Candidate")
                      .split(" ")
                      .map((n: string) => n[0] || "")
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "C";
                    const maskedEmail = c.maskedEmail || (c.email ? c.email.replace(/(.{2})(.*)(?=@)/, '$1***') : "c***@email.com");
                    const maskedPhone = c.maskedPhone || (c.phone ? c.phone.slice(0, 6) + "****" : "+1 (***) ***-****");
                    const additionalSkillsCount = Math.max(0, skillsList.length - 3);

                    return (
                      <Card
                        key={c.id}
                        className="glass border-primary/20 hover:border-primary/40 transition-all shadow-md rounded-2xl p-5 relative overflow-hidden group"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                          {/* Left Avatar & Candidate Meta */}
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-14 h-14 rounded-2xl gradient-bg text-white font-black flex items-center justify-center text-xl shadow-md shrink-0 relative">
                              {initials}
                              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background absolute -bottom-1 -right-1"></span>
                            </div>

                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3
                                  onClick={() => setSelectedCandidate(c)}
                                  className="font-bold text-foreground text-lg hover:text-primary transition-colors cursor-pointer"
                                >
                                  {c.name || "Candidate"}
                                </h3>
                                {isUnlocked ? (
                                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[11px] font-bold">
                                    ✓ Unlocked
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-amber-600 border-amber-500/30 text-[11px] font-bold bg-amber-500/5">
                                    🔒 Locked (3 Free Left)
                                  </Badge>
                                )}
                              </div>

                              <p className="text-sm font-semibold text-primary">{c.title || "Professional"}</p>

                              <p className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap pt-0.5">
                                <span className="flex items-center gap-1 font-medium">
                                  <MapPin className="w-3.5 h-3.5 text-primary" /> {c.location || "Location not specified"}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-medium">
                                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground" /> {c.experience || "Experience not listed"}
                                </span>
                              </p>

                              {/* Skills Tags */}
                              <div className="flex items-center gap-1.5 flex-wrap pt-2">
                                <span className="text-xs font-bold text-foreground mr-1">Skills:</span>
                                {skillsList.slice(0, 3).map((skill: string, idx: number) => (
                                  <Badge key={idx} variant="secondary" className="text-[11px] font-medium bg-muted/80">
                                    {skill}
                                  </Badge>
                                ))}
                                {additionalSkillsCount > 0 && (
                                  <Badge variant="outline" className="text-[11px] font-bold text-primary border-primary/30">
                                    +{additionalSkillsCount} more
                                  </Badge>
                                )}
                              </div>

                              {/* Masked vs Unlocked Contact Bar */}
                              <div className="pt-2 text-xs font-mono text-muted-foreground flex items-center gap-4 flex-wrap">
                                <span className="bg-muted/50 px-2.5 py-1 rounded-lg border border-border">
                                  ✉ {isUnlocked ? c.email : maskedEmail}
                                </span>
                                <span className="bg-muted/50 px-2.5 py-1 rounded-lg border border-border">
                                  📞 {isUnlocked ? c.phone : maskedPhone}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Action Buttons */}
                          <div className="flex flex-row md:flex-col items-center md:items-end gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border">
                            <Button
                              onClick={() => toggleBookmark(c.id)}
                              variant="outline"
                              size="icon"
                              className={`h-9 w-9 rounded-xl transition-colors ${
                                isBookmarked ? "text-amber-500 border-amber-500/40 bg-amber-500/10" : "text-muted-foreground"
                              }`}
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </Button>

                            {!isUnlocked ? (
                              <Button
                                onClick={() => handleUnlockProfile(c.id, c.name)}
                                className="gradient-bg text-white font-bold text-xs rounded-xl h-10 px-5 shadow-md flex items-center gap-2"
                              >
                                <Lock className="w-3.5 h-3.5" /> Unlock Profile
                              </Button>
                            ) : (
                              <Button
                                onClick={() => openEmailModal(c)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-md flex items-center gap-2"
                              >
                                <Mail className="w-3.5 h-3.5" /> Message Candidate
                              </Button>
                            )}

                            <Button
                              onClick={() => setSelectedCandidate(c)}
                              variant="outline"
                              className="text-xs font-semibold rounded-xl h-9 px-4 flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                )}
              </div>
            )}

            {/* TAB 4: CANDIDATE HUB */}
            {activeTab === "candidatehub" && (
              <div className="space-y-6 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-display font-bold gradient-text flex items-center gap-2">
                      <Users className="w-6 h-6 text-primary" /> Candidate Hub
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                      Create candidate profiles, upload resumes, assign jobs, and manage candidate workflows.
                    </p>
                  </div>
                  <Button
                    onClick={() => setCreateCandidateOpen(true)}
                    className="gradient-bg font-bold rounded-xl h-11 text-xs px-5 text-white shadow-md flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" /> Add Candidate
                  </Button>
                </div>

                {/* Candidate Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="glass border-primary/20 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Total Candidates</p>
                    <p className="text-2xl font-extrabold text-foreground mt-1">{candidates.length}</p>
                  </Card>
                  <Card className="glass border-primary/20 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-muted-foreground uppercase">New Applicants</p>
                    <p className="text-2xl font-extrabold text-primary mt-1">
                      {candidates.filter((c) => !c.status || c.status === "New Applicant").length}
                    </p>
                  </Card>
                  <Card className="glass border-primary/20 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Shortlisted</p>
                    <p className="text-2xl font-extrabold text-amber-500 mt-1">
                      {candidates.filter((c) => c.status === "Shortlisted").length}
                    </p>
                  </Card>
                  <Card className="glass border-primary/20 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Interview / Placed</p>
                    <p className="text-2xl font-extrabold text-emerald-500 mt-1">
                      {candidates.filter((c) => c.status === "Interview" || c.status === "Placed").length}
                    </p>
                  </Card>
                </div>

                {/* Pipeline Columns */}
                {candidates.length === 0 ? (
                  <Card className="glass border-primary/20 border-2 border-dashed shadow-md rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">No Candidate Profiles Yet</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-md">
                      Start building your candidate hub by uploading resumes, adding candidate details, and assigning job requisitions.
                    </p>
                    <Button
                      onClick={() => setCreateCandidateOpen(true)}
                      className="mt-4 text-xs font-bold rounded-xl h-10 px-5 gradient-bg text-white shadow-md flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" /> Create First Candidate
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1: New Applicants */}
                    <div className="bg-muted/40 rounded-2xl p-4 border border-border space-y-3 min-h-[350px] flex flex-col">
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> New Applicants
                        </h3>
                        <Badge variant="outline">
                          {candidates.filter((c) => !c.status || c.status === "New Applicant").length}
                        </Badge>
                      </div>
                      <div className="space-y-3 flex-1">
                        {candidates
                          .filter((c) => !c.status || c.status === "New Applicant")
                          .map((c) => (
                            <Card key={c.id} className="p-4 rounded-xl border-primary/20 shadow-sm glass">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-bold text-sm text-foreground">{c.name}</h4>
                                  <p className="text-xs text-primary font-semibold">{c.jobTitle || "Candidate"}</p>
                                </div>
                                {c.resumeName && (
                                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] flex items-center gap-1">
                                    <FileCheck className="w-3 h-3" /> Resume
                                  </Badge>
                                )}
                              </div>

                              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3" /> {c.location}
                              </p>
                              {c.email && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 truncate mt-0.5">
                                  <Mail className="w-3 h-3" /> {c.email}
                                </p>
                              )}
                              {c.phone && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 truncate mt-0.5">
                                  <Phone className="w-3 h-3" /> {c.phone}
                                </p>
                              )}

                              {c.notes && (
                                <p className="text-xs bg-muted/60 p-2 rounded-lg mt-2.5 text-muted-foreground italic line-clamp-2">
                                  "{c.notes}"
                                </p>
                              )}

                              <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setCandidates((prev) =>
                                      prev.map((item) => (item.id === c.id ? { ...item, status: "Shortlisted" } : item))
                                    );
                                    toast.success(`Moved ${c.name} to Shortlisted`);
                                  }}
                                  className="text-[11px] h-7 px-2.5 rounded-lg"
                                >
                                  Shortlist
                                </Button>
                              </div>
                            </Card>
                          ))}
                      </div>
                    </div>

                    {/* Column 2: Shortlisted */}
                    <div className="bg-muted/40 rounded-2xl p-4 border border-border space-y-3 min-h-[350px] flex flex-col">
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> Shortlisted
                        </h3>
                        <Badge variant="outline">{candidates.filter((c) => c.status === "Shortlisted").length}</Badge>
                      </div>
                      <div className="space-y-3 flex-1">
                        {candidates
                          .filter((c) => c.status === "Shortlisted")
                          .map((c) => (
                            <Card key={c.id} className="p-4 rounded-xl border-amber-500/20 shadow-sm glass">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-bold text-sm text-foreground">{c.name}</h4>
                                  <p className="text-xs text-primary font-semibold">{c.jobTitle || "Candidate"}</p>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3" /> {c.location}
                              </p>
                              <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setCandidates((prev) =>
                                      prev.map((item) => (item.id === c.id ? { ...item, status: "Interview" } : item))
                                    );
                                    toast.success(`Scheduled interview for ${c.name}`);
                                  }}
                                  className="text-[11px] h-7 px-2.5 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                                >
                                  Schedule Interview
                                </Button>
                              </div>
                            </Card>
                          ))}
                      </div>
                    </div>

                    {/* Column 3: Interview / Placed */}
                    <div className="bg-muted/40 rounded-2xl p-4 border border-border space-y-3 min-h-[350px] flex flex-col">
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Interview / Placed
                        </h3>
                        <Badge variant="outline">
                          {candidates.filter((c) => c.status === "Interview" || c.status === "Placed").length}
                        </Badge>
                      </div>
                      <div className="space-y-3 flex-1">
                        {candidates
                          .filter((c) => c.status === "Interview" || c.status === "Placed")
                          .map((c) => (
                            <Card key={c.id} className="p-4 rounded-xl border-emerald-500/20 shadow-sm glass">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-bold text-sm text-foreground">{c.name}</h4>
                                  <p className="text-xs text-primary font-semibold">{c.jobTitle || "Candidate"}</p>
                                </div>
                                <Badge className="bg-emerald-500 text-white text-[10px]">
                                  {c.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3" /> {c.location}
                              </p>
                            </Card>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: RECRUITING */}
            {activeTab === "recruiting" && (
              <div className="space-y-6 w-full">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-display font-bold gradient-text">Recruiting Manager</h1>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                      View, manage, and create job postings for your company.
                    </p>
                  </div>
                  <Button
                    onClick={() => setCreateJobOpen(true)}
                    className="gradient-bg font-bold rounded-xl h-10 text-xs px-4 text-white shadow-md"
                  >
                    <PlusCircle className="w-4 h-4 mr-1.5" /> Create Job
                  </Button>
                </div>

                {jobs.length === 0 ? (
                  <Card className="glass border-primary/20 border-2 border-dashed shadow-md rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">No Jobs Created Yet</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-md">
                      Create a job posting to start managing applications and hiring candidates.
                    </p>
                    <Button
                      onClick={() => setCreateJobOpen(true)}
                      className="mt-4 text-xs font-bold rounded-xl h-10 px-5 gradient-bg text-white shadow-md"
                    >
                      <PlusCircle className="w-4 h-4 mr-1.5" /> Post Your First Job
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {jobs.map((j) => (
                      <Card key={j.id} className="glass border-primary/20 shadow-md rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-foreground text-base">{j.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">📍 {j.location} • 💼 {j.type} • 💰 {j.salary}</p>
                        </div>
                        <Button size="sm" className="gradient-bg text-white font-semibold text-xs rounded-xl h-9 px-4">
                          View Applicants
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: WORKONWARD COMPANY CALENDAR */}
            {activeTab === "calendar" && (
              <div className="space-y-6 w-full">
                {/* Top Header & Controls Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-display font-bold gradient-text flex items-center gap-2">
                      <CalendarIcon className="w-6 h-6 text-primary" /> Interview & Events Calendar
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                      Schedule, track, and manage applicant interviews, team screenings, and company hiring events.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      onClick={() => setScheduleModalOpen(true)}
                      className="gradient-bg text-white font-bold text-xs rounded-xl h-10 px-5 shadow-md flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Schedule Event
                    </Button>
                  </div>
                </div>

                {/* Filter Controls & Month Navigator Row */}
                <Card className="glass border-primary/20 p-4 rounded-2xl shadow-sm space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Month & Year Switcher */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={prevMonth}
                          className="h-8 w-8 rounded-lg hover:bg-background"
                          title="Previous Month"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={goToToday}
                          className="h-8 text-xs font-bold px-3 rounded-lg hover:bg-background"
                        >
                          Today
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={nextMonth}
                          className="h-8 w-8 rounded-lg hover:bg-background"
                          title="Next Month"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>

                      <h2 className="text-lg font-bold text-foreground font-display min-w-[160px]">
                        {calendarDate.toLocaleString("default", { month: "long", year: "numeric" })}
                      </h2>
                    </div>

                    {/* Middle Category Filter Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge
                        onClick={() => setCalendarCategoryFilter("all")}
                        className={`cursor-pointer text-xs font-bold px-3 py-1 rounded-xl transition-all ${
                          calendarCategoryFilter === "all"
                            ? "gradient-bg text-white shadow-sm"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        All ({events.length})
                      </Badge>
                      <Badge
                        onClick={() => setCalendarCategoryFilter("interview")}
                        className={`cursor-pointer text-xs font-bold px-3 py-1 rounded-xl transition-all ${
                          calendarCategoryFilter === "interview"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20"
                        }`}
                      >
                        Interviews ({events.filter((e) => e.type === "interview").length})
                      </Badge>
                      <Badge
                        onClick={() => setCalendarCategoryFilter("screening")}
                        className={`cursor-pointer text-xs font-bold px-3 py-1 rounded-xl transition-all ${
                          calendarCategoryFilter === "screening"
                            ? "bg-amber-600 text-white shadow-sm"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20"
                        }`}
                      >
                        Screenings ({events.filter((e) => e.type === "screening").length})
                      </Badge>
                      <Badge
                        onClick={() => setCalendarCategoryFilter("webinar")}
                        className={`cursor-pointer text-xs font-bold px-3 py-1 rounded-xl transition-all ${
                          calendarCategoryFilter === "webinar"
                            ? "bg-purple-600 text-white shadow-sm"
                            : "bg-purple-500/10 text-purple-600 border border-purple-500/20 hover:bg-purple-500/20"
                        }`}
                      >
                        Webinars ({events.filter((e) => e.type === "webinar").length})
                      </Badge>
                    </div>

                    {/* Right View Mode Selector */}
                    <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
                      <Button
                        variant={calendarViewMode === "month" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCalendarViewMode("month")}
                        className={`h-8 text-xs font-semibold rounded-lg ${
                          calendarViewMode === "month" ? "gradient-bg text-white shadow-sm" : ""
                        }`}
                      >
                        Month
                      </Button>
                      <Button
                        variant={calendarViewMode === "agenda" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCalendarViewMode("agenda")}
                        className={`h-8 text-xs font-semibold rounded-lg ${
                          calendarViewMode === "agenda" ? "gradient-bg text-white shadow-sm" : ""
                        }`}
                      >
                        Agenda
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Main Content Layout: Calendar Grid / Agenda List + Upcoming Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Month Grid or Agenda List (2 Cols) */}
                  <div className="lg:col-span-2 space-y-4">
                    {calendarViewMode === "month" ? (
                      <Card className="glass border-primary/20 p-5 rounded-2xl shadow-md space-y-4 overflow-hidden">
                        {/* Day Names Header */}
                        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
                          <span>Sun</span>
                          <span>Mon</span>
                          <span>Tue</span>
                          <span>Wed</span>
                          <span>Thu</span>
                          <span>Fri</span>
                          <span>Sat</span>
                        </div>

                        {/* Month Days Matrix Grid */}
                        <div className="grid grid-cols-7 gap-1.5 text-xs">
                          {(() => {
                            const year = calendarDate.getFullYear();
                            const month = calendarDate.getMonth();
                            const daysInMonth = getDaysInMonth(year, month);
                            const firstDayIndex = getFirstDayOfMonth(year, month);
                            const today = new Date();
                            const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

                            const cells: React.ReactNode[] = [];

                            // Empty cells for leading days
                            for (let i = 0; i < firstDayIndex; i++) {
                              cells.push(
                                <div key={`empty-${i}`} className="h-24 p-1.5 rounded-xl bg-muted/20 border border-transparent"></div>
                              );
                            }

                            // Days of the current month
                            for (let day = 1; day <= daysInMonth; day++) {
                              const isToday = isCurrentMonth && today.getDate() === day;
                              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                              const dayEvents = events.filter((e) => {
                                const matchesDate = e.date === dateStr;
                                const matchesCategory =
                                  calendarCategoryFilter === "all" || e.type === calendarCategoryFilter;
                                return matchesDate && matchesCategory;
                              });

                              cells.push(
                                <div
                                  key={`day-${day}`}
                                  onClick={() => {
                                    setEventForm((prev) => ({ ...prev, date: dateStr }));
                                    setScheduleModalOpen(true);
                                  }}
                                  className={`h-24 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                                    isToday
                                      ? "border-primary bg-primary/5 shadow-inner"
                                      : "border-border/60 hover:border-primary/40 bg-card/60 hover:bg-card"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span
                                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                                        isToday ? "gradient-bg text-white shadow-sm" : "text-foreground"
                                      }`}
                                    >
                                      {day}
                                    </span>
                                    {dayEvents.length > 0 && (
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-bold border-primary/30 text-primary">
                                        {dayEvents.length}
                                      </Badge>
                                    )}
                                  </div>

                                  {/* Day Event Badges */}
                                  <div className="space-y-1 overflow-y-auto max-h-14 scrollbar-none">
                                    {dayEvents.slice(0, 2).map((ev) => (
                                      <div
                                        key={ev.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedEventDetails(ev);
                                        }}
                                        className={`text-[10px] px-1.5 py-0.5 rounded-lg truncate font-semibold cursor-pointer transition-transform hover:scale-105 ${
                                          ev.type === "interview"
                                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                                            : ev.type === "screening"
                                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                                            : "bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30"
                                        }`}
                                      >
                                        {ev.time} • {ev.candidate || ev.title}
                                      </div>
                                    ))}
                                    {dayEvents.length > 2 && (
                                      <p className="text-[9px] font-bold text-primary text-center">+{dayEvents.length - 2} more</p>
                                    )}
                                  </div>
                                </div>
                              );
                            }

                            return cells;
                          })()}
                        </div>
                      </Card>
                    ) : (
                      /* Agenda View */
                      <Card className="glass border-primary/20 p-5 rounded-2xl shadow-md space-y-4">
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border pb-3">
                          <Clock className="w-4 h-4 text-primary" /> Scheduled Agenda & Events
                        </h3>
                        {events.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-8">No scheduled events found.</p>
                        ) : (
                          <div className="space-y-3">
                            {events
                              .filter(
                                (e) => calendarCategoryFilter === "all" || e.type === calendarCategoryFilter
                              )
                              .map((ev) => (
                                <div
                                  key={ev.id}
                                  onClick={() => setSelectedEventDetails(ev)}
                                  className="p-4 rounded-xl border border-border bg-card/60 hover:bg-card transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl gradient-bg text-white font-bold flex items-center justify-center text-sm shrink-0">
                                      {(ev.candidate || "E").slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-sm text-foreground">{ev.title || ev.candidate}</h4>
                                      <p className="text-xs text-primary font-semibold">{ev.role}</p>
                                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                        <span>📅 {ev.date}</span>
                                        <span>⏰ {ev.time} ({ev.duration})</span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Badge
                                      className={`text-[10px] font-bold uppercase ${
                                        ev.type === "interview"
                                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                          : ev.type === "screening"
                                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                          : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                                      }`}
                                    >
                                      {ev.type}
                                    </Badge>
                                    {ev.meetingUrl && (
                                      <a
                                        href={ev.meetingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow-sm"
                                      >
                                        <Video className="w-3.5 h-3.5" /> Join
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </Card>
                    )}
                  </div>

                  {/* Right Column: Upcoming Schedule Timeline Sidebar */}
                  <div className="space-y-4">
                    <Card className="glass border-primary/20 p-5 rounded-2xl shadow-md space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-primary" /> Upcoming Interviews
                        </h3>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {events.length} Active
                        </Badge>
                      </div>

                      {events.length === 0 ? (
                        <div className="text-center py-6">
                          <CalendarIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                          <p className="text-xs text-muted-foreground">No upcoming interviews scheduled.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {events.slice(0, 4).map((ev) => (
                            <div
                              key={ev.id}
                              onClick={() => setSelectedEventDetails(ev)}
                              className="p-3.5 rounded-xl border border-border bg-card/80 hover:bg-card transition-all cursor-pointer space-y-2 group shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-8 h-8 rounded-lg gradient-bg text-white font-bold text-xs flex items-center justify-center shrink-0">
                                    {(ev.candidate || "C").slice(0, 2).toUpperCase()}
                                  </div>
                                  <div className="truncate">
                                    <h4 className="font-bold text-xs text-foreground truncate">{ev.candidate || ev.title}</h4>
                                    <p className="text-[11px] text-primary font-medium truncate">{ev.role}</p>
                                  </div>
                                </div>
                                <Badge
                                  className={`text-[9px] font-bold uppercase shrink-0 ${
                                    ev.type === "interview"
                                      ? "bg-emerald-500/10 text-emerald-600"
                                      : "bg-amber-500/10 text-amber-600"
                                  }`}
                                >
                                  {ev.type}
                                </Badge>
                              </div>

                              <div className="text-[11px] text-muted-foreground flex items-center justify-between border-t border-border/60 pt-2">
                                <span className="flex items-center gap-1 font-medium">⏰ {ev.time}</span>
                                <span className="font-mono text-[10px]">{ev.date}</span>
                              </div>

                              {ev.meetingUrl && (
                                <a
                                  href={ev.meetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full mt-1 inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 h-8 rounded-lg transition-colors shadow-sm"
                                >
                                  <Video className="w-3.5 h-3.5" /> Join Google Meet
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: PRICING & BILLING DASHBOARD */}
            {activeTab === "pricing" && (
              <div className="space-y-6 w-full">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-display font-bold gradient-text flex items-center gap-2">
                      <CreditCard className="w-6 h-6 text-primary" /> Subscription & Billing Dashboard
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                      Manage your active hiring plan, upgrade features, buy resume unlock credits, and download receipts.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 capitalize">
                      Active Plan: {subscriptionPlan === "starter" ? "Starter (14-Day Free Trial)" : "Free Tier"}
                    </span>
                  </div>
                </div>

                {/* Plan Overview & Credits Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Active Subscription Overview */}
                  <Card className="glass border-primary/20 p-6 rounded-2xl shadow-md space-y-4 lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div>
                        <Badge className="bg-primary/10 text-primary border-none font-bold text-xs mb-1">
                          Current Subscription
                        </Badge>
                        <h3 className="text-xl font-bold text-foreground">
                          {subscriptionPlan === "starter" ? "Starter Plan — $39/month" : "Free Plan — $0/month"}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {subscriptionPlan === "starter"
                            ? "Next billing date: Aug 15, 2026 (14-Day Trial Period Active)"
                            : "Basic access with 3 free profile unlocks."}
                        </p>
                      </div>
                      {subscriptionPlan === "free" ? (
                        <Button
                          onClick={() => {
                            setSubscriptionPlan("starter");
                            toast.success("Upgraded to Starter 14-Day Free Trial!");
                          }}
                          className="gradient-bg text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md"
                        >
                          <Zap className="w-3.5 h-3.5 mr-1.5" /> Upgrade to Starter
                        </Button>
                      ) : (
                        <Badge className="bg-emerald-500 text-white font-bold text-xs px-3 py-1">
                          ✓ Active Trial
                        </Badge>
                      )}
                    </div>

                    {/* Features included */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Post Unlimited Job Vacancies
                      </div>
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> AI Resume Auto-parsing
                      </div>
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Unlimited Candidate Messaging
                      </div>
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 50% Off Resume Unlocks ($2/resume)
                      </div>
                    </div>
                  </Card>

                  {/* Right: Credits Wallet Box */}
                  <Card className="glass border-primary/20 p-6 rounded-2xl shadow-md space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Unlock Credits</span>
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      </div>
                      <h3 className="text-3xl font-black text-foreground">{credits} Credits</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Use credits to unlock candidate phone numbers, emails & PDF resumes.
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border">
                      <p className="text-[11px] font-bold text-foreground">Top-Up Credit Packs:</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setCredits((prev) => prev + 5);
                            toast.success("Added 5 Unlock Credits ($10)!");
                          }}
                          className="flex-1 text-xs font-bold rounded-xl h-9 border-amber-500/40 text-amber-600 hover:bg-amber-500/10"
                        >
                          +5 Credits ($10)
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setCredits((prev) => prev + 15);
                            toast.success("Added 15 Unlock Credits ($25)!");
                          }}
                          className="flex-1 gradient-bg text-white font-bold text-xs rounded-xl h-9 shadow-sm"
                        >
                          +15 Credits ($25)
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Plan Upgrade Selector Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* Free Card */}
                  <Card className={`glass p-6 rounded-2xl border ${subscriptionPlan === "free" ? "border-primary shadow-md" : "border-border"}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Free Plan</h3>
                        <p className="text-xs text-muted-foreground">Try out hiring with zero risk</p>
                      </div>
                      <span className="text-2xl font-black text-foreground">$0<span className="text-xs text-muted-foreground">/mo</span></span>
                    </div>

                    <ul className="space-y-2 text-xs text-muted-foreground my-4">
                      <li className="flex items-center gap-2">✓ Unlimited Job Listings</li>
                      <li className="flex items-center gap-2">✓ Basic Applicant Management</li>
                      <li className="flex items-center gap-2">✓ 3 Free Candidate Profile Unlocks</li>
                    </ul>

                    {subscriptionPlan === "free" ? (
                      <Button disabled variant="outline" className="w-full h-10 text-xs font-bold rounded-xl">Current Plan</Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => { setSubscriptionPlan("free"); toast.info("Switched to Free Plan."); }}
                        className="w-full h-10 text-xs font-bold rounded-xl"
                      >
                        Switch to Free
                      </Button>
                    )}
                  </Card>

                  {/* Starter Card */}
                  <Card className={`glass p-6 rounded-2xl border ${subscriptionPlan === "starter" ? "border-primary shadow-lg ring-1 ring-primary/30" : "border-border"}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <Badge className="bg-primary text-primary-foreground font-bold text-[10px] mb-1">Recommended</Badge>
                        <h3 className="text-lg font-bold text-foreground">Starter Plan</h3>
                        <p className="text-xs text-muted-foreground">For growing businesses actively hiring</p>
                      </div>
                      <span className="text-2xl font-black text-primary">$39<span className="text-xs text-muted-foreground">/mo</span></span>
                    </div>

                    <ul className="space-y-2 text-xs text-foreground font-medium my-4">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> AI Resume Auto-parsing</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Unlimited Candidate Messaging</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 50% Off Database Unlocks ($2/resume)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Priority Support</li>
                    </ul>

                    {subscriptionPlan === "starter" ? (
                      <Button disabled className="w-full h-10 text-xs font-bold rounded-xl bg-emerald-600 text-white">✓ Active (14-Day Free Trial)</Button>
                    ) : (
                      <Button
                        onClick={() => { setSubscriptionPlan("starter"); toast.success("Started Starter 14-Day Free Trial!"); }}
                        className="w-full h-10 text-xs font-bold rounded-xl gradient-bg text-white shadow-md"
                      >
                        Start 14-Day Free Trial
                      </Button>
                    )}
                  </Card>
                </div>

                {/* Billing History Table */}
                <Card className="glass border-primary/20 p-6 rounded-2xl shadow-md space-y-4">
                  <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Billing & Payment Receipts
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground font-semibold">
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Description</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        <tr>
                          <td className="py-3 px-3 font-medium">Aug 01, 2026</td>
                          <td className="py-3 px-3 font-bold text-foreground">Starter Plan — 14-Day Free Trial</td>
                          <td className="py-3 px-3 font-mono">$0.00</td>
                          <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">Active Trial</Badge></td>
                          <td className="py-3 px-3 text-right"><Button size="sm" variant="ghost" className="h-7 text-[11px]"><Download className="w-3 h-3 mr-1" /> PDF</Button></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-medium">Aug 01, 2026</td>
                          <td className="py-3 px-3 font-bold text-foreground">Business Account Registration (3 Free Credits)</td>
                          <td className="py-3 px-3 font-mono">$0.00</td>
                          <td className="py-3 px-3"><Badge variant="outline" className="text-[10px]">Completed</Badge></td>
                          <td className="py-3 px-3 text-right"><Button size="sm" variant="ghost" className="h-7 text-[11px]"><Download className="w-3 h-3 mr-1" /> PDF</Button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Create Job Modal */}
      <CreateJobModal
        open={createJobOpen}
        onOpenChange={setCreateJobOpen}
        onJobCreated={handleJobCreated}
      />

      {/* Create Candidate Modal */}
      <CreateCandidateModal
        open={createCandidateOpen}
        onOpenChange={setCreateCandidateOpen}
        onCandidateCreated={handleCandidateCreated}
        availableJobs={jobs}
      />

      {/* WorkOnward Style Candidate Details Side Drawer / Overlay */}
      <Sheet open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 overflow-y-auto bg-background">
          {selectedCandidate && (
            <div className="space-y-6 pb-12">
              {/* Cover Header Banner */}
              <div className="gradient-bg p-6 md:p-8 text-white relative">
                <div className="flex items-start gap-4 pt-4">
                  <div className="w-20 h-20 rounded-2xl bg-white text-primary font-black text-3xl flex items-center justify-center shadow-xl border-4 border-white/20">
                    {(selectedCandidate.name || "Candidate")
                      .split(" ")
                      .map((n: string) => n[0] || "")
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "C"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-display">{selectedCandidate.name || "Candidate"}</h2>
                    <p className="text-sm font-semibold opacity-90">{selectedCandidate.title || "Professional"}</p>
                    <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {selectedCandidate.location || "Location not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content Body */}
              <div className="px-6 space-y-6">
                {/* Contact Unlock Card */}
                <Card className="glass border-primary/30 p-5 rounded-2xl shadow-sm space-y-3">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> Contact Details
                  </h3>
                  {unlockedCandidateIds.includes(selectedCandidate.id) ? (
                    <div className="space-y-2 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                        ✓ Profile & Contact Information Unlocked
                      </p>
                      <div className="text-xs font-mono space-y-1 pt-1 text-foreground">
                        <p><strong>Email:</strong> {selectedCandidate.email || "candidate@example.com"}</p>
                        <p><strong>Phone:</strong> {selectedCandidate.phone || "+1 (555) 000-0000"}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => openEmailModal(selectedCandidate)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-8 px-4"
                        >
                          <Mail className="w-3.5 h-3.5 mr-1" /> Send Email
                        </Button>
                        {selectedCandidate.phone && (
                          <a href={`tel:${selectedCandidate.phone}`}>
                            <Button size="sm" variant="outline" className="text-xs rounded-xl h-8 px-4">
                              <Phone className="w-3.5 h-3.5 mr-1" /> Call
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl">
                      <div className="text-xs font-mono text-muted-foreground space-y-1">
                        <p><strong>Email:</strong> {selectedCandidate.maskedEmail || "c***@email.com"}</p>
                        <p><strong>Phone:</strong> {selectedCandidate.maskedPhone || "+1 (***) ***-****"}</p>
                      </div>
                      <p className="text-xs text-muted-foreground italic">
                        Contact details and full resume are protected. Click below to unlock with 1 free credit.
                      </p>
                      <Button
                        onClick={() => handleUnlockProfile(selectedCandidate.id, selectedCandidate.name || "Candidate")}
                        className="w-full gradient-bg text-white font-bold text-xs rounded-xl h-10 shadow-md flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4" /> Unlock Profile & Resume
                      </Button>
                    </div>
                  )}
                </Card>

                {/* Resume Preview Box */}
                <Card className="glass border-primary/20 p-5 rounded-2xl shadow-sm space-y-3">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Candidate Resume
                  </h3>
                  {unlockedCandidateIds.includes(selectedCandidate.id) ? (
                    <div className="border border-border p-4 rounded-xl bg-card space-y-3">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-5 h-5 text-emerald-500" />
                          <span className="text-xs font-bold">{(selectedCandidate.name || "Candidate").replace(/\s+/g, "_")}_Resume.pdf</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadResume(selectedCandidate)}
                          className="text-[11px] h-7 px-2.5 rounded-lg border-primary/30 hover:bg-primary/10"
                        >
                          <Download className="w-3 h-3 mr-1 text-primary" /> Download
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        "{selectedCandidate.summary || "Candidate profile summary and career history."}"
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-primary/20 p-8 rounded-xl text-center space-y-2 bg-muted/30">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <Lock className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-xs text-foreground">Resume Preview Locked</h4>
                      <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                        Unlock candidate profile to view full PDF resume, work history, and direct references.
                      </p>
                    </div>
                  )}
                </Card>

                {/* Experience Section */}
                <Card className="glass border-primary/20 p-5 rounded-2xl shadow-sm space-y-3">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" /> Work Experience
                  </h3>
                  <div className="space-y-3 border-l-2 border-primary/30 pl-4 ml-1">
                    <div>
                      <h4 className="font-bold text-xs text-foreground">{selectedCandidate.companyRole || selectedCandidate.title || "Professional Role"}</h4>
                      <p className="text-[11px] text-primary font-semibold">{selectedCandidate.company || "Enterprise Firm"}</p>
                      <p className="text-[11px] text-muted-foreground">{selectedCandidate.dates || selectedCandidate.experience || "Recent"}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {selectedCandidate.summary || "Demonstrated expertise in software delivery, client communication, and teamwork."}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Education Section */}
                <Card className="glass border-primary/20 p-5 rounded-2xl shadow-sm space-y-3">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" /> Education & Qualifications
                  </h3>
                  <p className="text-xs text-foreground font-semibold bg-muted/50 p-3 rounded-xl border border-border">
                    🎓 {typeof selectedCandidate.education === 'string' ? selectedCandidate.education : (Array.isArray(selectedCandidate.education) ? selectedCandidate.education.join(' • ') : "Bachelor Degree / Higher Qualification")}
                  </p>
                </Card>

                {/* Skills Cloud */}
                <Card className="glass border-primary/20 p-5 rounded-2xl shadow-sm space-y-3">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Top Skills & Competencies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {normalizeSkills(selectedCandidate.skills).map((s: string, idx: number) => (
                      <Badge key={idx} className="bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1 font-semibold">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Business Profile Modal */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" /> Edit Business Profile
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update your business name, location, and logo displayed across your portal.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 py-2">
            {/* Logo */}
            <div>
              <Label className="text-xs font-bold block mb-1">Business Logo</Label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl border border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden">
                  {editLogo ? (
                    <img src={editLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground font-semibold text-xs border border-border hover:bg-secondary/80">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Change Logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUploadInModal} className="hidden" />
                </label>
              </div>
            </div>

            {/* Business Name */}
            <div>
              <Label htmlFor="editName" className="text-xs font-bold block mb-1">Business Name</Label>
              <Input
                id="editName"
                value={editBusinessName}
                onChange={(e) => setEditBusinessName(e.target.value)}
                placeholder="Enter business name"
                className="h-10 text-sm font-medium rounded-xl"
                required
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="editLoc" className="text-xs font-bold block mb-1">Business Location</Label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="editLoc"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="e.g. Seattle, WA or New York, NY"
                  className="h-10 pl-9 text-sm font-medium rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 flex gap-2 justify-end">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditProfileOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={savingProfile} className="rounded-xl font-bold gradient-bg text-white gap-1.5">
                {savingProfile ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</> : "Save Profile"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Email Composer Modal */}
      <Dialog open={Boolean(emailModalCandidate)} onOpenChange={(open) => !open && setEmailModalCandidate(null)}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-600" /> Send Email to {emailModalCandidate?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Directly contact candidate at {emailModalCandidate?.email || "their registered email"}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendEmailSubmit} className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-bold block mb-1">To</Label>
              <Input
                value={emailModalCandidate?.email || "candidate@example.com"}
                disabled
                className="h-9 text-xs font-mono bg-muted/50 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-xs font-bold block mb-1">Subject</Label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject"
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-bold block mb-1">Message Body</Label>
              <Textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={6}
                placeholder="Write your email message..."
                className="text-xs rounded-xl font-sans"
                required
              />
            </div>

            <DialogFooter className="pt-2 flex gap-2 justify-end">
              <Button type="button" variant="outline" size="sm" onClick={() => setEmailModalCandidate(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={sendingEmail} className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                {sendingEmail ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Preparing...</> : <><Send className="w-3.5 h-3.5" /> Send Email</>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule New Event / Interview Modal Dialog */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" /> Schedule Interview / Event
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Schedule a new applicant interview, technical round, or team screening.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateEvent} className="space-y-4 py-2 text-xs">
            <div>
              <Label className="text-xs font-bold block mb-1">Event Category / Type</Label>
              <select
                value={eventForm.type}
                onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background font-medium focus:ring-2 focus:ring-primary"
              >
                <option value="interview">Candidate Interview</option>
                <option value="screening">Initial HR Screening</option>
                <option value="webinar">Company Recruitment Webinar</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold block mb-1">Candidate Name</Label>
                <Input
                  value={eventForm.candidateName}
                  onChange={(e) => setEventForm({ ...eventForm, candidateName: e.target.value })}
                  placeholder="e.g. sajaruth"
                  className="h-10 text-xs rounded-xl"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-bold block mb-1">Target Position / Role</Label>
                <Input
                  value={eventForm.jobTitle}
                  onChange={(e) => setEventForm({ ...eventForm, jobTitle: e.target.value })}
                  placeholder="e.g. WEB DEVELOPER"
                  className="h-10 text-xs rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-bold block mb-1">Date</Label>
                <Input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-bold block mb-1">Start Time</Label>
                <Input
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  placeholder="10:00 AM"
                  className="h-10 text-xs rounded-xl"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-bold block mb-1">Duration</Label>
                <Input
                  value={eventForm.duration}
                  onChange={(e) => setEventForm({ ...eventForm, duration: e.target.value })}
                  placeholder="30 mins"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold block mb-1">Google Meet / Video Link</Label>
              <Input
                value={eventForm.meetingUrl}
                onChange={(e) => setEventForm({ ...eventForm, meetingUrl: e.target.value })}
                placeholder="https://meet.google.com/abc-defg-hij"
                className="h-10 text-xs rounded-xl font-mono"
              />
            </div>

            <div>
              <Label className="text-xs font-bold block mb-1">Interview Instructions / Notes</Label>
              <Textarea
                value={eventForm.notes}
                onChange={(e) => setEventForm({ ...eventForm, notes: e.target.value })}
                rows={3}
                placeholder="Add topics to cover or meeting instructions..."
                className="text-xs rounded-xl"
              />
            </div>

            <DialogFooter className="pt-2 flex gap-2 justify-end">
              <Button type="button" variant="outline" size="sm" onClick={() => setScheduleModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gradient-bg text-white font-bold text-xs rounded-xl h-10 px-5 shadow-md">
                Schedule Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Event Details & Action Modal Dialog */}
      <Dialog open={Boolean(selectedEventDetails)} onOpenChange={(open) => !open && setSelectedEventDetails(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" /> {selectedEventDetails?.title || selectedEventDetails?.candidate}
              </span>
              <Badge
                className={`text-[10px] font-bold uppercase ${
                  selectedEventDetails?.type === "interview"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-amber-500/10 text-amber-600"
                }`}
              >
                {selectedEventDetails?.type}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Candidate: <strong className="text-foreground">{selectedEventDetails?.candidate}</strong> • Role: <strong className="text-foreground">{selectedEventDetails?.role}</strong>
            </DialogDescription>
          </DialogHeader>

          {selectedEventDetails && (
            <div className="space-y-4 py-2 text-xs">
              <div className="bg-muted/40 p-4 rounded-xl space-y-2 border border-border">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" /> Date & Time:
                  </span>
                  <span className="font-mono text-muted-foreground">{selectedEventDetails.date} at {selectedEventDetails.time} ({selectedEventDetails.duration})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> Location:
                  </span>
                  <span className="text-muted-foreground">{selectedEventDetails.location || "Google Meet"}</span>
                </div>
              </div>

              {selectedEventDetails.notes && (
                <div>
                  <span className="font-bold text-foreground block mb-1">Notes & Topics:</span>
                  <p className="p-3 bg-card border border-border rounded-xl text-muted-foreground leading-relaxed">
                    {selectedEventDetails.notes}
                  </p>
                </div>
              )}

              {selectedEventDetails.meetingUrl && (
                <a
                  href={selectedEventDetails.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 h-10 rounded-xl transition-colors shadow-md"
                >
                  <Video className="w-4 h-4" /> Join Video Interview Call
                </a>
              )}

              <DialogFooter className="pt-2 flex justify-between items-center w-full">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteEvent(selectedEventDetails.id)}
                  className="rounded-xl text-xs gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Cancel Event
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEventDetails(null)}
                  className="rounded-xl text-xs"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
