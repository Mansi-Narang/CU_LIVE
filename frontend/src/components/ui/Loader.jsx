// components/ui/loader.jsx
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const variants = {
  default: "text-primary",
  secondary: "text-secondary",
  destructive: "text-destructive",
  muted: "text-muted-foreground",
};

const sizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

export function Spinner({
  variant = "default",
  size = "md",
  className,
  ...props
}) {
  return (
    <Loader2
      className={cn(
        "animate-spin",
        variants[variant] || variants.default,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    />
  );
}

export function LoaderOverlay({
  children,
  loading = false,
  variant = "default",
  size = "lg",
  overlayClassName,
  spinnerClassName,
  ...props
}) {
  if (!loading) return children;

  return (
    <div className="relative" {...props}>
      {children && (
        <div className="opacity-50 blur-[1px] pointer-events-none">{children}</div>
      )}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-background/50",
          overlayClassName
        )}
      >
        <Spinner
          variant={variant}
          size={size}
          className={spinnerClassName}
        />
      </div>
    </div>
  );
}

export function FullScreenLoader({
  variant = "default",
  size = "xl",
  message,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm z-50",
        className
      )}
      {...props}
    >
      <Spinner variant={variant} size={size} />
      {message && (
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

export function ButtonLoader({
  children,
  loading = false,
  spinnerClassName,
  ...props
}) {
  return (
    <div className="flex items-center gap-2" {...props}>
      {loading && <Spinner size="sm" className={spinnerClassName} />}
      {children}
    </div>
  );
}