import { Link } from "react-router";

import { usePageContext } from "./context/page-context";

export function ContentTermsPage() {
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
              Terms of Service
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using NARA (the "Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use
                this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                2. Description of Service
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                NARA is a modern, type-safe React application boilerplate built
                with Vite, React Router v7, and TailwindCSS. The service
                provides developers with a starting point for building web
                applications with best practices and modern tooling.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. User Responsibilities
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Users of this service agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Use the service for lawful purposes only</li>
                <li>
                  Not attempt to gain unauthorized access to any part of the
                  service
                </li>
                <li>
                  Not use the service to transmit harmful or malicious content
                </li>
                <li>Respect the intellectual property rights of others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                4. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of NARA
                and its licensors. The service is protected by copyright,
                trademark, and other laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of the Service, to
                understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall NARA, nor its directors, employees, partners,
                agents, suppliers, or affiliates, be liable for any indirect,
                incidental, special, consequential, or punitive damages,
                including without limitation, loss of profits, data, use,
                goodwill, or other intangible losses, resulting from your use of
                the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                7. Changes to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will try to provide at least 30 days notice prior to any new
                terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                8. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us through our official repository or support channels.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
