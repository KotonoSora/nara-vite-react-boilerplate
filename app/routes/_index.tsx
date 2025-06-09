import type { Route } from "./+types/_index";

import { ModeSwitcher } from "~/components/mode-switcher";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home Page" },
    { name: "description", content: "Home Page Demo!" },
  ];
}

export default function HomeDemo({}: Route.ComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="absolute top-4 right-4">
        <ModeSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Welcome to Our App</CardTitle>
          <CardDescription>
            Navigate easily to different sections.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid gap-3">
          <div className="text-center text-lg text-muted-foreground">
            Hello, this is a demo page of Nara!
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Your Company. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
