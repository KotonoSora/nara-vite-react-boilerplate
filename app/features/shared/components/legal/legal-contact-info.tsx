import { useTranslation } from "@kotonosora/i18n-react";
import { Link } from "react-router";

interface LegalContactInfoProps {
  githubRepository?: string;
}

export function LegalContactInfo({
  githubRepository = "",
}: LegalContactInfoProps) {
  const t = useTranslation();

  return (
    <div className="mt-12 lg:mt-16 pt-6 lg:pt-8 border-t">
      <div className="text-center text-xs sm:text-sm text-muted-foreground">
        <p>
          {t("legal.common.contactInfo")}{" "}
          <Link
            to={githubRepository}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t("legal.common.officialRepository")}
          </Link>{" "}
          {t("legal.common.supportChannels")}
        </p>
      </div>
    </div>
  );
}
