import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import type { InputHTMLAttributes } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  toggleAria?: {
    show: string;
    hide: string;
  };
}

export function PasswordInput({ toggleAria, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} {...props} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShow((s) => !s)}
        aria-label={
          show
            ? (toggleAria?.hide ?? "Hide password")
            : (toggleAria?.show ?? "Show password")
        }
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}
