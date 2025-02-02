import { forwardRef } from "react"
import PropTypes from "prop-types"
import { cn } from "../../../lib/utils"

const Button = forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
            "border border-input hover:bg-accent hover:text-accent-foreground": variant === "outline",
            "underline-offset-4 hover:underline text-primary": variant === "link",
            "h-10 py-2 px-4": size === "default",
            "h-9 px-3 rounded-md": size === "sm",
            "h-11 px-8 rounded-md": size === "lg",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.propTypes = {
  variant: PropTypes.oneOf(["default", "outline", "link"]),
  size: PropTypes.oneOf(["default", "sm", "lg"]),
  className: PropTypes.string
}

Button.defaultProps = {
  variant: "default",
  size: "default"
}

Button.displayName = "Button"

export { Button }