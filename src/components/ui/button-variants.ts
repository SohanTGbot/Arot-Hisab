import { cva } from "class-variance-authority";

export const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:scale-[1.02] active:scale-[0.98]",
                outline:
                    "border border-gray-300 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-400 text-gray-900",
                secondary:
                    "bg-gray-100 text-gray-900 hover:bg-gray-200",
                ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-700",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-12 px-6 py-3 md:h-10 md:px-5 md:py-2.5", // Premium touch targets
                sm: "h-11 px-4 py-2.5 md:h-9 md:px-3 md:py-2 text-sm",
                lg: "h-14 px-8 py-4 md:h-11 md:px-6 md:py-3 text-base",
                icon: "h-12 w-12 md:h-10 md:w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);
