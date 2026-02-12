import { useState } from "react";
import { signUp, signIn, signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Example, ExampleWrapper } from "@/components/example";

export default function Demo() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const { data: session, isPending } = useSession();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await signIn({
      email: signInEmail,
      password: signInPassword,
    });

    setIsLoading(false);

    if (error) {
      setError(error.message || "Failed to sign in");
    } else {
      setSuccess("Signed in successfully!");
      setSignInEmail("");
      setSignInPassword("");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await signUp({
      email: signUpEmail,
      password: signUpPassword,
      name: signUpName,
    });

    setIsLoading(false);

    if (error) {
      setError(error.message || "Failed to sign up");
    } else {
      setSuccess("Account created successfully! Please sign in.");
      setActiveTab("signin");
      setSignUpName("");
      setSignUpEmail("");
      setSignUpPassword("");
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    const { error } = await signOut();
    setIsLoading(false);

    if (error) {
      setError(error.message || "Failed to sign out");
    } else {
      setSuccess("Signed out successfully!");
    }
  };

  const switchTab = (tab: "signin" | "signup") => {
    setActiveTab(tab);
    setError(null);
    setSuccess(null);
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <ExampleWrapper>
      <Example title="Form">
        {session ? (
          <Card className="w-full rounded-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">Welcome</CardTitle>
              <CardDescription>
                You are signed in as {session.user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Name</span>
                  <span>{session.user.name || "-"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Email</span>
                  <span>{session.user.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-mono text-xs">{session.user.id}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="destructive"
                  onClick={handleSignOut}
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? "Signing out..." : "Sign Out"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full space-y-4">
            {/* Tab Switcher */}
            <div className="flex gap-1 rounded-md bg-muted p-1">
              <button
                type="button"
                onClick={() => switchTab("signin")}
                className={`flex-1 rounded px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTab === "signin"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchTab("signup")}
                className={`flex-1 rounded px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTab === "signup"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            <Card className="w-full rounded-none">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">
                  {activeTab === "signin" ? "Sign In" : "Create Account"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "signin"
                    ? "Enter your credentials to access your account"
                    : "Fill in your details to create a new account"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 rounded border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 rounded border border-green-500/50 bg-green-500/10 p-3 text-xs text-green-700 dark:text-green-400">
                    {success}
                  </div>
                )}

                {activeTab === "signin" ? (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-xs">
                        Email
                      </Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-xs">
                        Password
                      </Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Separator className="my-4" />

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading} size="sm">
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSignInEmail("");
                          setSignInPassword("");
                          setError(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-xs">
                        Name
                      </Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your name"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-xs">
                        Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-xs">
                        Password
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Enter your password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters
                      </p>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading} size="sm">
                        {isLoading ? "Creating..." : "Create Account"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSignUpName("");
                          setSignUpEmail("");
                          setSignUpPassword("");
                          setError(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </Example>
    </ExampleWrapper>
  );
}
