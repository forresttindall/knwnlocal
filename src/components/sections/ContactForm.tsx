"use client";

import * as React from "react";
import emailjs from "@emailjs/browser";

import { HighlightedText } from "@/components/ui/HighlightedText";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "success" | "error";

const cadences = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "notsure", label: "Not sure yet" },
];

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-[6px]">
      <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/60">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputBase =
  "w-full rounded-[10px] border border-ink/15 bg-paper px-[14px] py-[12px] text-[15px] leading-[1.5] text-ink placeholder:text-ink/40 outline-none transition-all duration-200 focus:border-violet focus:ring-4 focus:ring-violet/10";

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
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    market: "",
    pricePoint: "",
    goal: "",
    cadence: "weekly",
  });

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status === "sending") return;
      if (!form.name.trim() || !form.email.trim()) {
        setError("Name and email are required.");
        setStatus("error");
        return;
      }

      setStatus("sending");
      setError(null);

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
            source: "knwnlocal-contact-form",
            from_name: form.name.trim(),
            from_email: form.email.trim(),
            reply_to: form.email.trim(),
            market: form.market.trim(),
            price_point: form.pricePoint.trim(),
            goal: form.goal.trim(),
            cadence: form.cadence,
            subject: `KnwnLocal lead: ${form.name.trim()}${
              form.market.trim() ? ` (${form.market.trim()})` : ""
            }`,
            message: [
              `Name: ${form.name.trim()}`,
              `Email: ${form.email.trim()}`,
              `Market / City: ${form.market.trim() || "-"}`,
              `Avg. price point: ${form.pricePoint.trim() || "-"}`,
              `What do you want to be Knwn for?: ${form.goal.trim() || "-"}`,
              `Preferred cadence: ${form.cadence}`,
            ].join("\n"),
          },
          { publicKey: emailJsPublicKey },
        );

        setStatus("success");
        setForm({
          name: "",
          email: "",
          market: "",
          pricePoint: "",
          goal: "",
          cadence: "weekly",
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Request failed.");
        setStatus("error");
      }
    },
    [emailJsPublicKey, emailJsServiceId, emailJsTemplateId, form, status],
  );

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
                  24h
                </div>
                <div className="text-[12px] leading-[1.35] text-ink/60">
                  Average reply time
                </div>
              </div>
              <div className="flex flex-col gap-[4px]">
                <div className="text-[28px] font-bold leading-none tracking-[-0.02em] text-ink md:text-[32px]">
                  10
                </div>
                <div className="text-[12px] leading-[1.35] text-ink/60">
                  Open slots this month
                </div>
              </div>
              <div className="flex flex-col gap-[4px]">
                <div className="text-[28px] font-bold leading-none tracking-[-0.02em] text-ink md:text-[32px]">
                  0
                </div>
                <div className="text-[12px] leading-[1.35] text-ink/60">
                  Cold calls. Ever.
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="relative rounded-[20px] border border-ink/10 bg-violet-soft p-[24px] md:p-[32px]"
          >
            <div className="grid gap-[20px] md:grid-cols-2">
              <Field label="Name" htmlFor="cf-name">
                <input
                  id="cf-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className={inputBase}
                  value={form.name}
                  onChange={set("name")}
                  disabled={status === "sending" || status === "success"}
                />
              </Field>
              <Field label="Email" htmlFor="cf-email">
                <input
                  id="cf-email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@realestate.com"
                  className={inputBase}
                  value={form.email}
                  onChange={set("email")}
                  disabled={status === "sending" || status === "success"}
                />
              </Field>
              <Field label="Market / City" htmlFor="cf-market">
                <input
                  id="cf-market"
                  type="text"
                  placeholder="Austin, TX"
                  className={inputBase}
                  value={form.market}
                  onChange={set("market")}
                  disabled={status === "sending" || status === "success"}
                />
              </Field>
              <Field label="Avg. price point" htmlFor="cf-price">
                <input
                  id="cf-price"
                  type="text"
                  inputMode="text"
                  placeholder="$750k"
                  className={inputBase}
                  value={form.pricePoint}
                  onChange={set("pricePoint")}
                  disabled={status === "sending" || status === "success"}
                />
              </Field>
            </div>

            <div className="mt-[20px]">
              <Field label="What do you want to be Knwn for?" htmlFor="cf-goal">
                <textarea
                  id="cf-goal"
                  rows={4}
                  className={`${inputBase} resize-none`}
                  placeholder="e.g. The luxury waterfront agent in Miami Beach."
                  value={form.goal}
                  onChange={set("goal")}
                  disabled={status === "sending" || status === "success"}
                />
              </Field>
            </div>

            <div className="mt-[20px]">
              <div className="mb-[8px] text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/60">
                Preferred cadence
              </div>
              <div className="flex flex-wrap gap-[10px]">
                {cadences.map((c) => {
                  const checked = form.cadence === c.value;
                  return (
                    <label
                      key={c.value}
                      className={[
                        "inline-flex cursor-pointer items-center gap-[8px] rounded-full border px-[14px] py-[8px] text-[13px] font-medium transition-all duration-200",
                        checked
                          ? "border-violet bg-violet text-paper shadow-sm"
                          : "border-ink/15 bg-paper text-ink/80 hover:border-violet/60 hover:text-violet",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="cf-cadence"
                        value={c.value}
                        checked={checked}
                        onChange={() =>
                          setForm((prev) => ({ ...prev, cadence: c.value }))
                        }
                        disabled={status === "sending" || status === "success"}
                        className="sr-only"
                      />
                      {c.label}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mt-[36px] flex flex-col items-start gap-[20px] sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="primary"
                type="submit"
                disabled={status === "sending" || status === "success"}
                className={status === "sending" ? "opacity-80" : ""}
              >
                {status === "success"
                  ? "Sent — check your inbox"
                  : status === "sending"
                    ? "Sending…"
                    : "Request availability"}
              </Button>

              <div className="min-h-[20px] text-[13px] leading-[1.4] sm:text-right">
                {status === "success" ? (
                  <span className="text-ink/70">
                    We’ll reply within one business day.
                  </span>
                ) : status === "error" && error ? (
                  <span className="text-ink/80">{error}</span>
                ) : (
                  <span className="text-ink/50">
                    No spam. No list. Just a direct reply.
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
