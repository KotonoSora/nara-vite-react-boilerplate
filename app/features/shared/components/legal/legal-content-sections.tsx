import type { LegalSection } from "../../types/legal";

interface LegalContentSectionsProps {
  sections: LegalSection[];
}

export function LegalContentSections({ sections }: LegalContentSectionsProps) {
  return (
    <div className="prose prose-sm sm:prose-base prose-gray dark:prose-invert max-w-none">
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="mb-8 lg:mb-12 scroll-mt-24"
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 lg:mb-4 flex items-center gap-2 lg:gap-3">
            <span className="text-primary">{index + 1}.</span>
            {section.title}
          </h2>

          {section.content && (
            <p className="text-muted-foreground leading-relaxed mb-3 lg:mb-4 text-sm sm:text-base">
              {section.content}
            </p>
          )}

          {section.subsections?.map((subsection) => (
            <div key={subsection.title} className="mb-4 lg:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 lg:mb-3">
                {subsection.title}
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 lg:space-y-2 text-sm sm:text-base">
                {subsection.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          {section.items && (
            <ul className="list-disc list-inside text-muted-foreground space-y-1 lg:space-y-2 text-sm sm:text-base">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
