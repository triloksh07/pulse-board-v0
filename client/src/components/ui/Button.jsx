import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-ocean text-white hover:bg-teal-800",
  secondary: "bg-white text-ink border border-slate-200 hover:bg-slate-50",
  danger: "bg-coral text-white hover:bg-red-700",
  ghost: "text-ink hover:bg-slate-100",
};

export function Button({ as: Component = "button", variant = "primary", className, ...props }) {
  return (
    <Component
      className={cn(
        "focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
