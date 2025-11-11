import { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";
import { User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Task } from "../App";

type SettingsMenuProps = {
  tasks: Task[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SupabaseUser | null;
  onSignOut: () => void;
  onOpenAuth: () => void;
};

export function SettingsMenu({
  tasks,
  open,
  onOpenChange,
  user,
  onSignOut,
  onOpenAuth
}: SettingsMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[340px] sm:w-[400px]">
        <SheetHeader className="p-[16px] py-0 px-0">
          <SheetTitle className="text-[20px] text-foreground">
            Settings
          </SheetTitle>
          <SheetDescription className="text-[14px] text-[#999999]">
            Manage your account
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-[8px] px-[16px] py-[0px]">
          {/* Account Section */}
          <div className="space-y-4">
            <h3 className="text-[16px] text-foreground mb-2">
              Account
            </h3>
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#f3f3f5] rounded-lg">
                  <User className="text-[#666666]" size={20} />
                  <div className="flex-1">
                    {user.user_metadata?.name && (
                      <p className="text-[14px] text-[#333333]">
                        {user.user_metadata.name}
                      </p>
                    )}
                    <p className="text-[12px] text-[#666666]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button onClick={onSignOut} variant="outline" className="w-full gap-2">
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[14px] text-[#666666]">
                  Sign in to sync your tasks across devices.
                </p>
                <Button
                  onClick={() => {
                    onOpenChange(false);
                    onOpenAuth();
                  }}
                  className="w-full"
                >
                  Sign In / Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}