import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function AuthShell({
  children,
  title,
  sub,
}: {
  children: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="workspace-shell relative flex min-h-full items-center justify-center px-4 py-10">
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark href="/" variant="workspace" />
          <h1 className="mt-6 text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted">{sub}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
