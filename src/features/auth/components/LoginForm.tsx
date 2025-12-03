"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/features/auth/schema";
import { login } from "@/features/auth/services";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorTheme } from "@/constants/color";
import { ShinyButton } from "@/components/decoration/ShinyButton";
import { toast } from "sonner"; // or use any toast lib you have

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await login(data);
      toast.success("Login successful!");
      router.push("/admin/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="h-full flex flex-col justify-center">
        <CardHeader className="bg-black/10 py-2 border-l-6 border-white/50 rounded-lg">
          <CardTitle
            className="text-white text-2xl font-bold"
            style={{ color: ColorTheme.powderBlue }}
          >
            Login to your account
          </CardTitle>
          <CardDescription className="text-white font-semibold">
            Enter your email and password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label
                  className="text-white font-bold text-1xl"
                  htmlFor="email"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label
                  htmlFor="password"
                  className="text-white font-bold text-1xl"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className="text-red-400 text-sm">
                    {errors.password.message}
                  </p>
                )}
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-white font-semibold"
                >
                  Forgot your password?
                </a>
              </div>

              <div className="flex flex-col gap-3">
                <ShinyButton
                  type="submit"
                  className="w-full"
                  text={loading ? "Logging in..." : "Login"}
                  disabled={loading}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
