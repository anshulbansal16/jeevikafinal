import React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EnhancedButtonProps extends ButtonProps {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon" | "xl"
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const variantStyles = {
      default: "bg-primary text-white hover:bg-primary/90",
      primary:
        "bg-gradient-to-r from-primary to-blue-600 text-white border-2 border-blue-300 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] transition-all duration-300 hover:-translate-y-1 font-bold",
      secondary:
        "bg-gradient-to-r from-blue-100 to-blue-200 text-primary border-2 border-blue-300 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 hover:-translate-y-1 font-bold",
      outline:
        "border-2 border-blue-300 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 hover:-translate-y-1 font-bold bg-transparent",
      ghost: "hover:bg-blue-100 hover:text-primary transition-all duration-300",
    }

    const sizeStyles = {
      default: "py-2 px-4",
      sm: "py-1 px-3 text-sm",
      lg: "py-3 px-6 text-lg",
      xl: "py-4 px-8 text-xl",
      icon: "p-2",
    }

    return (
      <Button className={cn(variantStyles[variant], sizeStyles[size], className)} ref={ref} {...props}>
        {children}
      </Button>
    )
  },
)

EnhancedButton.displayName = "EnhancedButton"
