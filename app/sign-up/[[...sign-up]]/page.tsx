import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <p className="mb-6 text-center text-sm font-semibold tracking-wide text-accent">
          Comersly
        </p>
        <SignUp />
      </div>
    </div>
  );
}
