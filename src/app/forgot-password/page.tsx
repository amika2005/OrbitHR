"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        setSubmitted(true);
        toast.success(result.message || "Password reset email sent");
      } else {
        toast.error(result.error || "Failed to send reset email");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-olive-50 to-olive-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-olive-500 to-olive-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {submitted
                ? "Check your email for reset instructions"
                : "Enter your email to receive a password reset link"}
            </p>
          </div>

          {submitted ? (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  If an account exists with the email <strong>{email}</strong>, you will receive
                  a password reset link shortly. Please check your inbox and spam folder.
                </p>
              </div>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Didn't receive an email?{" "}
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-olive-600 hover:text-olive-700 font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-olive-600 hover:bg-olive-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Back to Sign In */}
          <div className="mt-6 text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-olive-600 dark:hover:text-olive-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} OrbitHR. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
