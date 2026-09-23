import Link from "next/link";
import RegisterHeader from "@/components/register/RegisterHeader";
import RegisterForm from "@/components/register/RegisterForm";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-8">
      <div className="mx-auto flex w-full max-w-md flex-col">
        <RegisterHeader />
        <RegisterForm />

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Want to sell with Lumina?{" "}
          <Link
            href="/merchant/register"
            className="font-semibold text-primary transition hover:underline"
          >
            Start your store
          </Link>
        </p>

        <div className="mt-6 flex items-center justify-center gap-1 text-sm">
          <span className="text-on-surface-variant">
            Already have an account?
          </span>

          <Link
            href="/login"
            className="font-semibold text-primary transition hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}