import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva("scroll-m-20 tracking-tight text-foreground", {
  variants: {
    variant: {
      h1: "text-3xl font-semibold",
      h2: "text-2xl font-semibold",
      h3: "text-xl font-semibold",
      h4: "text-lg font-semibold",
      h5: "text-base font-semibold",
      h6: "text-sm font-semibold",
    },
  },
  defaultVariants: {
    variant: "h1",
  },
});

const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      default: "leading-7",
      lead: "text-xl leading-7",
      large: "text-lg leading-7",
      small: "text-sm leading-none",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface TypographyProps
  extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement>,
    VariantProps<typeof headingVariants | typeof textVariants> {
  asChild?: boolean;
  as?: React.ElementType;
}

const Typography = React.forwardRef<
  HTMLHeadingElement | HTMLParagraphElement,
  TypographyProps
>(({ className, variant = "default", asChild = false, as, ...props }, ref) => {
  const Comp = asChild ? Slot : as || "p";
  const isHeadingVariant =
    variant === "h1" ||
    variant === "h2" ||
    variant === "h3" ||
    variant === "h4" ||
    variant === "h5" ||
    variant === "h6";

  const variantClassNames = isHeadingVariant
    ? headingVariants({ variant, className })
    : textVariants({ variant, className });

  return <Comp className={variantClassNames} ref={ref} {...props} />;
});

Typography.displayName = "Typography";

export { Typography, headingVariants, textVariants };
