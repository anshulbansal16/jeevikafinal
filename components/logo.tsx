import Link from "next/link"
import { Heart } from "lucide-react"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: { container: "h-8", icon: "h-4 w-4", text: "text-lg" },
    md: { container: "h-10", icon: "h-5 w-5", text: "text-2xl" },
    lg: { container: "h-12", icon: "h-6 w-6", text: "text-3xl" },
  }

  return (
    <Link href="/" className={`flex items-center gap-2 ${sizes[size].container} ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-full blur-sm opacity-70"></div>
        <div className="relative bg-gradient-to-r from-primary to-blue-600 text-white p-2 rounded-full flex items-center justify-center">
          <Heart className={`${sizes[size].icon} text-white`} />
        </div>
      </div>
      <span
        className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 ${sizes[size].text}`}
      >
        Jeevika
      </span>
    </Link>
  )
}
