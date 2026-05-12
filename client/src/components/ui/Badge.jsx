import { cn } from "../../utils/cn";

export function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-slate-700",
        className
      )}
      {...props}
    />
  );
}
