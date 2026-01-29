"use client";

import { useState } from "react";
import { storageUtils } from "@/lib/storage-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn, Lock, User } from "lucide-react";
import Image from "next/image";

interface LoginViewProps {
  onLogin: (user: { name: string; role: string; id: string }) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const users = storageUtils.getUsers();
      const matchedUser = users.find(
        (u: any) => u.id === userId && u.pass === password,
      );

      if (matchedUser) {
        onLogin({
          name: matchedUser.userName,
          role: matchedUser.role,
          id: matchedUser.id,
        });
      } else {
        setError("Invalid User ID or Password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-0 shadow-xl">
        <CardHeader className="text-center pt-8 pb-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg shadow-sky-500/20">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Reward System
          </CardTitle>
          <p className="text-slate-500 text-sm mt-1">
            Sign in to access your dashboard
          </p>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-600 font-medium">User ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Enter your ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="pl-10 h-11 border-slate-200 focus:border-sky-500 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 border-slate-200 focus:border-sky-500 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 transition-all mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-6 text-center">
        <a
          href="https://www.botivate.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-sky-500 transition-colors"
        >
          Powered By <span className="font-semibold">Botivate</span>
        </a>
      </div>
    </div>
  );
}
