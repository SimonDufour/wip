"use client";

import { useState } from "react";
import { Icons } from "@metrica/ui/components/icons";
import { Button } from "@metrica/ui/components/button";
import { Input } from "@metrica/ui/components/input";
import { cn } from "@metrica/ui/lib/utils";

const PasswordInput = ({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) => {
  const [showPassword, setShowPassword] = useState(false);
  const disabled =
    props.value === "" || props.value === undefined || props.disabled;

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("hide-password-toggle pr-10", className)}
        ref={props.ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
      >
        {showPassword && !disabled ? (
          <Icons.Eye className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Icons.EyeSlash className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>

      <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
    </div>
  );
};

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
