import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  Send,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface ResumeServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string;
}

export const ResumeServiceModal: React.FC<ResumeServiceModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
}) => {
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [targetPosition, setTargetPosition] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetForm = () => {
    setCandidateName("");
    setCandidateEmail("");
    setCandidatePhone("");
    setTargetPosition("");
    setResumeFile(null);
    setJobDescriptionFile(null);
    setJobDescriptionText("");
    setIsSubmitting(false);
    setIsSubmitted(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidateName.trim() || !candidateEmail.trim() || !candidatePhone.trim() || !targetPosition.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!resumeFile) {
      toast.error("Please upload your current resume.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Convert resume file to base64 / metadata for record
      let resumeFileName = resumeFile.name;
      let resumeFileUrl = "";

      // Try uploading to Supabase storage bucket 'resumes' if available
      try {
        const fileExt = resumeFile.name.split('.').pop();
        const filePath = `career_services/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('resumes')
          .upload(filePath, resumeFile);
        
        if (!uploadErr && uploadData) {
          const { data: pubUrlData } = supabase.storage.from('resumes').getPublicUrl(filePath);
          resumeFileUrl = pubUrlData?.publicUrl || filePath;
        }
      } catch (stgErr) {
        console.warn("Storage upload fallback to metadata:", stgErr);
      }

      // 2. Insert into career_service_requests table
      const { error: dbErr } = await supabase.from("career_service_requests").insert([
        {
          service_plan: selectedPlan,
          candidate_name: candidateName.trim(),
          candidate_email: candidateEmail.trim(),
          candidate_phone: candidatePhone.trim(),
          target_position: targetPosition.trim(),
          resume_file_name: resumeFileName,
          resume_file_url: resumeFileUrl || `Uploaded: ${resumeFileName}`,
          job_description_file_name: jobDescriptionFile ? jobDescriptionFile.name : null,
          job_description_text: jobDescriptionText.trim() || null,
          status: "pending_review",
        },
      ]);

      if (dbErr) {
        // Fallback to inquiries table if career_service_requests doesn't exist yet
        await supabase.from("inquiries").insert([
          {
            name: candidateName.trim(),
            email: candidateEmail.trim(),
            phone: candidatePhone.trim(),
            message: `[Career Service Request - ${selectedPlan}] Target Position: ${targetPosition.trim()} | Resume: ${resumeFileName}`,
            subject: `Career Service Request: ${selectedPlan}`,
          },
        ]);
      }

      toast.success("Resume Service request submitted successfully!");
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err.message || "An error occurred while submitting your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8 rounded-3xl glass-strong border border-primary/20 shadow-2xl z-[10001]">
        {!isSubmitted ? (
          <>
            <DialogHeader className="text-left space-y-2 pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Badge className="gradient-bg text-white font-extrabold text-xs uppercase tracking-wide px-3 py-1 rounded-full">
                  {selectedPlan || "Resume Service"}
                </Badge>
                <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Professional Service
                </Badge>
              </div>
              <DialogTitle className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                Submit Your Resume Request
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Provide your contact information and target job details. Our resume experts will review your submission and send your final price quote and payment link.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 pt-4">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="candidateName" className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="candidateName"
                    placeholder="e.g. Sarah Jenkins"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    required
                    className="h-11 rounded-xl text-sm bg-background/80"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="candidateEmail" className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="candidateEmail"
                    type="email"
                    placeholder="e.g. sarah@example.com"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    required
                    className="h-11 rounded-xl text-sm bg-background/80"
                  />
                </div>
              </div>

              {/* Phone & Target Position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="candidatePhone" className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="candidatePhone"
                    type="tel"
                    placeholder="e.g. +1 (555) 000-1234"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    required
                    className="h-11 rounded-xl text-sm bg-background/80"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetPosition" className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Target Job / Position <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="targetPosition"
                    placeholder="e.g. Senior Software Engineer / Product Manager"
                    value={targetPosition}
                    onChange={(e) => setTargetPosition(e.target.value)}
                    required
                    className="h-11 rounded-xl text-sm bg-background/80"
                  />
                </div>
              </div>

              {/* Upload Current Resume */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Upload Current Resume <span className="text-red-500">*</span>
                </Label>
                <div className="border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors rounded-2xl p-4 bg-muted/20 text-center cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files?.[0] && setResumeFile(e.target.files[0])}
                    required={!resumeFile}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Upload className="w-8 h-8 text-primary" />
                    {resumeFile ? (
                      <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4" /> {resumeFile.name}
                      </p>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-foreground">
                          Click or drag file to upload current resume
                        </p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX formats accepted</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Job Description (Optional) */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Upload Job Description <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <div className="border border-input rounded-2xl p-3 bg-background/80 space-y-3">
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-semibold relative"
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => e.target.files?.[0] && setJobDescriptionFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <FileText className="w-3.5 h-3.5 mr-1 text-primary" />
                      {jobDescriptionFile ? jobDescriptionFile.name : "Attach File"}
                    </Button>
                    <span className="text-xs text-muted-foreground">or paste target job requirements below</span>
                  </div>

                  <Textarea
                    placeholder="Paste target job requirements, responsibilities, or skills here..."
                    value={jobDescriptionText}
                    onChange={(e) => setJobDescriptionText(e.target.value)}
                    rows={2}
                    className="text-xs rounded-xl bg-background border-none resize-none focus-visible:ring-1"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="rounded-xl font-bold text-xs h-11 px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gradient-bg text-white font-extrabold text-xs h-11 px-8 rounded-xl shadow-md flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          /* Step-by-Step Workflow Status Screen after submission */
          <div className="py-6 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full gradient-bg text-white flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-extrabold px-3 py-1 rounded-full text-xs uppercase tracking-wide mb-2">
                Request Received
              </Badge>
              <h3 className="text-2xl font-extrabold text-foreground">
                Thank You, {candidateName}!
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Your <strong>{selectedPlan}</strong> request has been successfully submitted to our executive resume team.
              </p>
            </div>

            {/* Workflow Progress Visualizer */}
            <div className="bg-card border border-primary/20 rounded-2xl p-5 text-left space-y-4 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> What Happens Next:
              </h4>

              <div className="space-y-3.5 text-xs">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-extrabold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Request Received & Under Review</p>
                    <p className="text-muted-foreground text-[11px]">
                      Our team is reviewing your current resume and target position ({targetPosition}).
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Final Price Decision & Payment Link</p>
                    <p className="text-muted-foreground text-[11px]">
                      We will decide your final price and send your secure payment link directly to <strong>{candidateEmail}</strong>.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Resume Creation</p>
                    <p className="text-muted-foreground text-[11px]">
                      Upon payment, our executive writers build your tailored, ATS-optimized resume.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Final Delivery (PDF & Word/DOCX)</p>
                    <p className="text-muted-foreground text-[11px]">
                      Your completed resume will be delivered to your email in both <strong>PDF</strong> and <strong>Word (DOCX)</strong> formats.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="gradient-bg text-white font-extrabold text-xs h-11 px-8 rounded-xl shadow-md w-full sm:w-auto"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
