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
  FileText,
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
  Download,
  AlertCircle,
  Copy,
} from "lucide-react";

export type CareerServiceRequest = {
  id: string;
  created_at: string;
  service_plan: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  target_position: string;
  resume_file_name: string | null;
  resume_file_url: string | null;
  job_description_file_name?: string | null;
  job_description_text?: string | null;
  status: "pending_review" | "price_sent" | "paid" | "in_progress" | "completed";
  final_price: string | null;
  admin_notes: string | null;
};

export const AdminCareerServices: React.FC = () => {
  const [requests, setRequests] = useState<CareerServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<CareerServiceRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Edit fields inside modal
  const [editPrice, setEditPrice] = useState("");
  const [editStatus, setEditStatus] = useState<CareerServiceRequest["status"]>("pending_review");
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchRequests = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      // 1. Fetch from career_service_requests
      const { data, error } = await supabase
        .from("career_service_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch error, fallback to inquiries check:", error.message);
      }

      let fetchedRequests: CareerServiceRequest[] = data || [];

      // 2. Fallback: Parse career service requests from inquiries table if any
      const { data: inqData } = await supabase
        .from("inquiries")
        .select("*")
        .ilike("subject", "%Career Service%")
        .order("created_at", { ascending: false });

      if (inqData && inqData.length > 0) {
        const parsedFromInquiries: CareerServiceRequest[] = inqData.map((inq: any) => {
          const matchPlan = inq.subject?.replace("Career Service Request:", "").trim() || "Resume Service";
          return {
            id: inq.id,
            created_at: inq.created_at,
            service_plan: matchPlan,
            candidate_name: inq.name || "Candidate",
            candidate_email: inq.email || "",
            candidate_phone: inq.phone || "",
            target_position: inq.message?.split("Target Position:")[1]?.split("|")[0]?.trim() || "Target Position",
            resume_file_name: inq.message?.split("Resume:")[1]?.trim() || "Resume File",
            resume_file_url: null,
            status: "pending_review",
            final_price: null,
            admin_notes: inq.message || null,
          };
        });

        // Combine unique by id
        const existingIds = new Set(fetchedRequests.map((r) => r.id));
        parsedFromInquiries.forEach((p) => {
          if (!existingIds.has(p.id)) fetchedRequests.push(p);
        });
      }

      setRequests(fetchedRequests);
    } catch (err: any) {
      console.error("Error fetching career service requests:", err);
      toast.error(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openManageModal = (req: CareerServiceRequest) => {
    setSelectedRequest(req);
    setEditPrice(req.final_price || "");
    setEditStatus(req.status || "pending_review");
    setEditNotes(req.admin_notes || "");
    setIsDetailOpen(true);
  };

  const handleSaveModal = async () => {
    if (!selectedRequest) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("career_service_requests")
        .update({
          status: editStatus,
          final_price: editPrice.trim() || null,
          admin_notes: editNotes.trim() || null,
        })
        .eq("id", selectedRequest.id);

      if (error) throw error;

      toast.success("Request updated successfully!");
      setRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRequest.id
            ? { ...r, status: editStatus, final_price: editPrice.trim() || null, admin_notes: editNotes.trim() || null }
            : r
        )
      );
      setIsDetailOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update request");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Career Service request?")) return;

    try {
      const { error } = await supabase.from("career_service_requests").delete().eq("id", id);
      if (error) {
        await supabase.from("inquiries").delete().eq("id", id);
      }
      toast.success("Request deleted.");
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete request");
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        r.candidate_name.toLowerCase().includes(search) ||
        r.candidate_email.toLowerCase().includes(search) ||
        r.candidate_phone.toLowerCase().includes(search) ||
        r.target_position.toLowerCase().includes(search) ||
        r.service_plan.toLowerCase().includes(search);

      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesPlan =
        planFilter === "all" || r.service_plan.toLowerCase().includes(planFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [requests, searchTerm, statusFilter, planFilter]);

  const getStatusBadge = (status: CareerServiceRequest["status"]) => {
    switch (status) {
      case "pending_review":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/30 font-bold px-2.5 py-0.5 text-[11px]">
            <Clock className="w-3 h-3 mr-1" /> Pending Review
          </Badge>
        );
      case "price_sent":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/30 font-bold px-2.5 py-0.5 text-[11px]">
            <Send className="w-3 h-3 mr-1" /> Quote Sent
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 font-bold px-2.5 py-0.5 text-[11px]">
            <DollarSign className="w-3 h-3 mr-1" /> Paid
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/30 font-bold px-2.5 py-0.5 text-[11px]">
            <Sparkles className="w-3 h-3 mr-1" /> In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-600 text-white font-extrabold px-2.5 py-0.5 text-[11px]">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    if (plan && plan.includes("Job Search")) {
      return (
        <Badge className="bg-blue-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 shadow-sm">
          🔍 {plan} ($79)
        </Badge>
      );
    }
    if (plan && plan.includes("Training")) {
      return (
        <Badge className="bg-amber-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 shadow-sm">
          🎓 {plan} ($149)
        </Badge>
      );
    }
    if (plan && plan.includes("Interview")) {
      return (
        <Badge className="bg-purple-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 shadow-sm">
          🎯 {plan} ($79)
        </Badge>
      );
    }
    if (plan && plan.includes("Coaching")) {
      return (
        <Badge className="bg-teal-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 shadow-sm">
          🚀 {plan} ($99)
        </Badge>
      );
    }
    return (
      <Badge className="gradient-bg text-white font-extrabold text-[11px] px-2.5 py-0.5 shadow-sm">
        ⭐ {plan || "Professional Resume Package"} ($99)
      </Badge>
    );
  };

  const getRawEmailData = (req: CareerServiceRequest) => {
    const subject = `Career Service Quote: ${req.service_plan} - SA Consultant & Staffing`;
    const body = `Hi ${req.candidate_name},

Thank you for reaching out to SA Consultant & Staffing regarding our ${req.service_plan} service!

We have received your resume submission and target position details:
• Selected Service: ${req.service_plan}
• Target Position: ${req.target_position}
• Contact Phone (ph-no): ${req.candidate_phone}

Our executive team has reviewed your request and is ready to work on your resume. Below are the details for your custom quote:

Service Quote: [Insert Custom Quote / Payment Link Here]

If you have any questions or additional requirements, please reply directly to this email. We look forward to helping you elevate your career!

Best regards,
Career Services Team
SA Consultant & Staffing`;

    return { subject, body };
  };

  const handleSendEmailApp = (req: CareerServiceRequest) => {
    const { subject, body } = getRawEmailData(req);
    const mailtoUrl = `mailto:${req.candidate_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleOpenGmailWeb = (req: CareerServiceRequest) => {
    const { subject, body } = getRawEmailData(req);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(req.candidate_email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  const handleCopyEmailText = (req: CareerServiceRequest) => {
    const { body } = getRawEmailData(req);
    navigator.clipboard.writeText(body);
    toast.success("Quote email message copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Requests
            </CardTitle>
            <FileText className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">{requests.length}</div>
          </CardContent>
        </Card>

        <Card className="glass border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Pending Review
            </CardTitle>
            <Clock className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600">
              {requests.filter((r) => r.status === "pending_review").length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              Quotes & Active
            </CardTitle>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-purple-600">
              {requests.filter((r) => r.status === "price_sent" || r.status === "in_progress" || r.status === "paid").length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Completed
            </CardTitle>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600">
              {requests.filter((r) => r.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Request List Card */}
      <Card className="glass border-primary/20">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl font-extrabold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Career Services Requests
            </CardTitle>
            <CardDescription className="text-xs">
              Manage client submissions for Basic, Professional, and Executive Resume services.
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchRequests(true)}
            disabled={refreshing}
            className="rounded-xl h-9 text-xs font-bold gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="relative sm:col-span-6 md:col-span-6">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by candidate name, email, phone, position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 rounded-xl text-xs bg-background/80"
              />
            </div>

            <div className="sm:col-span-3 md:col-span-3">
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="h-10 rounded-xl text-xs bg-background/80">
                  <SelectValue placeholder="Filter by Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="Professional">Professional Resume Package</SelectItem>
                  <SelectItem value="Interview">Interview Preparation</SelectItem>
                  <SelectItem value="Coaching">Career Coaching</SelectItem>
                  <SelectItem value="Training">Training Programs</SelectItem>
                  <SelectItem value="Job Search">Job Search Assistance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-3 md:col-span-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 rounded-xl text-xs bg-background/80">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="price_sent">Quote Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" /> Loading requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-muted rounded-2xl p-6">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-bold text-foreground text-sm">No career service requests found.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Submissions from the Career Services page will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Date</TableHead>
                    <TableHead className="text-xs font-bold">Candidate</TableHead>
                    <TableHead className="text-xs font-bold">ph-no</TableHead>
                    <TableHead className="text-xs font-bold">Selected Plan</TableHead>
                    <TableHead className="text-xs font-bold">Target Position</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredRequests.map((req) => (
                    <TableRow key={req.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                        {req.created_at ? new Date(req.created_at).toLocaleDateString() : "N/A"}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-foreground text-xs">{req.candidate_name}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3 text-primary" /> {req.candidate_email}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs font-semibold text-foreground whitespace-nowrap">
                        <span className="flex items-center gap-1.5 font-bold text-foreground">
                          <Phone className="w-3.5 h-3.5 text-primary" /> {req.candidate_phone}
                        </span>
                      </TableCell>

                      <TableCell>{getPlanBadge(req.service_plan)}</TableCell>

                      <TableCell className="text-xs font-semibold text-foreground max-w-[180px] truncate">
                        {req.target_position}
                      </TableCell>

                      <TableCell>{getStatusBadge(req.status)}</TableCell>

                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openManageModal(req)}
                            className="h-8 text-xs font-bold rounded-lg gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-primary" /> Manage
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(req.id)}
                            className="h-8 w-8 p-0 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manage Request Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        {selectedRequest && (
          <DialogContent className="max-w-xl p-6 rounded-3xl glass-strong border border-primary/20 shadow-2xl">
            <DialogHeader className="text-left space-y-2 pb-3 border-b border-border/60">
              <div className="flex items-center justify-between gap-2">
                {getPlanBadge(selectedRequest.service_plan)}
                {getStatusBadge(editStatus)}
              </div>
              <DialogTitle className="text-2xl font-extrabold text-foreground">
                Manage Request: {selectedRequest.candidate_name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submitted on {new Date(selectedRequest.created_at).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              {/* Candidate Info Box */}
              <div className="bg-muted/30 p-3.5 rounded-2xl border border-border space-y-1.5">
                <div className="font-extrabold text-foreground text-sm flex items-center justify-between">
                  <span>{selectedRequest.candidate_name}</span>
                  <span className="text-xs text-primary font-bold">{selectedRequest.target_position}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-muted-foreground">
                  <div>📧 {selectedRequest.candidate_email}</div>
                  <div className="font-medium text-foreground/90">📞 ph-no: {selectedRequest.candidate_phone}</div>
                </div>
                {selectedRequest.resume_file_name && (
                  <div className="pt-1.5 flex items-center gap-2">
                    <span className="font-bold text-foreground">Resume File:</span>
                    {selectedRequest.resume_file_url && selectedRequest.resume_file_url.startsWith("http") ? (
                      <a
                        href={selectedRequest.resume_file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download {selectedRequest.resume_file_name}
                      </a>
                    ) : (
                      <span className="font-mono bg-background px-2 py-0.5 rounded border border-border">
                        📄 {selectedRequest.resume_file_name}
                      </span>
                    )}
                  </div>
                )}
                {selectedRequest.job_description_text && (
                  <div className="pt-1.5">
                    <span className="font-bold text-foreground">Job Requirements / Notes:</span>
                    <p className="bg-background/80 p-2 rounded-lg border border-border mt-0.5 text-muted-foreground whitespace-pre-line">
                      {selectedRequest.job_description_text}
                    </p>
                  </div>
                )}
              </div>

              {/* Admin Status Control */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Update Request Status
                </Label>
                <Select value={editStatus} onValueChange={(val: any) => setEditStatus(val)}>
                  <SelectTrigger className="h-10 rounded-xl text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="price_sent">Quote Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Admin Notes */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Admin Internal Notes
                </Label>
                <Textarea
                  placeholder="Notes about resume progress or internal details..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={2}
                  className="text-xs rounded-xl bg-background"
                />
              </div>

              {/* Email Workspace Quick Action */}
              <div className="pt-2 bg-primary/5 p-4 rounded-2xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left space-y-0.5">
                  <p className="font-extrabold text-foreground text-xs flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-primary" /> Send Email Quote
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Opens Gmail workspace directly with pre-filled candidate quote message.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => handleOpenGmailWeb(selectedRequest)}
                  size="sm"
                  className="gradient-bg text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-md shrink-0 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" /> Send Email Quote
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                onClick={() => setIsDetailOpen(false)}
                className="rounded-xl font-bold text-xs h-10 px-4"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveModal}
                disabled={isSaving}
                className="gradient-bg text-white font-extrabold text-xs h-10 px-6 rounded-xl shadow-md"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
