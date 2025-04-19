import { Link } from "react-router";

import { ModeToggle } from "~/components/mode-toggle";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Welcome to Our App</h1>
          <p className="text-gray-600">
            Navigate easily to different sections.
          </p>
          <div className="space-y-2">
            <Button variant="outline" asChild className="w-full">
              <Link to="/welcome">Welcome</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <p className="text-sm mt-4">© 2025 Your Company. All rights reserved.</p>
    </div>
  );
}
