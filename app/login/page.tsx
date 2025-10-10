"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        addToast({
          type: "error",
          title: "Login Failed",
          message: error.message,
        });
      } else {
        addToast({
          type: "success",
          title: "Login Successful",
          message: "Welcome back!",
        });
        router.push("/");
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Login Failed",
        message: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Church Admin Portal
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={!email || !password}
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
