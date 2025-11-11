import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp: (email: string, password: string, name: string) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
};

export function AuthDialog({ open, onOpenChange, onSignUp, onSignIn }: AuthDialogProps) {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!signUpEmail.trim() || !signUpPassword.trim() || !signUpName.trim()) return;
    
    setIsLoading(true);
    try {
      await onSignUp(signUpEmail, signUpPassword, signUpName);
      setSignUpEmail("");
      setSignUpPassword("");
      setSignUpName("");
      onOpenChange(false);
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!signInEmail.trim() || !signInPassword.trim()) return;
    
    setIsLoading(true);
    try {
      await onSignIn(signInEmail, signInPassword);
      setSignInEmail("");
      setSignInPassword("");
      onOpenChange(false);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-['DM_Sans']">Welcome</DialogTitle>
          <DialogDescription className="font-['DM_Sans']">
            Sign in to sync your tasks across devices
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" className="font-['DM_Sans']">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="font-['DM_Sans']">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="font-['DM_Sans']">Email</Label>
              <Input
                id="signin-email"
                type="email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="you@example.com"
                className="font-['DM_Sans']"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSignIn();
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password" className="font-['DM_Sans']">Password</Label>
              <Input
                id="signin-password"
                type="password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                placeholder="••••••••"
                className="font-['DM_Sans']"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSignIn();
                }}
              />
            </div>
            <Button 
              onClick={handleSignIn} 
              disabled={!signInEmail.trim() || !signInPassword.trim() || isLoading}
              className="w-full font-['DM_Sans']"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name" className="font-['DM_Sans']">Name</Label>
              <Input
                id="signup-name"
                type="text"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                placeholder="Your name"
                className="font-['DM_Sans']"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="font-['DM_Sans']">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="you@example.com"
                className="font-['DM_Sans']"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="font-['DM_Sans']">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="••••••••"
                className="font-['DM_Sans']"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSignUp();
                }}
              />
            </div>
            <Button 
              onClick={handleSignUp} 
              disabled={!signUpEmail.trim() || !signUpPassword.trim() || !signUpName.trim() || isLoading}
              className="w-full font-['DM_Sans']"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
