export function Greeting({ name }: { name?: string | null }) {
  return (
    <p className="mb-1 text-sm text-muted">
      {name ? `Welcome back, ${name}` : "Welcome back"}
    </p>
  );
}
