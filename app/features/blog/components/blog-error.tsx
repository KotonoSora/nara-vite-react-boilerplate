import { Link } from "react-router";

interface BlogErrorProps {
  error?: {
    status?: number;
    statusText?: string;
    message?: string;
  };
}

export function BlogError({ error }: BlogErrorProps) {
  const status = error?.status || 500;
  const isNotFound = status === 404;

  return (
    <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-24">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">{status}</h1>
          <h2 className="text-3xl font-bold">
            {isNotFound ? "Blog Post Not Found" : "Something Went Wrong"}
          </h2>
        </div>

        <p className="text-lg text-muted-foreground">
          {isNotFound
            ? "The blog post you're looking for doesn't exist or has been removed."
            : "An error occurred while loading this blog post. Please try again later."}
        </p>

        {error?.message && !isNotFound && (
          <details className="text-left p-4 bg-muted rounded-lg">
            <summary className="cursor-pointer font-medium">
              Error Details
            </summary>
            <pre className="mt-2 text-sm overflow-x-auto">{error.message}</pre>
          </details>
        )}

        <div className="flex gap-4 justify-center pt-6">
          <Link
            to="/blog"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            View All Posts
          </Link>
          <Link
            to="/"
            className="px-6 py-3 border rounded-lg hover:bg-muted transition-colors font-medium"
          >
            Go Home
          </Link>
        </div>
      </div>
    </section>
  );
}
