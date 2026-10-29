export function AuthFooter() {
  const year = new Date().getFullYear();

  return (
    <p className="text-center text-xs text-muted-foreground">
      &copy; {year} DotSkills. All rights reserved.
      <span className="mx-1.5 text-border">&middot;</span>
      Need help?{" "}
      <a
        href="mailto:support@dotskills.com"
        className="rounded font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        Contact support
      </a>
    </p>
  );
}
