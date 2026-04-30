import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", loading, fullWidth, children, disabled, ...props }, ref) => {
        const variants = {
            primary: "bg-black text-white hover:bg-gray-800 active:bg-gray-900",
            secondary: "bg-gray-100 text-black hover:bg-gray-200 active:bg-gray-300",
            outline: "border-2 border-black text-black hover:bg-black hover:text-white",
            ghost: "text-gray-700 hover:bg-gray-100",
            danger: "bg-red-500 text-white hover:bg-red-600",
        };
        const sizes = {
            sm: "px-3 py-1.5 text-sm rounded-lg",
            md: "px-5 py-2.5 text-sm rounded-xl",
            lg: "px-7 py-3.5 text-base rounded-xl",
        };
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
                    variants[variant],
                    sizes[size],
                    fullWidth && "w-full",
                    className
                )}
                {...props}
            >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
