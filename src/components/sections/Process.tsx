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

          <div className="flex items-start justify-between md:items-center md:justify-between">
            {steps.map((step, index) => (
              <div key={step.field} className="flex min-w-0 flex-1 items-start justify-center md:w-auto md:flex-none md:items-center">
                <div data-editable="true" data-field={`${step.field}-title`}>
                  <ProcessStep
                    title={step.title}
                    stepNumber={index + 1}
                    className="md:h-[112px] md:w-[112px] md:text-[15px] 2xl:h-[128px] 2xl:w-[128px] 2xl:text-[16px]"
                  />
                </div>
                {index < steps.length - 1 ? (
                  <div className="mt-[14px] flex shrink-0 items-center sm:mt-[16px] md:mt-0">
                    <div className="mx-[3px] h-0 w-[4px] border-t-2 border-dashed border-violet sm:w-[6px] md:mx-s3 md:w-[32px] 2xl:mx-s6 2xl:w-[48px]" />
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-violet"
                    >
                      <path
                        d="M1 1.5L4.5 4L1 6.5"
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
