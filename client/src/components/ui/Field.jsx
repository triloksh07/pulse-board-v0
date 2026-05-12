import { cn } from "../../utils/cn";

export function Field({ label, error, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {error ? <span className="block text-sm text-coral">{error}</span> : null}
    </label>
  );
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "focus-ring h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-ink placeholder:text-slate-400",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "focus-ring min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }) {
  return (
    <select
      className={cn("focus-ring h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-ink", className)}
      {...props}
    />
  );
}
