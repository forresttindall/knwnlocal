"use client";

import * as React from "react";
import emailjs from "@emailjs/browser";

import { HighlightedText } from "@/components/ui/HighlightedText";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "success" | "error";

const TOTAL_STEPS = 7;

type FormState = {
  step1_qualified: string;
  step2_role: string;
  step3_bottleneck: string;
  step4_firstName: string;
  step4_lastName: string;
  step4_phone: string;
  step4_email: string;
  step5_youtube: string;
  step6_gci: string;
  step7_timeline: string;
};

const initialForm: FormState = {
  step1_qualified: "",
  step2_role: "",
  step3_bottleneck: "",
  step4_firstName: "",
  step4_lastName: "",
  step4_phone: "",
  step4_email: "",
  step5_youtube: "",
  step6_gci: "",
  step7_timeline: "",
};

const step1_options = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const step2_options = [
  { value: "solo", label: "Solo agent" },
  { value: "team_agent", label: "Agent on a team" },
  { value: "team_lead", label: "Team lead" },
  { value: "broker", label: "Broker" },
  { value: "ops_marketing", label: "Operations/Marketing/Support" },
  { value: "other", label: "Other" },
];

const step3_options = [
  { value: "paid_leads", label: "We're paying too much for leads (Zillow / paid)" },
  { value: "referral_ceiling", label: "We've hit a ceiling on referrals" },
  { value: "content_not_converting", label: "We're doing content but it's not converting" },
  { value: "youtube_no_leads", label: "We have a YouTube channel but it's not generating leads" },
  { value: "no_brand", label: "We don't have a brand outside our sphere" },
  { value: "not_sure", label: "I'm not sure — I want you to diagnose it" },
];

const step6_options = [
  { value: "under_250k", label: "Under $250K" },
  { value: "250k_500k", label: "$250K – $500K" },
  { value: "500k_1m", label: "$500K – $1M" },
  { value: "1m_25m", label: "$1M – $2.5M" },
  { value: "25m_10m", label: "$2.5M - $10M" },
  { value: "10m_plus", label: "$10M+" },
];

const step7_options = [
  { value: "asap", label: "ASAP" },
  { value: "2_4_weeks", label: "Next 2-4 weeks" },
  { value: "later_year", label: "Later this year" },
  { value: "researching", label: "Just researching" },
];

const inputBase =
  "w-full rounded-[10px] border border-ink/15 bg-paper px-[14px] py-[12px] text-[15px] leading-[1.5] text-ink placeholder:text-ink/40 outline-none transition-all duration-200 focus:border-violet focus:ring-4 focus:ring-violet/10";

function getLabelFromValue(options: { value: string; label: string }[], val: string) {
  return options.find((o) => o.value === val)?.label ?? val;
}

