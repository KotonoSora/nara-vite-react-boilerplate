import { Form, Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FooterSection } from "~/features/landing-page/components/footer-section";
import { HeaderNavigationSection } from "~/features/landing-page/components/header-navigation-section";
import { useTranslation } from "~/lib/i18n";

import { usePageContext } from "./context/page-context";

export function ContentAdminPage() {
  const { user } = usePageContext();
  const t = useTranslation();

  if (!user) return null;

  return (
    <main
      className="min-h-screen bg-background"
      style={{ contentVisibility: "auto" }}
    >
      {/* Header */}
      <HeaderNavigationSection />

      {/* Main content */}
      <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          <div>
            <h1 className="text-3xl font-bold">{t("admin.title")}</h1>
            <p className="text-muted-foreground">{t("admin.subtitle")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.systemStatus.title")}</CardTitle>
                <CardDescription>
                  {t("admin.systemStatus.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {t("admin.systemStatus.database")}
                    </span>
                    <Badge variant="outline" className="text-green-600">
                      {t("admin.systemStatus.status.online")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {t("admin.systemStatus.authentication")}
                    </span>
                    <Badge variant="outline" className="text-green-600">
                      {t("admin.systemStatus.status.active")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {t("admin.systemStatus.sessions")}
                    </span>
                    <Badge variant="outline" className="text-green-600">
                      {t("admin.systemStatus.status.healthy")}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.userManagement.title")}</CardTitle>
                <CardDescription>
                  {t("admin.userManagement.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  {t("admin.userManagement.viewAllUsers")}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  {t("admin.userManagement.createNewUser")}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  {t("admin.userManagement.manageRoles")}
                </Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.security.title")}</CardTitle>
                <CardDescription>
                  {t("admin.security.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  {t("admin.security.sessionManagement")}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  {t("admin.security.accessLogs")}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  {t("admin.security.securitySettings")}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Access Control Demo */}
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.roleBasedAccess.title")}</CardTitle>
              <CardDescription>
                {t("admin.roleBasedAccess.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-2">
                  {t("admin.roleBasedAccess.requirements.title")}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    {t("admin.roleBasedAccess.requirements.authenticated")}
                  </li>
                  <li>{t("admin.roleBasedAccess.requirements.adminRole")}</li>
                  <li>{t("admin.roleBasedAccess.requirements.routeLevel")}</li>
                  <li>{t("admin.roleBasedAccess.requirements.forbidden")}</li>
                </ul>
              </div>

              <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  {t("admin.roleBasedAccess.accessGranted.title")}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {t("admin.roleBasedAccess.accessGranted.message")}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/dashboard">
                    {t("admin.roleBasedAccess.actions.userDashboard")}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">
                    {t("admin.roleBasedAccess.actions.returnHome")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Footer Section */}
      <FooterSection />
    </main>
  );
}
