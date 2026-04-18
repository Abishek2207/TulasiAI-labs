import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      default: "bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
      outline: "border border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 backdrop-blur-sm",
      secondary: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white",
      ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
      link: "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300",
      gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    }
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-lg px-3",
      lg: "h-12 rounded-xl px-8 text-base",
      icon: "h-10 w-10",
    }
    
    const classes = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    )
    
    return (
      <motion.button
        className={classes}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        {...(props as any)}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
