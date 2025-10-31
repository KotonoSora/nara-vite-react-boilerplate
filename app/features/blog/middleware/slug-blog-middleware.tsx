import { MDXProvider } from "@mdx-js/react";

import type { ComponentType } from "react";
import type { MiddlewareFunction } from "react-router";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";

export const mdxComponents = {
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-border" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-muted" {...props} />,
  tbody: (props: any) => (
    <tbody className="divide-y divide-border bg-background" {...props} />
  ),
  tr: (props: any) => <tr className="hover:bg-muted/50" {...props} />,
  th: (props: any) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm" {...props} />
  ),
  h1: (props: any) => (
    <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-2xl font-semibold mt-4 mb-2" {...props} />
  ),
  p: (props: any) => <p className="mb-4 leading-7" {...props} />,
  ul: (props: any) => (
    <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
  ),
  code: (props: any) => {
    const { className, children, ...rest } = props;
    // Inline code
    if (!className) {
      return (
        <code
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
          {...rest}
        >
          {children}
        </code>
      );
    }
    // Code blocks (handled by highlight.js)
    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  },
  pre: (props: any) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
      {...props}
    />
  ),
  a: (props: any) => <a className="text-primary hover:underline" {...props} />,
  img: (props: any) => (
    <img className="rounded-lg my-4 max-w-full h-auto" {...props} />
  ),
};

export const { slugBlogMiddlewareContext } = createMiddlewareContext<any>(
  "slugBlogMiddlewareContext",
);

export const slugBlogMiddleware: MiddlewareFunction = async ({ context }) => {
  const content = (await import("~/features/blog/content/example.mdx")) as {
    default: ComponentType;
    frontmatter: Record<string, unknown>;
  };

  const MDXContent = content.default;
  const frontmatter = content.frontmatter;

  const contextValue: any = {
    content: (
      <div className="prose">
        <div>content load form middleware</div>
        <MDXProvider components={mdxComponents}>
          <MDXContent />
        </MDXProvider>
      </div>
    ),
    frontmatter,
  };

  context.set(slugBlogMiddlewareContext, contextValue);
};
