'use client'

import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { buttonVariants } from "./ui/button";
import { Icon } from "./icon";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function UserAuthForm() {

    const [isGithubLoading, setGithubLoading] = useState<boolean>(false);
    const [isGoogleLoading, setGoogleLoading] = useState<boolean>(false);

  return (
    <div className="grid gap-6">
        <form>
            <div className="grid gap-2"> 
                <div className="grid gap-1">
                    <Label htmlFor="email">email</Label>
                    <Input id="email" placeholder="name@example.com" type="email" />
                </div>
                <button className={cn(buttonVariants())}>
                    メールアドレスでログイン
                </button>
            </div>
        </form>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
                <span className="text-muted-foreground px-2 bg-background">
                    or
                </span>
            </div>
        </div>
        <div className="flex flex-col gap-3">
            <button
                className={cn(buttonVariants({ variant: "outline" }))}
                onClick={() => {
                    setGithubLoading(true)
                    signIn("github")
                }}
            >
                {isGithubLoading ? (
                    <Icon.spinner className="mr-2 animate-spin" />
                ) : (
                    <Icon.github className="mr-2" />
                )}
                GitHub
            </button>
            <button
                className={cn(buttonVariants({ variant: "outline" }))}
                onClick={() => {
                    setGoogleLoading(true)
                    signIn("google")
                }}
            >
                {isGoogleLoading ? (
                    <Icon.spinner className="mr-2 animate-spin" />
                ) : (
                    <Icon.google className="mr-2" />
                )}
                Google
            </button>
        </div>
    </div>
  )
}
