import { ShoppingBag } from "lucide-react";

export default function LoginHeader() {
  return (
    <header className="flex flex-col items-center text-center">
      <ShoppingBag
        size={48}
        fill="currentColor"
        className="mb-6 text-primary"
      />

      <h1 className="mb-2 font-display text-4xl text-on-surface">
        Welcome Back
      </h1>

      <p className="max-w-[280px] text-on-surface-variant">
        Log in to your Boutique account to continue shopping.
      </p>
    </header>
  );
}