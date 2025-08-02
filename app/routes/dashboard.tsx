import { Link } from "react-router";

import type { Route } from "./+types/dashboard";

import { requireUserId } from "~/auth.server";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getUserById } from "~/features/auth/services/user.server";
import { FooterSection } from "~/features/landing-page/components/footer-section";
import { HeaderNavigationSection } from "~/features/landing-page/components/header-navigation-section";

export async function loader({ request, context }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const { db } = context;

  const user = await getUserById(db, userId);

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return { user };
}

export function meta(): ReturnType<Route.MetaFunction> {
  return [
    { title: "Dashboard - NARA" },
    { name: "description", content: "Your personal dashboard" },
  ];
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <main
      className="min-h-screen bg-background"
      style={{ contentVisibility: "auto" }}
    >
      {/* Header */}
      <HeaderNavigationSection />

      {/* Main content */}
      <section className="max-w-4xl mx-4 space-y-8 my-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your personal dashboard
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-medium">Name:</span>
                <p className="text-sm text-muted-foreground">{user.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Email:</span>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Role:</span>
                <p className="text-sm text-muted-foreground capitalize">
                  {user.role}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Member since:</span>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/profile">Edit Profile</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/settings">Settings</Link>
              </Button>
              {user.role === "admin" && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/admin">Admin Panel</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Your account activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold">24</div>
                <p className="text-sm text-muted-foreground">Days active</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Content */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Demo</CardTitle>
            <CardDescription>
              This dashboard demonstrates the authentication system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              You are successfully authenticated and can see this protected
              content. This demonstrates:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Protected route access (must be logged in)</li>
              <li>User information from the database</li>
              <li>Role-based content (admin panel link for admins)</li>
              <li>Session management with logout functionality</li>
            </ul>

            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link to="/">Return to Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/showcase">View Showcases</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer Section */}
      <FooterSection />
    </main>
  );
}
