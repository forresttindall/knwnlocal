import { HighlightedText } from "@/components/ui/HighlightedText";

export function Problem({
  headline,
  items,
}: {
  headline: string;
  items: Array<{ title: string; body: string; field: string }>;
}) {
  return (
    <section id="problem" className="bg-cream text-ink">
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px]">
        <div className="flex flex-col gap-[56px]">
          <h2
            className="text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]"
            data-editable="true"
            data-field="problem-headline"
          >
            <HighlightedText text={headline} variant="pill" />
          </h2>

          <div className="grid gap-[32px] md:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.field}
                className="rounded-[20px] bg-violet-soft p-s7 shadow-sm"
              >
                <div
                  className="text-[20px] font-semibold tracking-[-0.02em] text-ink"
                  data-editable="true"
                  data-field={`${item.field}-title`}
                >
                  {item.title}
                </div>
                <div
                  className="mt-s4 text-[16px] leading-[1.5] text-ink/80"
                  data-editable="true"
                  data-field={`${item.field}-body`}
                >
                  {item.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
