"use client";

import { Plus } from "lucide-react";

interface FABProps {
  onClick: () => void;
  label?: string;
  ariaLabel?: string;
  className?: string;
}

export default function FAB({
  onClick,
  label,
  ariaLabel = "Add",
  className,
}: FABProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`fixed right-5 z-20 flex items-center justify-center gap-2 rounded-full bg-brand-mid text-white active:scale-95 transition-transform duration-[120ms] ${className ?? "bottom-24"}`}
      style={{
        width: label ? "auto" : "56px",
        height: "56px",
        padding: label ? "0 20px" : undefined,
        boxShadow: "0 6px 24px rgba(61,122,86,0.42)",
      }}
    >
      <Plus size={26} strokeWidth={2.5} />
      {label && <span className="text-base font-semibold pr-1">{label}</span>}
    </button>
  );
}
