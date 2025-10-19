import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorTheme } from "@/constants/color"
import { ShinyButton } from "@/components/decoration/ShinyButton"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="h-full flex flex-col justify-center">
        <CardHeader className=" bg-black/10 py-2 border-l-6 border-white/50 rounded-lg">
          <CardTitle className=" text-white text-2xl font-bold"
            style={{ color: ColorTheme.powderBlue }}>Login to your account</CardTitle>
          <CardDescription className="text-white font-semibold">
            Enter your email and password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label className="text-white font-bold text-1xl" htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required

                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password" className="text-white font-bold text-1xl">Password</Label>
                <Input id="password" type="password" required />
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-white font-semibold justify-between"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                  <ShinyButton
                    type="submit"
                    className="w-full"
                    text="Login"
                  >
                    Login
                  </ShinyButton>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
