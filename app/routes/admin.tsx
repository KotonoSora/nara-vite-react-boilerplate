import type { Route } from "./+types/admin";
import { Form, Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { getUserById } from "~/features/auth/services/user.server";
import { requireUserId } from "~/sessions.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const { db } = context;
  
  const user = await getUserById(db, userId);
  
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  // Check if user is admin
  if (user.role !== "admin") {
    throw new Response("Access denied. Admin role required.", { status: 403 });
  }

  return { user };
}

export function meta(): ReturnType<Route.MetaFunction> {
  return [
    { title: "Admin Panel - NARA" },
    { name: "description", content: "Administrative dashboard" },
  ];
}

export default function Admin({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold">NARA</span>
            </Link>
            <Badge variant="destructive">Admin Panel</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user.name} (Admin)
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Form method="post" action="/action/logout">
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </Form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Administrative tools and system management
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="outline" className="text-green-600">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentication</span>
                    <Badge variant="outline" className="text-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sessions</span>
                    <Badge variant="outline" className="text-green-600">
                      Healthy
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage system users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  View All Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Create New User
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Manage Roles
                </Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Session Management
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Access Logs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Security Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Access Control Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control Demo</CardTitle>
              <CardDescription>
                This admin panel demonstrates role-based authorization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Access Requirements:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Must be authenticated (logged in)</li>
                  <li>Must have "admin" role in the database</li>
                  <li>Enforced at the route loader level</li>
                  <li>Returns 403 Forbidden for non-admin users</li>
                </ul>
              </div>
              
              <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  ✅ Access Granted
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  You have admin privileges and can access this protected area.
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/dashboard">User Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">Return to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}