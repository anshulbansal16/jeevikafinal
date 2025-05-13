import React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomButtonProps extends ButtonProps {
  gradient?: boolean
  boxed?: boolean
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, gradient = false, boxed = false, children, ...props }, ref) => {
    return (
      <Button
        className={cn(
          boxed && "border-2 border-primary/30 rounded-xl font-medium",
          gradient &&
            "relative overflow-hidden border-2 border-primary/50 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(0,118,255,0.2)] hover:shadow-[0_0_20px_rgba(0,118,255,0.4)] transition-all duration-300",
          !gradient && !boxed && "bg-primary hover:bg-primary/90",
          className,
        )}
        ref={ref}
        {...props}
      >
        {gradient ? (
          <>
            <span className="relative z-10 flex items-center">{children}</span>
          </>
        ) : (
          children
        )}
      </Button>
    )
  },
)

CustomButton.displayName = "CustomButton"
