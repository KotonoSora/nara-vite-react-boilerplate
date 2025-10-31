import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Spinner } from "~/components/ui/spinner";

export function SlugHydrateFallback() {
  return (
    <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 space-y-8 flex flex-col flex-1 justify-center items-center text-center">
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>Processing your request</EmptyTitle>
          <EmptyDescription>
            Please wait while we process your request. Do not refresh the page.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" asChild size="sm">
            <Link to="/blog">Cancel</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </section>
  );
}
