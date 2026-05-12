import { cn } from "../../utils/cn";

export function Toast({ message, tone = "info" }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-5 right-5 z-50 rounded-lg px-4 py-3 text-sm font-semibold shadow-soft",
        tone === "error" ? "bg-coral text-white" : "bg-ink text-white"
      )}
    >
      {message}
    </div>
  );
}