export function ContactForm({
  headline,
  subhead,
}: {
  headline: string;
  subhead: string;
}) {
  const emailJsServiceId =
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim() ?? "";
  const emailJsTemplateId =
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?.trim() ?? "";
  const emailJsPublicKey =
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim() ?? "";
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!form.step1_qualified) {
          setStepError("Please select an option to continue.");
          return false;
        }
        return true;
      case 2:
        if (!form.step2_role) {
          setStepError("Please select the option that best describes you.");
          return false;
        }
        return true;
      case 3:
        if (!form.step3_bottleneck) {
          setStepError("Please select your biggest growth bottleneck.");
          return false;
        }
        return true;
      case 4: {
        const missing: string[] = [];
        if (!form.step4_firstName.trim()) missing.push("First name");
        if (!form.step4_lastName.trim()) missing.push("Last name");
        if (!form.step4_phone.trim()) missing.push("Phone number");
        if (!form.step4_email.trim()) {
          missing.push("Email");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.step4_email.trim())) {
          setStepError("Please enter a valid email address.");
          return false;
        }
        if (missing.length > 0) {
          setStepError(`${missing.join(", ")} ${missing.length === 1 ? "is" : "are"} required.`);
          return false;
        }
        return true;
      }
      case 5:
        if (!form.step5_youtube.trim()) {
          setStepError("Please enter your YouTube channel link, or N/A if none.");
          return false;
        }
        return true;
      case 6:
        if (!form.step6_gci) {
          setStepError("Please select your annual GCI range.");
          return false;
        }
        return true;
      case 7:
        if (!form.step7_timeline) {
          setStepError("Please select a timeline.");
          return false;
        }
        return true;
      default:
        return true;
    }
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

      const fullName = `${form.step4_firstName.trim()} ${form.step4_lastName.trim()}`;

      try {
        if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
          throw new Error(
            "Contact form is not configured yet. Add the EmailJS public env vars.",
          );
        }

        await emailjs.send(
          emailJsServiceId,
          emailJsTemplateId,
          {
            submitted_at: new Date().toISOString(),
            source: "knwnlocal-onboarding-flow",
            from_name: fullName,
            from_email: form.step4_email.trim(),
            reply_to: form.step4_email.trim(),
            subject: `KnwnLocal lead: ${fullName}`,
            message: [
              "=== Onboarding Qualification Flow ===",
              "",
              "Step 1 — Doing 12+ deals/year?",
              getLabelFromValue(step1_options, form.step1_qualified),
              "",
              "Step 2 — Role:",
              getLabelFromValue(step2_options, form.step2_role),
              "",
              "Step 3 — Biggest growth bottleneck:",
              getLabelFromValue(step3_options, form.step3_bottleneck),
              "",
              "Step 4 — Contact info:",
              `First name: ${form.step4_firstName.trim()}`,
              `Last name: ${form.step4_lastName.trim()}`,
              `Phone: ${form.step4_phone.trim()}`,
              `Email: ${form.step4_email.trim()}`,
              "",
              "Step 5 — YouTube channel:",
              form.step5_youtube.trim(),
              "",
              "Step 6 — Annual GCI:",
              getLabelFromValue(step6_options, form.step6_gci),
              "",
              "Step 7 — Timeline to start:",
              getLabelFromValue(step7_options, form.step7_timeline),
            ].join("\n"),
            qual_12plus_deals: getLabelFromValue(step1_options, form.step1_qualified),
            role: getLabelFromValue(step2_options, form.step2_role),
            bottleneck: getLabelFromValue(step3_options, form.step3_bottleneck),
            first_name: form.step4_firstName.trim(),
            last_name: form.step4_lastName.trim(),
            phone: form.step4_phone.trim(),
            email: form.step4_email.trim(),
            youtube: form.step5_youtube.trim(),
            gci: getLabelFromValue(step6_options, form.step6_gci),
            timeline: getLabelFromValue(step7_options, form.step7_timeline),
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
      calendlyUrl,
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
                  800M
                </div>
                <div className="text-[12px] leading-[1.35] text-ink/60">
                  Video views per year
                </div>
              </div>
              <div className="flex flex-col gap-[4px]">
                <div className="text-[28px] font-bold leading-none tracking-[-0.02em] text-ink md:text-[32px]">
                  $14M
                </div>
                <div className="text-[12px] leading-[1.35] text-ink/60">
                  GCI per year created
                </div>
              </div>
              <div className="flex flex-col gap-[4px]">
                <div className="text-[28px] font-bold leading-none tracking-[-0.02em] text-ink md:text-[32px]">
                  6X
                </div>
                <div className="text-[12px] leading-[1.35] text-ink/60">
                  Average ROI per client
                </div>
              </div>
            </div>
          </div>

          <div
            className={[
              "relative rounded-[20px] border border-ink/10 bg-violet-soft p-[24px] md:p-[32px]",
              status === "success"
                ? "overflow-hidden md:p-[20px]"
                : "",
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
                  {currentStep === 1 && (
                    <StepChoice
                      title="Are you a real estate agent, team lead, or broker doing 12+ deals a year?"
                      letterPrefix
                      options={step1_options}
                      value={form.step1_qualified}
                      onChange={(v) => setSingle("step1_qualified", v)}
                      disabled={status === "sending"}
                    />
                  )}

                  {currentStep === 2 && (
                    <StepChoice
                      title="Which one best describes you?"
                      letterPrefix
                      options={step2_options}
                      value={form.step2_role}
                      onChange={(v) => setSingle("step2_role", v)}
                      disabled={status === "sending"}
                    />
                  )}

                  {currentStep === 3 && (
                    <StepChoice
                      title="Which of these best describes your biggest growth bottleneck right now?"
                      letterPrefix
                      options={step3_options}
                      value={form.step3_bottleneck}
                      onChange={(v) => setSingle("step3_bottleneck", v)}
                      disabled={status === "sending"}
                    />
                  )}

                  {currentStep === 4 && (
                    <StepContact
                      firstName={form.step4_firstName}
                      lastName={form.step4_lastName}
                      phone={form.step4_phone}
                      email={form.step4_email}
                      setFirstName={setField("step4_firstName")}
                      setLastName={setField("step4_lastName")}
                      setPhone={setField("step4_phone")}
                      setEmail={setField("step4_email")}
                      disabled={status === "sending"}
                    />
                  )}

                  {currentStep === 5 && (
                    <StepTextarea
                      title="What's your YouTube channel link?"
                      hint="If none, write N/A"
                      placeholder="https://youtube.com/@yourchannel or N/A"
                      value={form.step5_youtube}
                      onChange={setField("step5_youtube")}
                      disabled={status === "sending"}
                    />
                  )}

                  {currentStep === 6 && (
                    <StepChoice
                      title="What's your annual GCI?"
                      letterPrefix
                      options={step6_options}
                      value={form.step6_gci}
                      onChange={(v) => setSingle("step6_gci", v)}
                      disabled={status === "sending"}
                    />
                  )}

                  {currentStep === 7 && (
                    <StepChoice
                      title="If we determine there's a strong fit, when would you realistically want to start?"
                      letterPrefix
                      options={step7_options}
                      value={form.step7_timeline}
                      onChange={(v) => setSingle("step7_timeline", v)}
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
                      className={currentStep === 1 ? "opacity-0 pointer-events-none" : ""}
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
                          </code>{" "}
                          to your Calendly/Hero/HubSpot/SavvyCal event link (e.g.{" "}
                          <code className="rounded-[4px] bg-white/60 px-[6px] py-[1px] font-mono text-[12px] text-amber-900">
                            https://calendly.com/yourhandle/30min
                          </code>
                          ). Until then, leads will receive the confirmation email only.
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
  options,
  value,
  onChange,
  disabled,
  letterPrefix = false,
}: {
  title: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  letterPrefix?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <h3 className="text-[20px] font-semibold leading-[1.25] tracking-[-0.015em] text-ink md:text-[22px]">
        {title}
        <span className="ml-[4px] text-violet">*</span>
      </h3>
      <div className="flex flex-col gap-[10px]">
        {options.map((opt, idx) => {
          const checked = value === opt.value;
          const letter = String.fromCharCode(65 + idx);
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
                {letterPrefix ? letter : ""}
              </span>
              <span className="flex-1 leading-[1.4]">{opt.label}</span>
              <input
                type="radio"
                name={`step-choice-${title}`}
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
      <h3 className="text-[20px] font-semibold leading-[1.25] tracking-[-0.015em] text-ink md:text-[22px]">
        Enter your info below
        <span className="ml-[4px] text-violet">*</span>
      </h3>
      <div className="grid gap-[14px] md:grid-cols-2">
        <Field label="First name" htmlFor="ob-firstname" required>
          <input
            id="ob-firstname"
            type="text"
            autoComplete="given-name"
            placeholder="Jane"
            className={inputBase}
            value={firstName}
            onChange={setFirstName}
            disabled={disabled}
          />
        </Field>
        <Field label="Last name" htmlFor="ob-lastname" required>
          <input
            id="ob-lastname"
            type="text"
            autoComplete="family-name"
            placeholder="Smith"
            className={inputBase}
            value={lastName}
            onChange={setLastName}
            disabled={disabled}
          />
        </Field>
        <Field label="Phone number" htmlFor="ob-phone" required>
          <input
            id="ob-phone"
            type="tel"
            autoComplete="tel"
            placeholder="(201) 555-0123"
            className={inputBase}
            value={phone}
            onChange={setPhone}
            disabled={disabled}
          />
        </Field>
        <Field label="Email" htmlFor="ob-email" required>
          <input
            id="ob-email"
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

function StepTextarea({
  title,
  hint,
  placeholder,
  value,
  onChange,
  disabled,
}: {
  title: string;
  hint?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <h3 className="text-[20px] font-semibold leading-[1.25] tracking-[-0.015em] text-ink md:text-[22px]">
        {title}
        <span className="ml-[4px] text-violet">*</span>
      </h3>
      {hint ? (
        <p className="text-[13px] leading-[1.45] text-ink/60">{hint}</p>
      ) : null}
      <textarea
        rows={4}
        className={`${inputBase} resize-none`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
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
