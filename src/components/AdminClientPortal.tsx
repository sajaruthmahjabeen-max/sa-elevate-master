import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Building2,
  Briefcase,
  Search,
  RefreshCw,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  DollarSign,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  ShieldCheck,
  Sparkles,
  MapPin,
  Users,
  UserPlus,
  AlertCircle,
  X,
  FileText,
  UserCheck,
  Check
} from "lucide-react";

export type ClientJobPost = {
  id: string;
  created_at: string;
  title: string;
  department: string | null;
  company_name: string;
  contact_name: string | null;
  contact_email: string;
  contact_phone: string | null;
  job_type: string | null;
  workplace_type: string | null;
  experience_level: string | null;
  location: string | null;
  salary_range: string | null;
  urgency: string | null;
  skills: string[] | any;
  description: string | null;
  status: "New" | "Reviewing" | "Matched" | "In Interview" | "Fulfilled" | "Closed";
  admin_notes: string | null;
  assigned_candidates?: any[];
};

export const AdminClientPortal: React.FC = () => {
  const [jobs, setJobs] = useState<ClientJobPost[]>([]);
  const [availableCandidates, setAvailableCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedJob, setSelectedJob] = useState<ClientJobPost | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Edit fields inside modal
  const [editStatus, setEditStatus] = useState<ClientJobPost["status"]>("New");
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState("");

  const fetchJobsAndCandidates = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      // 1. Fetch available candidates from candidates table
      const { data: candData } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false });

      if (candData) {
        setAvailableCandidates(candData);
      }

      // 2. Fetch from client_job_posts
      const { data, error } = await supabase
        .from("client_job_posts")
        .select("*")
        .order("created_at", { ascending: false });

      let fetchedJobs: ClientJobPost[] = [];

      if (!error && data && data.length > 0) {
        fetchedJobs = data.map((item: any) => ({
          ...item,
          skills: Array.isArray(item.skills) ? item.skills : (typeof item.skills === 'string' ? JSON.parse(item.skills || '[]') : []),
          assigned_candidates: Array.isArray(item.assigned_candidates) ? item.assigned_candidates : [],
        }));
      } else {
        // Fallback: check localStorage & inquiries
        const localData = localStorage.getItem("sa_client_posted_jobs");
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            if (Array.isArray(parsed)) {
              fetchedJobs = parsed.map((item: any) => ({
                id: item.id || 'cj-' + Math.random(),
                created_at: item.created_at || new Date().toISOString(),
                title: item.title || 'Untitled Job',
                department: item.department || 'General',
                company_name: item.company_name || 'Client Co.',
                contact_name: item.contact_name || 'Hiring Lead',
                contact_email: item.contact_email || 'client@example.com',
                contact_phone: item.contact_phone || '',
                job_type: item.job_type || 'Full-Time',
                workplace_type: item.workplace_type || 'Remote',
                experience_level: item.experience_level || 'Mid-Senior',
                location: item.location || 'Remote',
                salary_range: item.salary_range || 'Competitive',
                urgency: item.urgency || 'Immediate',
                skills: Array.isArray(item.skills) ? item.skills : [],
                description: item.description || '',
                status: (item.status || 'New') as any,
                admin_notes: item.admin_notes || '',
                assigned_candidates: item.assigned_candidates || [],
              }));
            }
          } catch (e) {
            console.error("Error parsing local jobs:", e);
          }
        }
      }

      setJobs(fetchedJobs);
    } catch (err: any) {
      console.warn("Client portal fetch notice:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobsAndCandidates();

    // Setup real-time listener if available
    const channel = supabase
      .channel("client_jobs_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "client_job_posts" }, () => {
        fetchJobsAndCandidates(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company_name.toLowerCase().includes(q) ||
        job.contact_email.toLowerCase().includes(q) ||
        (job.contact_name && job.contact_name.toLowerCase().includes(q)) ||
        (job.location && job.location.toLowerCase().includes(q)) ||
        (Array.isArray(job.skills) && job.skills.some((s: string) => s.toLowerCase().includes(q)));

      const matchesStatus =
        statusFilter === "all" ||
        job.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = jobs.length;
    const newCount = jobs.filter((j) => j.status === "New").length;
    const reviewing = jobs.filter((j) => j.status === "Reviewing").length;
    const matched = jobs.filter((j) => j.status === "Matched" || j.status === "Fulfilled").length;
    return { total, newCount, reviewing, matched };
  }, [jobs]);

  const handleOpenDetail = (job: ClientJobPost) => {
    setSelectedJob(job);
    setEditStatus(job.status);
    setEditNotes(job.admin_notes || "");
    setIsDetailOpen(true);
  };

  const handleSaveDetails = async () => {
    if (!selectedJob) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("client_job_posts")
        .update({
          status: editStatus,
          admin_notes: editNotes,
        })
        .eq("id", selectedJob.id);

      if (error) {
        console.warn("Supabase update fallback to local state:", error.message);
      }

      // Update local array & storage
      const updated = jobs.map((j) =>
        j.id === selectedJob.id ? { ...j, status: editStatus, admin_notes: editNotes } : j
      );
      setJobs(updated);
      localStorage.setItem("sa_client_posted_jobs", JSON.stringify(updated));

      setSelectedJob({ ...selectedJob, status: editStatus, admin_notes: editNotes });
      toast.success("Job post status and notes updated!");
    } catch (err: any) {
      toast.error(`Error saving: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAssignCandidate = async (candidate: any) => {
    if (!selectedJob) return;

    const currentAssigned = selectedJob.assigned_candidates || [];
    const isAlreadyAssigned = currentAssigned.some((c: any) => c.id === candidate.id);

    let nextAssigned: any[];
    if (isAlreadyAssigned) {
      nextAssigned = currentAssigned.filter((c: any) => c.id !== candidate.id);
      toast.info(`Removed ${candidate.name} from assigned list.`);
    } else {
      nextAssigned = [
        ...currentAssigned,
        {
          id: candidate.id,
          name: candidate.name,
          title: candidate.job_title || candidate.title || "Specialist",
          email: candidate.email,
          phone: candidate.phone,
          assigned_at: new Date().toISOString(),
        },
      ];
      toast.success(`Assigned ${candidate.name} to ${selectedJob.title}!`);
    }

    const nextStatus = nextAssigned.length > 0 && selectedJob.status === "New" ? "Matched" : selectedJob.status;

    try {
      await supabase
        .from("client_job_posts")
        .update({
          assigned_candidates: nextAssigned,
          status: nextStatus,
        })
        .eq("id", selectedJob.id);
    } catch (err) {
      console.warn("Supabase assign error fallback:", err);
    }

    const updatedJob = {
      ...selectedJob,
      assigned_candidates: nextAssigned,
      status: nextStatus,
    };

    setSelectedJob(updatedJob);
    setEditStatus(nextStatus);

    const updatedJobs = jobs.map((j) => (j.id === selectedJob.id ? updatedJob : j));
    setJobs(updatedJobs);
    localStorage.setItem("sa_client_posted_jobs", JSON.stringify(updatedJobs));
  };

  const handleDeleteJob = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this client job posting?")) return;

    try {
      await supabase.from("client_job_posts").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete notice:", err);
    }

    const updated = jobs.filter((j) => j.id !== id);
    setJobs(updated);
    localStorage.setItem("sa_client_posted_jobs", JSON.stringify(updated));

    if (selectedJob?.id === id) {
      setIsDetailOpen(false);
      setSelectedJob(null);
    }

    toast.success("Job posting deleted.");
  };

  const getStatusBadge = (status: ClientJobPost["status"]) => {
    switch (status) {
      case "New":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30">🔥 New Post</Badge>;
      case "Reviewing":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">⏳ In Review</Badge>;
      case "Matched":
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30">✨ Candidates Matched</Badge>;
      case "In Interview":
        return <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/30">🎙️ Interviewing</Badge>;
      case "Fulfilled":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">✅ Fulfilled</Badge>;
      case "Closed":
        return <Badge variant="secondary" className="text-muted-foreground">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2.5 text-foreground">
            <Building2 className="w-7 h-7 text-sky-500" />
            Client Portal Job Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review and match candidates for job vacancies submitted by business clients via the Client Portal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchJobsAndCandidates(true)}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass border border-border/60">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Client Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="glass border border-blue-500/30 bg-blue-500/5">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              New Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold text-blue-600">{stats.newCount}</div>
          </CardContent>
        </Card>

        <Card className="glass border border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Reviewing / Sourcing
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold text-amber-600">{stats.reviewing}</div>
          </CardContent>
        </Card>

        <Card className="glass border border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Matched & Fulfilled
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold text-emerald-600">{stats.matched}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search by role title, company name, client email, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="New">🔥 New Only</SelectItem>
              <SelectItem value="Reviewing">⏳ In Review</SelectItem>
              <SelectItem value="Matched">✨ Matched</SelectItem>
              <SelectItem value="In Interview">🎙️ Interviewing</SelectItem>
              <SelectItem value="Fulfilled">✅ Fulfilled</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <Card className="glass border border-border/70 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground mt-2">Loading client job postings...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground">No Client Job Postings Found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
              {searchTerm || statusFilter !== "all"
                ? "Try clearing filters to view all client job postings."
                : "When clients post jobs on the Client Portal, their requirements will appear here in real-time."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[180px]">Company & Contact</TableHead>
                  <TableHead className="w-[220px]">Job Vacancy</TableHead>
                  <TableHead>Workplace & Location</TableHead>
                  <TableHead>Compensation</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Assigned Talent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow
                    key={job.id}
                    onClick={() => handleOpenDetail(job)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    {/* Company & Contact */}
                    <TableCell>
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{job.company_name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">
                        {job.contact_name && `${job.contact_name} • `}
                        {job.contact_email}
                      </div>
                      {job.contact_phone && (
                        <div className="text-[11px] text-muted-foreground/80">{job.contact_phone}</div>
                      )}
                    </TableCell>

                    {/* Job Title & Dept */}
                    <TableCell>
                      <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{job.title}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{job.department || "General"}</div>
                      {/* Skills preview */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.skills?.slice(0, 3).map((s: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                            {s}
                          </Badge>
                        ))}
                        {job.skills?.length > 3 && (
                          <span className="text-[10px] text-muted-foreground self-center">
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Location & Workplace */}
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1 text-foreground font-medium">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{job.location || "Remote"}</span>
                      </div>
                      <div className="text-muted-foreground mt-0.5">
                        {job.workplace_type} • {job.job_type}
                      </div>
                    </TableCell>

                    {/* Salary */}
                    <TableCell className="text-xs font-semibold text-foreground">
                      <div className="flex items-center gap-1 text-emerald-600 font-bold">
                        <DollarSign className="w-3.5 h-3.5 shrink-0" />
                        <span>{job.salary_range || "Competitive"}</span>
                      </div>
                      <div className="text-muted-foreground text-[11px] mt-0.5 font-normal">
                        {job.experience_level}
                      </div>
                    </TableCell>

                    {/* Urgency */}
                    <TableCell>
                      <Badge variant="outline" className="text-[11px] font-medium border-border/80">
                        {job.urgency || "Standard"}
                      </Badge>
                    </TableCell>

                    {/* Assigned Talent */}
                    <TableCell>
                      {job.assigned_candidates && job.assigned_candidates.length > 0 ? (
                        <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30 text-xs flex items-center gap-1 w-fit">
                          <UserCheck className="w-3 h-3" />
                          {job.assigned_candidates.length} Candidate(s)
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">None yet</span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>{getStatusBadge(job.status)}</TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:bg-primary/10"
                          onClick={() => handleOpenDetail(job)}
                          title="View Details & Match Candidates"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleDeleteJob(job.id, e)}
                          title="Delete Posting"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* DETAIL & CANDIDATE MATCHING MODAL */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  {selectedJob?.title}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm mt-1">
                  Submitted by <strong>{selectedJob?.company_name}</strong> on{" "}
                  {selectedJob?.created_at ? new Date(selectedJob.created_at).toLocaleDateString() : "Recent"}
                </DialogDescription>
              </div>
              <div>{selectedJob && getStatusBadge(selectedJob.status)}</div>
            </div>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-6 pt-2">
              {/* Client Contact Details Box */}
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Client & Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Company Name</span>
                    <span className="font-semibold text-foreground">{selectedJob.company_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Contact Person</span>
                    <span className="font-semibold text-foreground">
                      {selectedJob.contact_name || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Contact Email</span>
                    <a
                      href={`mailto:${selectedJob.contact_email}?subject=Candidate Matches for ${selectedJob.title} - SA Consultant`}
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{selectedJob.contact_email}</span>
                    </a>
                  </div>
                </div>

                {selectedJob.contact_phone && (
                  <div className="pt-1 border-t border-border/40 flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">Phone / WhatsApp:</span>
                    <a
                      href={`tel:${selectedJob.contact_phone}`}
                      className="text-foreground font-semibold flex items-center gap-1 hover:text-primary"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {selectedJob.contact_phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Requirement Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-muted/20 p-3 rounded-lg border border-border/40">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Workplace</span>
                  <span className="font-bold text-foreground">{selectedJob.workplace_type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Job Type</span>
                  <span className="font-bold text-foreground">{selectedJob.job_type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Experience</span>
                  <span className="font-bold text-foreground">{selectedJob.experience_level}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Budget Range</span>
                  <span className="font-bold text-emerald-600">{selectedJob.salary_range}</span>
                </div>
              </div>

              {/* Skills */}
              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Required Competencies / Skills:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="px-2.5 py-1 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Description */}
              {selectedJob.description && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Job Description & Scope:
                  </h4>
                  <div className="bg-muted/30 p-3.5 rounded-lg border border-border/40 text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                    {selectedJob.description}
                  </div>
                </div>
              )}

              {/* CANDIDATE ASSIGNMENT / MATCHING SECTION */}
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    Assign Talent to this Requirement ({selectedJob.assigned_candidates?.length || 0} Assigned)
                  </h4>
                  <Input
                    placeholder="Search candidate pool..."
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    className="max-w-[200px] h-8 text-xs bg-background"
                  />
                </div>

                {availableCandidates.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    No candidates registered in database yet. Add candidates in Candidates tab to match them here.
                  </p>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {availableCandidates
                      .filter((c) => {
                        const q = candidateSearch.toLowerCase();
                        return (
                          !q ||
                          (c.name && c.name.toLowerCase().includes(q)) ||
                          (c.job_title && c.job_title.toLowerCase().includes(q)) ||
                          (c.location && c.location.toLowerCase().includes(q))
                        );
                      })
                      .map((cand) => {
                        const isAssigned = (selectedJob.assigned_candidates || []).some(
                          (c: any) => c.id === cand.id
                        );
                        return (
                          <div
                            key={cand.id}
                            className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs transition-all ${
                              isAssigned
                                ? "bg-purple-500/10 border-purple-500/40"
                                : "bg-background border-border/50 hover:border-primary/40"
                            }`}
                          >
                            <div>
                              <span className="font-bold text-foreground block">{cand.name}</span>
                              <span className="text-muted-foreground text-[11px]">
                                {cand.job_title || "Specialist"} • {cand.experience_years || "Experienced"} • {cand.location || "Remote"}
                              </span>
                            </div>

                            <Button
                              size="sm"
                              variant={isAssigned ? "default" : "outline"}
                              onClick={() => handleToggleAssignCandidate(cand)}
                              className={`h-7 px-3 text-xs font-semibold shrink-0 ${
                                isAssigned ? "bg-purple-600 hover:bg-purple-700 text-white" : ""
                              }`}
                            >
                              {isAssigned ? (
                                <>
                                  <Check className="w-3.5 h-3.5 mr-1" /> Assigned
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-3.5 h-3.5 mr-1" /> Assign
                                </>
                              )}
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Status & Admin Notes Update Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Change Job Status</Label>
                  <Select value={editStatus} onValueChange={(val: any) => setEditStatus(val)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">🔥 New</SelectItem>
                      <SelectItem value="Reviewing">⏳ Sourcing / In Review</SelectItem>
                      <SelectItem value="Matched">✨ Candidates Matched</SelectItem>
                      <SelectItem value="In Interview">🎙️ In Interview</SelectItem>
                      <SelectItem value="Fulfilled">✅ Fulfilled / Placed</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Admin Internal Notes</Label>
                  <Input
                    placeholder="e.g. Sent 3 profiles to client on Monday..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/40">
            {selectedJob && (
              <a
                href={`mailto:${selectedJob.contact_email}?subject=Candidate Matches for ${selectedJob.title} - SA Consultant&body=Dear ${selectedJob.contact_name || 'Hiring Lead'},\n\nWe have reviewed your requirement for "${selectedJob.title}" and shortlisted candidate profiles for your team.\n\nBest regards,\nSA Consultant & Staffing Team`}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Client Update
                </Button>
              </a>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={handleSaveDetails}
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 font-bold"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
