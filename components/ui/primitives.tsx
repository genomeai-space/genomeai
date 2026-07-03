import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/utils/cn";

// ── Scroll reveal ────────────────────────────────────────────
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={cn("reveal", shown && "in-view", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ── Button ───────────────────────────────────────────────────
type Variant = "primary" | "secondary" | "ghost" | "dark" | "outline";
type Size = "sm" | "md" | "lg";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  const variants: Record<Variant, string> = {
    primary:
      "bg-moss text-paper hover:bg-forest-700 shadow-md shadow-moss/25 hover:shadow-lg hover:shadow-moss/30",
    dark: "bg-forest text-paper hover:bg-forest-700 shadow-md shadow-forest/20",
    secondary:
      "bg-paper text-forest border border-sand hover:border-moss hover:bg-fog",
    outline: "bg-transparent text-forest border border-moss/40 hover:bg-fog",
    ghost: "bg-transparent text-stone hover:text-forest hover:bg-fog",
  };
  const sizes: Record<Size, string> = {
    sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
    md: "h-10 px-4 text-sm gap-2 rounded-xl",
    lg: "h-12 px-6 text-[15px] gap-2 rounded-xl",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Card ─────────────────────────────────────────────────────
export function Card({
  children,
  className,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-sand bg-paper",
        hover && "card-hover hover:shadow-xl hover:shadow-forest/10 hover:border-moss/40",
        className
      )}
    >
      {children}
    </div>
  );
}

// ── Pill / Badge ─────────────────────────────────────────────
export function Pill({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "green" | "honey" | "dark" | "outline";
}) {
  const tones = {
    neutral: "bg-fog text-forest border border-mint",
    green: "bg-mint text-forest-700 border border-spring/60",
    honey: "bg-honey/15 text-[#8a6315] border border-honey/40",
    dark: "bg-forest text-mint border border-forest-700",
    outline: "bg-transparent text-stone border border-sand",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

// ── Segmented control ────────────────────────────────────────
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-sand bg-cream p-1",
        className
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-lg font-medium transition-all duration-200",
            size === "sm" ? "px-2.5 py-1 text-[12px]" : "px-3 py-1.5 text-sm",
            value === o.value
              ? "bg-paper text-forest shadow-sm border border-sand"
              : "text-stone hover:text-forest"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Stat ─────────────────────────────────────────────────────
export function Stat({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-sand bg-cream/60 px-3 py-2.5", className)}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-mist">
        {label}
      </div>
      <div className="font-display text-lg font-semibold text-forest">{value}</div>
      {sub && <div className="text-[11px] text-stone">{sub}</div>}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────
export function Modal({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-forest/40 backdrop-blur-sm animate-fade-up"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative my-auto w-full max-w-md rounded-2xl border border-sand bg-paper p-6 shadow-2xl shadow-forest/20 animate-fade-up",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

// ── Gene range slider (controlled) ───────────────────────────
export function GeneRange({
  value,
  onChange,
  color,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  color?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      className="gene-range w-full"
      style={
        color
          ? ({
              background: `linear-gradient(to right, ${color} 0%, ${color} ${value}%, var(--color-sand) ${value}%, var(--color-sand) 100%)`,
            } as React.CSSProperties)
          : undefined
      }
    />
  );
}

// ── Toggle ───────────────────────────────────────────────────
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-sm text-stone hover:text-forest"
    >
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors duration-200",
          checked ? "bg-moss" : "bg-sand"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-paper shadow transition-all duration-200",
            checked ? "left-[18px]" : "left-0.5"
          )}
        />
      </span>
      {label}
    </button>
  );
}

// ── Section heading ──────────────────────────────────────────
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-mint bg-fog px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-moss">
      <span className="h-1.5 w-1.5 rounded-full bg-spring animate-pulse-soft" />
      {children}
    </span>
  );
}
