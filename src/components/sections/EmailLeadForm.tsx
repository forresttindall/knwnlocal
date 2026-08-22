"use client";

import * as React from "react";
import emailjs from "@emailjs/browser";

import { HighlightedText } from "@/components/ui/HighlightedText";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "success" | "error";

const TOTAL_STEPS = 10;

type FormState = {
  q1_hasNewsletter: string;
  q2_listLast612: string;
  q3_dbSize: string;
  q4_lastEmailed: string;
  q5_dealReferral: string;
  q6_stoppedRevenue: string;
  q7_describes: string;
  q8_gci: string;
  q9_timeline: string;
  q10_firstName: string;
  q10_lastName: string;
  q10_phone: string;
  q10_email: string;
};

const initialForm: FormState = {
  q1_hasNewsletter: "",
  q2_listLast612: "",
  q3_dbSize: "",
  q4_lastEmailed: "",
  q5_dealReferral: "",
  q6_stoppedRevenue: "",
  q7_describes: "",
  q8_gci: "",
  q9_timeline: "",
  q10_firstName: "",
  q10_lastName: "",
  q10_phone: "",
  q10_email: "",
};

type Opt = { value: string; label: string };

const q1_options: Opt[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const q2_options: Opt[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const q3_options: Opt[] = [
  { value: "0_100", label: "0–100" },
  { value: "100_500", label: "100–500" },
  { value: "500_1000", label: "500–1,000" },
  { value: "1k_10k", label: "1,000–10,000" },
  { value: "10k_plus", label: "10,000+" },
  { value: "other", label: "Other" },
];

const q4_options: Opt[] = [
  { value: "week_month", label: "This week / this month" },
  { value: "1_3_months", label: "1–3 months ago" },
  { value: "6p_months", label: "6+ months ago" },
  { value: "never", label: "Honestly can't remember / never" },
];

const q5_options: Opt[] = [
  { value: "regularly", label: "Yes, regularly" },
  { value: "once_twice", label: "Once or twice" },
  { value: "not_that_i_know", label: "Not that I know of" },
  { value: "never_emailed", label: "Never emailed" },
];

const q6_options: Opt[] = [
  { value: "what_to_write", label: "I don't know what to write / it feels salesy" },
  { value: "too_busy", label: "I'm too busy to email consistently" },
  { value: "nobody_responds", label: "I've tried and nobody responds" },
  { value: "list_is_mess", label: "My list is a mess / spread across CRM, phone, spreadsheets" },
  { value: "phone_text_only", label: "I've got their phone/text but not their emails" },
  { value: "never_do", label: "I keep meaning to but never actually do it" },
  { value: "not_sure", label: "Not sure — that's what I want you to figure out" },
];

const q7_options: Opt[] = [
  { value: "agent", label: "Agent" },
  { value: "team_lead", label: "Team lead" },
  { value: "broker", label: "Broker" },
  { value: "other", label: "Other" },
];

const q8_options: Opt[] = [
  { value: "0_250k", label: "$0–$250K/YR" },
  { value: "250k_500k", label: "$250–$500K/YR" },
  { value: "500k_1m", label: "$500K–$1M/YR" },
  { value: "1m_5m", label: "$1–$5M/YR" },
  { value: "5m_plus", label: "$5M/YR+" },
];

const q9_options: Opt[] = [
  { value: "asap", label: "ASAP" },
  { value: "2_4_weeks", label: "Next 2–4 weeks" },
  { value: "later_year", label: "Later this year" },
  { value: "researching", label: "Just researching" },
];

const inputBase =
  "w-full rounded-[10px] border border-ink/15 bg-paper px-[14px] py-[12px] text-[15px] leading-[1.5] text-ink placeholder:text-ink/40 outline-none transition-all duration-200 focus:border-violet focus:ring-4 focus:ring-violet/10";

const requiredHints: Record<number, string> = {
  3: "Guessing is okay",
  7: "Guessing is okay",
};

function lab(opts: Opt[], val: string) {
  return opts.find((o) => o.value === val)?.label ?? val;
}

export function EmailLeadForm({
  headline,
  subhead,
}: {
  headline: string;
  subhead: string;
}) {
  const emailJsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim() ?? "";
  const emailJsTemplateId =
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_EMAIL_LEADS_ID?.trim() ??
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?.trim() ??
    "";
  const emailJsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim() ?? "";

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() ?? "";
  const calendlyEmbedUrl = React.useMemo(() => {
    if (!calendlyUrl) return "";
    try {
      const u = new URL(calendlyUrl);
      u.searchParams.set("hide_gdpr_banner", "1");
      u.searchParams.set("primary_color", "8d71d6");
      return u.toString();
    } catch {
      return calendlyUrl;
    }
  }, [calendlyUrl]);

  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [form, setForm] = React.useState<FormState>(initialForm);
  const [stepError, setStepError] = React.useState<string | null>(null);

  const setSingle = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStepError(null);
  };

  const setField =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSingle(key, e.target.value as FormState[typeof key]);

  const optionsFor = (step: number): Opt[] => {
    switch (step) {
      case 1:
        return q1_options;
      case 2:
        return q2_options;
      case 3:
        return q3_options;
      case 4:
        return q4_options;
      case 5:
        return q5_options;
      case 6:
        return q6_options;
      case 7:
        return q7_options;
      case 8:
        return q8_options;
      case 9:
        return q9_options;
      default:
        return [];
    }
  };

  const titleFor = (step: number): string => {
    switch (step) {
      case 1:
        return "Do you have an email newsletter currently?";
      case 2:
        return "Do you have an email list you've been sending to for the last 6-12 months?";
      case 3:
        return "(roughly) How big is your email database size?";
      case 4:
        return "When did you last email your list?";
      case 5:
        return "Have you ever gotten a deal or referral from email?";
      case 6:
        return "What's stopped you from getting real revenue from your database?";
      case 7:
        return "Which one best describes you?";
      case 8:
        return "What's your average annual GCI?";
      case 9:
        return "If we're a fit, when would you want to start?";
      default:
        return "";
    }
  };

  const stateKeyFor = (step: number): keyof FormState | null => {
    switch (step) {
      case 1:
        return "q1_hasNewsletter";
      case 2:
        return "q2_listLast612";
      case 3:
        return "q3_dbSize";
      case 4:
        return "q4_lastEmailed";
      case 5:
        return "q5_dealReferral";
      case 6:
        return "q6_stoppedRevenue";
      case 7:
        return "q7_describes";
      case 8:
        return "q8_gci";
      case 9:
        return "q9_timeline";
      default:
        return null;
    }
  };

  const validateStep = (step: number): boolean => {
    if (step < 10) {
      const k = stateKeyFor(step);
      if (k && !form[k]) {
        setStepError("Please select an option to continue.");
        return false;
      }
      return true;
    }
    // Step 10: contact info
    const missing: string[] = [];
    if (!form.q10_firstName.trim()) missing.push("First name");
    if (!form.q10_lastName.trim()) missing.push("Last name");
    if (!form.q10_phone.trim()) missing.push("Phone number");
    if (!form.q10_email.trim()) {
      missing.push("Email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.q10_email.trim())) {
      setStepError("Please enter a valid email address.");
      return false;
    }
    if (missing.length > 0) {
      setStepError(
        `${missing.join(", ")} ${missing.length === 1 ? "is" : "are"} required.`,
      );
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const back = () => {
    setStepError(null);
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const onSubmit = React.useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();
      if (!validateStep(currentStep)) return;
      if (status === "sending" || status === "success") return;

      setStatus("sending");
      setError(null);
      setStepError(null);

      const fullName = `${form.q10_firstName.trim()} ${form.q10_lastName.trim()}`;

      try {
        if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
          throw new Error(
            "Email lead form not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_EMAIL_LEADS_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY.",
          );
        }

        await emailjs.send(
          emailJsServiceId,
          emailJsTemplateId,
          {
            submitted_at: new Date().toISOString(),
            source: "knwnlocal-email-platform-lead",
            from_name: fullName,
            from_email: form.q10_email.trim(),
            reply_to: form.q10_email.trim(),
            phone: form.q10_phone.trim(),
            subject: `Email lead: ${fullName}`,

            q1_title: titleFor(1),
            q1_answer: lab(q1_options, form.q1_hasNewsletter),
            q2_title: titleFor(2),
            q2_answer: lab(q2_options, form.q2_listLast612),
            q3_title: titleFor(3),
            q3_answer: lab(q3_options, form.q3_dbSize),
            q4_title: titleFor(4),
            q4_answer: lab(q4_options, form.q4_lastEmailed),
            q5_title: titleFor(5),
            q5_answer: lab(q5_options, form.q5_dealReferral),
            q6_title: titleFor(6),
            q6_answer: lab(q6_options, form.q6_stoppedRevenue),
            q7_title: titleFor(7),
            q7_answer: lab(q7_options, form.q7_describes),
            q8_title: titleFor(8),
            q8_answer: lab(q8_options, form.q8_gci),
            q9_title: titleFor(9),
            q9_answer: lab(q9_options, form.q9_timeline),

            first_name: form.q10_firstName.trim(),
            last_name: form.q10_lastName.trim(),
            email: form.q10_email.trim(),
            contact_phone: form.q10_phone.trim(),

            message: [
              "=== Email Platform Lead Intake ===",
              "",
              "Q1. Do you have an email newsletter currently?",
              lab(q1_options, form.q1_hasNewsletter),
              "",
              "Q2. Do you have an email list you've been sending to for the last 6-12 months?",
              lab(q2_options, form.q2_listLast612),
              "",
              "Q3. (roughly) How big is your email database size?",
              lab(q3_options, form.q3_dbSize),
              "",
              "Q4. When did you last email your list?",
              lab(q4_options, form.q4_lastEmailed),
              "",
              "Q5. Have you ever gotten a deal or referral from email?",
              lab(q5_options, form.q5_dealReferral),
              "",
              "Q6. What's stopped you from getting real revenue from your database?",
              lab(q6_options, form.q6_stoppedRevenue),
              "",
              "Q7. Which one best describes you?",
              lab(q7_options, form.q7_describes),
              "",
              "Q8. What's your average annual GCI?",
              lab(q8_options, form.q8_gci),
              "",
              "Q9. If we're a fit, when would you want to start?",
              lab(q9_options, form.q9_timeline),
              "",
              "Q10. Contact info:",
              `First: ${form.q10_firstName.trim()}`,
              `Last: ${form.q10_lastName.trim()}`,
              `Phone: ${form.q10_phone.trim()}`,
              `Email: ${form.q10_email.trim()}`,
            ].join("\n"),
          },
          { publicKey: emailJsPublicKey },
        );

        setStatus("success");
        setForm(initialForm);
        setCurrentStep(1);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Request failed.");
        setStatus("error");
      }
    },
    [
      currentStep,
      emailJsPublicKey,
      emailJsServiceId,
      emailJsTemplateId,
      form,
      status,
    ],
  );

  const progressPct = (currentStep / TOTAL_STEPS) * 100;

  return (
    <section id="contact" className="bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px] md:py-[88px]">
        <div className="grid gap-[48px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-[64px] lg:gap-[88px]">
          <div className="flex flex-col gap-[20px] md:gap-[24px]">
            <h2
              className="text-[40px] font-bold leading-[1.05] tracking-[-0.02em] md:text-[56px] lg:text-[64px]"
              data-editable="true"
              data-field="contact-headline"
            >
              <HighlightedText text={headline} variant="pill" />
            </h2>
            <p
              className="max-w-[42ch] text-[17px] leading-[1.5] text-ink/70 md:text-[18px]"
              data-editable="true"
              data-field="contact-subhead"
            >
              {subhead}
            </p>
            <div className="mt-[12px] grid grid-cols-3 gap-[20px] md:gap-[24px]">
              <div className="flex flex-col gap-[4px]">
                <div className="text-[28px] font-bold leading-none tracking-[-0.02em] text-ink md:text-[32px]">
                  40.8%
                </div>
                <div className="text-[12px] leading-[1.35] text-ink/60">
                  Email lead quality
                </div>
              </div>
              <div className="flex flex-col gap-[4px]">
                <div className="text-[28px] font-bold leading-none tracking-[-0.02em] text-ink md:text-[32px]">
                  3.5×
                </div>
                <div className="text-[12px] leading-[1.35] text-ink/60">
                  Avg. email vs. social ROI
                </div>
              </div>
              <div className="flex flex-col gap-[4px]">
                <div className="text-[28px] font-bold leading-none tracking-[-0.02em] text-ink md:text-[32px]">
                  52 wk
                </div>
                <div className="text-[12px] leading-[1.35] text-ink/60">
                  Weekly issue cadence
                </div>
              </div>
            </div>
          </div>

          <div
            className={[
              "relative rounded-[20px] border border-ink/10 bg-violet-soft p-[24px] md:p-[32px]",
              status === "success" ? "overflow-hidden md:p-[20px]" : "",
            ].join(" ")}
          >
            {status !== "success" ? (
              <>
                <div className="mb-[28px] flex flex-col gap-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-ink/60">
                      Step {currentStep} of {TOTAL_STEPS}
                    </span>
                    <span className="text-[12px] font-semibold tracking-[-0.01em] text-violet">
                      {Math.round(progressPct)}%
                    </span>
                  </div>
                  <div className="h-[6px] w-full overflow-hidden rounded-full bg-ink/10">
                    <div
                      className="h-full rounded-full bg-violet transition-all duration-300 ease-out"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-[24px]">
                  {currentStep < 10 ? (
                    <StepChoice
                      title={titleFor(currentStep)}
                      hint={requiredHints[currentStep]}
                      letterPrefix
                      options={optionsFor(currentStep)}
                      value={form[stateKeyFor(currentStep)!] as string}
                      onChange={(v) =>
                        setSingle(stateKeyFor(currentStep)!, v as any)
                      }
                      disabled={status === "sending"}
                      required
                    />
                  ) : (
                    <StepContact
                      title="Enter your info below"
                      titleHint="press Cmd ⌘ + Enter ↵"
                      firstName={form.q10_firstName}
                      lastName={form.q10_lastName}
                      phone={form.q10_phone}
                      email={form.q10_email}
                      setFirstName={setField("q10_firstName")}
                      setLastName={setField("q10_lastName")}
                      setPhone={setField("q10_phone")}
                      setEmail={setField("q10_email")}
                      disabled={status === "sending"}
                    />
                  )}

                  {stepError ? (
                    <div className="rounded-[10px] border border-red-500/30 bg-red-500/10 px-[14px] py-[10px] text-[13px] font-medium text-red-700">
                      {stepError}
                    </div>
                  ) : null}

                  <div className="flex flex-col items-start justify-between gap-[16px] sm:flex-row sm:items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={back}
                      disabled={currentStep === 1 || status === "sending"}
                      className={
                        currentStep === 1
                          ? "opacity-0 pointer-events-none"
                          : ""
                      }
                    >
                      Back
                    </Button>

                    {currentStep < TOTAL_STEPS ? (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={next}
                        disabled={status === "sending"}
                      >
                        {status === "sending" ? "Sending…" : "Continue"}
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={status === "sending"}
                        className={status === "sending" ? "opacity-80" : ""}
                      >
                        {status === "sending" ? "Sending…" : "Submit"}
                      </Button>
                    )}
                  </div>

                  {status === "error" && error ? (
                    <div className="text-[13px] leading-[1.4] text-ink/80">
                      {error}
                    </div>
                  ) : null}
                </form>
              </>
            ) : (
              <div className="flex flex-col items-start gap-[20px] py-[8px] md:py-[12px]">
                <div className="flex w-full items-center gap-[16px] rounded-[16px] border border-violet/20 bg-paper/60 px-[18px] py-[16px] backdrop-blur-sm">
                  <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-violet text-paper">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    <h3 className="text-[22px] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[26px]">
                      Submission received. Pick a time below.
                    </h3>
                    <p className="max-w-[48ch] text-[13px] leading-[1.5] text-ink/65 md:text-[14px]">
                      Quick intro call on Zoom.
                    </p>
                  </div>
                </div>

                {calendlyEmbedUrl ? (
                  <div className="w-full overflow-hidden rounded-[16px] border border-ink/10 bg-paper shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <div className="relative w-full overflow-hidden">
                      <iframe
                        src={calendlyEmbedUrl}
                        title="Schedule a call"
                        className="block h-[720px] w-full border-0 bg-white md:h-[820px]"
                        style={{ minHeight: "680px" }}
                        frameBorder="0"
                        loading="eager"
                        scrolling="yes"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen; microphone; camera"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full flex-col gap-[14px] rounded-[14px] border border-amber-500/30 bg-amber-500/[0.08] px-[18px] py-[16px]">
                    <div className="flex items-start gap-[10px]">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-[2px] shrink-0 text-amber-700"
                      >
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <div className="flex flex-col gap-[4px]">
                        <div className="text-[14px] font-semibold text-amber-900">
                          Scheduler not configured yet.
                        </div>
                        <div className="text-[13px] leading-[1.5] text-amber-800/85">
                          Set{" "}
                          <code className="rounded-[4px] bg-white/60 px-[6px] py-[1px] font-mono text-[12px] text-amber-900">
                            NEXT_PUBLIC_CALENDLY_URL
                          </code>{" "}
                          in{" "}
                          <code className="rounded-[4px] bg-white/60 px-[6px] py-[1px] font-mono text-[12px] text-amber-900">
                            .env.local
                          </code>
                          . Leads receive the EmailJS confirmation email.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepChoice({
  title,
  hint,
  options,
  value,
  onChange,
  disabled,
  letterPrefix = false,
  required = true,
}: {
  title: string;
  hint?: string;
  options: Opt[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  letterPrefix?: boolean;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[4px]">
        <h3 className="text-[20px] font-semibold leading-[1.25] tracking-[-0.015em] text-ink md:text-[22px]">
          {title}
          {required ? <span className="ml-[4px] text-violet">*</span> : null}
        </h3>
        {hint ? (
          <p className="text-[13px] leading-[1.45] text-ink/60">{hint}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-[10px]">
        {options.map((opt, idx) => {
          const checked = value === opt.value;
          const letter =
            options.length > 2 ? String.fromCharCode(65 + idx) : "";
          const useLetter = letterPrefix && letter;
          const fallbackPrefix =
            !useLetter && options.length === 2 ? (idx === 0 ? "Y" : "N") : "";
          const showPrefix = !!useLetter || !!fallbackPrefix;
          const prefix = useLetter || fallbackPrefix;
          return (
            <label
              key={opt.value}
              className={[
                "group relative flex cursor-pointer items-center gap-[14px] rounded-[14px] border px-[16px] py-[14px] text-[15px] font-medium transition-all duration-200",
                checked
                  ? "border-violet bg-violet/15 text-ink shadow-[0_0_0_3px_rgba(141,113,214,0.12)]"
                  : "border-ink/12 bg-paper text-ink/85 hover:border-violet/50 hover:bg-violet/[0.06]",
                disabled ? "cursor-not-allowed opacity-60" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full border text-[12px] font-bold transition-all duration-200",
                  checked
                    ? "border-violet bg-violet text-paper"
                    : "border-ink/15 bg-paper text-ink/60 group-hover:border-violet/50",
                ].join(" ")}
              >
                {showPrefix ? prefix : ""}
              </span>
              <span className="flex-1 leading-[1.4]">{opt.label}</span>
              <input
                type="radio"
                name={`email-q-${title}`}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                disabled={disabled}
                className="sr-only"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

function StepContact({
  title,
  titleHint,
  firstName,
  lastName,
  phone,
  email,
  setFirstName,
  setLastName,
  setPhone,
  setEmail,
  disabled,
}: {
  title: string;
  titleHint?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  setFirstName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setLastName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPhone: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[4px]">
        <h3 className="text-[20px] font-semibold leading-[1.25] tracking-[-0.015em] text-ink md:text-[22px]">
          {title}
          <span className="ml-[4px] text-violet">*</span>
        </h3>
        {titleHint ? (
          <p className="text-[13px] leading-[1.45] text-ink/60">{titleHint}</p>
        ) : null}
      </div>
      <div className="grid gap-[14px] md:grid-cols-2">
        <Field label="First name" htmlFor="em-firstname" required>
          <input
            id="em-firstname"
            type="text"
            autoComplete="given-name"
            placeholder="Jane"
            className={inputBase}
            value={firstName}
            onChange={setFirstName}
            disabled={disabled}
          />
        </Field>
        <Field label="Last name" htmlFor="em-lastname" required>
          <input
            id="em-lastname"
            type="text"
            autoComplete="family-name"
            placeholder="Smith"
            className={inputBase}
            value={lastName}
            onChange={setLastName}
            disabled={disabled}
          />
        </Field>
        <Field label="Phone number" htmlFor="em-phone" required>
          <input
            id="em-phone"
            type="tel"
            autoComplete="tel"
            placeholder="(201) 555-0123"
            className={inputBase}
            value={phone}
            onChange={setPhone}
            disabled={disabled}
          />
        </Field>
        <Field label="Email" htmlFor="em-email" required>
          <input
            id="em-email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            className={inputBase}
            value={email}
            onChange={setEmail}
            disabled={disabled}
          />
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
  required = false,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-[6px]">
      <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/60">
        {label}
        {required ? <span className="ml-[2px] text-violet">*</span> : null}
      </span>
      {children}
    </label>
  );
}
