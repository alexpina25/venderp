"use client";

import { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
  };

  return (
    <form
      className="space-y-4 bg-card p-6 rounded-xl shadow-md border"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-medium text-center text-foreground mb-2">Sign in</h2>
      <Input name="email" type="email" placeholder="Email" required />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        required
      />
      <Button type="submit" className="w-full">Enter</Button>
    </form>
  );
}
