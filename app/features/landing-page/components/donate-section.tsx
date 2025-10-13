import { Link } from "react-router";

import { Button } from "~/components/ui/button";

export function DonateSection() {
  return (
    <div className="border-t bg-background py-12 text-center content-visibility-auto">
      <Button variant="link" asChild>
        <Link
          className="gumroad-button"
          to="https://kotonosora.gumroad.com/coffee"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy Me a Coffee
        </Link>
      </Button>
    </div>
  );
}
