import { useTranslation } from "@kotonosora/i18n-react";
import { Button } from "@kotonosora/ui/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@kotonosora/ui/components/ui/empty";
import { Spinner } from "@kotonosora/ui/components/ui/spinner";
import { Link } from "react-router";

export function SlugHydrateFallback() {
  const t = useTranslation();

  return (
    <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 space-y-8 flex flex-col flex-1 justify-center items-center text-center">
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>{t("blog.loading.title")}</EmptyTitle>
          <EmptyDescription>{t("blog.loading.description")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" asChild size="sm">
            <Link to="/blog">{t("blog.loading.cancel")}</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </section>
  );
}
