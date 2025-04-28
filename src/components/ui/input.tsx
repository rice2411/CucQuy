import * as React from "react";
import { cn } from "@/core/utils/tailwind";
import Image from "next/image";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isSearchInput?: boolean;
  onSearchClick?: () => void;
  isSearching?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      containerClassName,
      icon,
      iconPosition = "right",
      isSearchInput = false,
      onSearchClick,
      isSearching,
      ...props
    },
    ref
  ) => {
    // Nếu là input tìm kiếm theo thiết kế từ OrderFilters
    if (isSearchInput) {
      return (
        <div
          className={cn(
            "flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm",
            containerClassName
          )}
        >
          <div className="flex-1 flex items-center">
            <input
              type={type}
              className={cn(
                "flex-1 outline-none text-gray-500 text-sm bg-transparent",
                className
              )}
              ref={ref}
              {...props}
            />
            {icon && iconPosition === "right" && (
              <>
                <div className="w-px h-4 bg-gray-300 mx-2"></div>
                <div className="text-gray-500 text-sm flex items-center">
                  {icon}
                </div>
              </>
            )}
          </div>
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              disabled={isSearching}
              className="ml-2 focus:outline-none disabled:opacity-50"
              type="button"
            >
              <Image
                src="/images/search_icon.svg"
                alt="Search"
                width={16}
                height={16}
              />
            </button>
          )}
        </div>
      );
    }

    // Input dạng date hoặc các loại input khác theo thiết kế từ OrderFilters
    if (type === "date") {
      return (
        <div
          className={cn(
            "flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm",
            containerClassName
          )}
        >
          <input
            type={type}
            className={cn(
              "outline-none text-gray-500 text-sm bg-transparent",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      );
    }

    // Input mặc định với thiết kế cũ
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
