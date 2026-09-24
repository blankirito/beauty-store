"use client";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useState } from "react";

type AuthInputProps = {
  id: string;
  label: string;
  placeholder: string;
  icon?: LucideIcon;
  type?: "text" | "email" | "tel" | "password";
  name?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
  readOnly?: boolean;
};

export default function AuthInput({
  id,
  label,
  placeholder,
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  autoComplete,
  required = false,
  readOnly = false,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="ml-1 text-sm font-semibold tracking-wide text-on-surface-variant"
      >
        {label}
      </label>

      <div className="group flex h-14 items-center overflow-hidden rounded-xl border-2 border-transparent bg-surface-low transition focus-within:border-primary focus-within:bg-surface">
        {Icon && (
          <Icon
            size={20}
            className="ml-4 shrink-0 text-outline transition group-focus-within:text-primary"
          />
        )}

        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          readOnly={readOnly}
          className="min-w-0 flex-1 self-stretch bg-transparent px-4 py-0 text-on-surface outline-none placeholder:text-outline focus:ring-0 read-only:cursor-not-allowed read-only:opacity-70"
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="mr-4 flex h-full shrink-0 items-center text-outline transition hover:text-primary"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}