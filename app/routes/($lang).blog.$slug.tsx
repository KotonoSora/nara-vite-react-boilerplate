import { Link } from "react-router";

import type { Route } from "./+types/($lang).blog";

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

export async function clientLoader({}: Route.ClientLoaderArgs) {
  return {};
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return (
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
  );
}

export default function Page({}: Route.ComponentProps) {
  return <></>;
}
