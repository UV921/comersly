import Link from "next/link";

export function PageHeader({
  crumbs,
  title,
  description,
  actions,
}: {
  crumbs?: { href?: string; label: string }[];
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      {crumbs && crumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-sm text-muted">
          {crumbs.map((item, index) => (
            <span key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? <span>/</span> : null}
              {item.href ? (
                <Link href={item.href} className="truncate hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className="truncate text-foreground">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 max-w-2xl">
          {title ? (
            <h1 className="text-[28px] tracking-tight text-foreground">{title}</h1>
          ) : null}
          {description ? (
            <p className={`max-w-xl text-sm leading-6 text-muted ${title ? "mt-1.5" : ""}`}>
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
