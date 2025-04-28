"use client";

import * as React from "react";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onCheckedChange, id, className = "", ...props }, ref) => {
    return (
      <input
        type="checkbox"
        id={id}
        ref={ref}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className={
          "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 " +
          className
        }
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
