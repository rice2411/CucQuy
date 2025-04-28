import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/core/lib/utils";
import Image from "next/image";

const buttonVariants = cva(
  "hover:cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-[#DB551B] text-white shadow-xs hover:bg-[#c04b18]",
        destructive:
          "bg-[#FF0000] text-white shadow-xs hover:bg-[#E60000] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-[#E4E4EB] bg-white shadow-xs hover:bg-[#F8F8FC] hover:text-[#40404D]",
        secondary: "bg-[#F0F0F5] text-[#40404D] shadow-xs hover:bg-[#E4E4EB]",
        ghost: "hover:bg-[#F8F8FC] hover:text-[#40404D]",
        link: "text-[#DB551B] underline-offset-4 hover:underline",
        primary:
          "bg-[#DB551B] text-white shadow-sm hover:bg-[#c04b18] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DB551B] border-transparent",
        "primary-outline":
          "border border-[#E4E4EB] rounded-md shadow-sm text-sm font-medium text-[#40404D] bg-white hover:bg-[#F8F8FC]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: string;
  iconWidth?: number;
  iconHeight?: number;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      iconWidth = 20,
      iconHeight = 20,
      iconPosition = "left",
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <Image
            src={icon}
            alt="Icon"
            width={iconWidth}
            height={iconHeight}
            className="mr-2"
          />
        )}
        {children}
        {icon && iconPosition === "right" && (
          <Image
            src={icon}
            alt="Icon"
            width={iconWidth}
            height={iconHeight}
            className="ml-2"
          />
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
