import React from "react";
import { Check, Sparkles, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlanTier } from "@/config/plans";

interface PricingCardProps {
  plan: PlanTier;
  isYearly: boolean;
  isAdmin?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, isYearly, isAdmin = false }) => {
  const displayPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const isStarter = plan.id === "starter";

  return (
    <div
      className={`relative flex flex-col rounded-xl bg-card p-5 md:p-6 transition-all duration-300 border ${
        isStarter
          ? "border-amber-500/40 shadow-md ring-1 ring-amber-500/20"
          : "border-primary shadow-lg ring-1 ring-primary/20"
      }`}
    >
      {/* Top Badge for Starter */}
      {isStarter && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-amber-500/15 text-amber-600 border border-amber-500/30 font-bold px-2.5 py-0.5 shadow-sm flex items-center gap-1 rounded-full text-[11px]">
            <Clock className="w-3 h-3 animate-pulse" /> Under Development
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-3 mt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
          {isStarter && !isAdmin && (
            <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
              Coming Soon
            </span>
          )}
        </div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary mt-0.5">
          {plan.tagline}
        </p>
        <p className="text-xs text-muted-foreground mt-1.5 min-h-[36px] leading-relaxed">
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div className="my-3 flex items-baseline gap-1">
        <span className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          ${displayPrice}
        </span>
        <span className="text-muted-foreground text-xs font-medium">/month</span>
        {isYearly && plan.monthlyPrice > 0 && (
          <span className="ml-1.5 text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
            Billed annually (${displayPrice * 12}/yr)
          </span>
        )}
      </div>

      {/* CTA Button */}
      <div className="my-3">
        {isStarter ? (
          isAdmin ? (
            <div className="space-y-1">
              <a
                href={plan.ctaHref}
                style={{ backgroundColor: "#7B4E2F", color: "#ffffff" }}
                className="w-full h-10 px-4 rounded-lg flex items-center justify-center gap-2 font-extrabold text-xs shadow-md hover:opacity-90 transition-all"
              >
                <span style={{ color: "#ffffff" }} className="font-extrabold text-xs">
                  {plan.ctaText} (Admin Test)
                </span>
                <ArrowRight className="w-4 h-4 text-white" style={{ color: "#ffffff" }} />
              </a>
              <span className="text-[10px] text-amber-600 font-semibold block text-center">
                (Under development on user view)
              </span>
            </div>
          ) : (
            <div className="w-full h-10 px-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 flex items-center justify-center gap-2 font-extrabold text-xs cursor-not-allowed">
              <Clock className="w-3.5 h-3.5" />
              <span>Under Development — Coming Soon</span>
            </div>
          )
        ) : (
          <a
            href={plan.ctaHref}
            style={{ backgroundColor: "#7B4E2F", color: "#ffffff" }}
            className="w-full h-10 px-4 rounded-lg flex items-center justify-center gap-2 font-extrabold text-xs shadow-md hover:opacity-90 transition-all"
          >
            <span style={{ color: "#ffffff" }} className="font-extrabold text-xs">
              {plan.ctaText}
            </span>
            <ArrowRight className="w-4 h-4 text-white" style={{ color: "#ffffff" }} />
          </a>
        )}
      </div>

      <hr className="my-3 border-border" />

      {/* Features List */}
      <div className="flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
          {plan.featuresHeader || "What you get"}
        </p>
        <ul className="space-y-2">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-foreground">
              <span className="flex-shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                <Check className="w-2.5 h-2.5" />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Perfect for footer */}
      <div className="mt-4 pt-3 border-t border-border/60 text-[11px] text-muted-foreground italic flex items-center gap-1">
        <span>👉</span>
        <span>{plan.perfectFor}</span>
      </div>
    </div>
  );
};
