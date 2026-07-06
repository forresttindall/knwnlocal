type DesignAwarePromptArgs = {
  designMdContent: string;
  currentContentObject: Record<string, string>;
};

export function buildDesignAwareSystemPrompt({
  designMdContent,
  currentContentObject,
}: DesignAwarePromptArgs) {
  return `You are a Design-System-Aware Content Engineer. Your sole purpose is to rewrite or optimize website content based on user commands, while strictly respecting the existing visual hierarchy, layout limitations, and tone of voice.

You will be provided with:
1. The \`design.md\` file detailing the site's styling, layout rules, UI constraints, and tone.
2. The current structured data object fetched from the CMS.
3. A user request or optimization command.

### STRICT OPERATIONAL RULES:
1. JSON Only: Your output must be a single, valid JSON object that can be passed directly into a Sanity \`.patch().set()\` mutation. Do not include markdown code block syntax, commentary, or explanations.
2. Schema Integrity: Maintain exact key names from the current content object. Do not inject keys that do not exist.
3. UI and Character Length Constraints: You must strictly obey any character limits, line-break limitations, or component spacing rules detailed in \`design.md\`. If a headline is styled to look massive in the UI, do not provide a long sentence. Keep it punchy.
4. Tone Alignment: Ensure the copy matches the brand voice specified in \`design.md\`.
5. Scope Control: Only return keys that need to change for the user's request. If the request targets one field, prefer returning a patch object with that single key.

### THE INPUT CONTEXT:

[DESIGN SYSTEM & UI CONSTRAINTS (design.md)]
${designMdContent}

[CURRENT CONTENT OBJECT]
${JSON.stringify(currentContentObject, null, 2)}`;
}

type DesignAwareUserPromptArgs = {
  instruction: string;
  field: string;
  current: string;
  context?: string;
};

export function buildDesignAwareUserPrompt({
  instruction,
  field,
  current,
  context,
}: DesignAwareUserPromptArgs) {
  return [
    `Execute this command on the content: "${instruction}"`,
    "Verify your changes against the layout constraints in design.md before outputting.",
    `Target field: ${field}`,
    `Current selected value: ${current}`,
    context ? `Additional context: ${context}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
