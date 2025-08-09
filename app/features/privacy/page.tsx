import { Link } from "react-router";

import { usePageContext } from "./context/page-context";

export function ContentPrivacyPage() {
  const {} = usePageContext();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to Home
            </Link>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold tracking-tight mb-8">
              Privacy Policy
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, such as when
                you create an account, use our services, or contact us for
                support.
              </p>
              <h3 className="text-xl font-semibold mb-2">
                Personal Information
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Email address</li>
                <li>Username</li>
                <li>Profile information you choose to provide</li>
              </ul>
              <h3 className="text-xl font-semibold mb-2">Usage Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Log data (IP address, browser type, operating system)</li>
                <li>Usage patterns and preferences</li>
                <li>Device information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Detect and prevent fraudulent or unauthorized activity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. Information Sharing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except as
                described in this policy:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  With service providers who assist us in operating our service
                </li>
                <li>When required by law or to protect our rights</li>
                <li>
                  In connection with a business transaction (merger,
                  acquisition, etc.)
                </li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                However, no method of transmission over the internet is 100%
                secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information only as long as necessary to
                fulfill the purposes outlined in this privacy policy, unless a
                longer retention period is required or permitted by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your personal information</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                7. Cookies and Tracking
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to collect and
                track information about your use of our service. You can control
                cookies through your browser settings, but disabling cookies may
                affect the functionality of our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service is not intended for children under 13. We do not
                knowingly collect personal information from children under 13.
                If you become aware that a child has provided us with personal
                information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new privacy policy on
                this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please
                contact us through our official repository or support channels.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
