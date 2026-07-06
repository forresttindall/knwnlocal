import { HighlightedText } from "@/components/ui/HighlightedText";
import { ProcessStep } from "@/components/ui/ProcessStep";

export function Process({
  headline,
  steps,
}: {
  headline: string;
  steps: Array<{ title: string; field: string }>;
}) {
  return (
    <section id="process" className="bg-ink text-paper">
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px]">
        <div className="flex flex-col gap-[56px]">
          <h2
            className="text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]"
            data-editable="true"
            data-field="process-headline"
          >
            <HighlightedText text={headline} variant="block" />
          </h2>

          <div className="flex flex-col gap-s7 md:flex-row md:items-center md:justify-between">
            {steps.map((step, index) => (
              <div key={step.field} className="flex shrink-0 items-center">
                <div data-editable="true" data-field={`${step.field}-title`}>
                  <ProcessStep
                    title={step.title}
                    className="md:h-[112px] md:w-[112px] md:text-[15px] 2xl:h-[128px] 2xl:w-[128px] 2xl:text-[16px]"
                  />
                </div>
                {index < steps.length - 1 ? (
                  <div className="hidden shrink-0 items-center md:flex">
                    <div className="mx-s3 h-0 w-[32px] border-t-2 border-dashed border-violet 2xl:mx-s6 2xl:w-[48px]" />
                    <svg
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-violet"
                    >
                      <path
                        d="M9 1L13 5L9 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
