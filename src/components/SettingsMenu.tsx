import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, LogOut, Users, Check, X, UserMinus } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Task } from "../App";

type SettingsMenuProps = {
  tasks: Task[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { email: string; name?: string } | null;
  onSignOut: () => void;
  onOpenAuth: () => void;
};

type Workspace = {
  id: string;
  ownerId: string;
  ownerEmail: string;
  members: { id: string; email: string; role: string }[];
};

type Invitation = {
  id: string;
  workspaceId: string;
  fromEmail: string;
  toEmail: string;
  status: string;
};

export function SettingsMenu({ tasks, open, onOpenChange, user, onSignOut, onOpenAuth }: SettingsMenuProps) {
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; email: string } | null>(null);
  
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-dcb5bd28`;

  // Load workspace and invitations when dialog opens and user is logged in
  useEffect(() => {
    if (open && user) {
      loadWorkspace();
      loadInvitations();
    }
  }, [open, user]);

  const loadWorkspace = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const response = await fetch(`${baseUrl}/workspace`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkspace(data.workspace);
      }
    } catch (error) {
      console.error("Error loading workspace:", error);
    }
  };

  const loadInvitations = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const response = await fetch(`${baseUrl}/invitations`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPendingInvitations(data.invitations || []);
      }
    } catch (error) {
      console.error("Error loading invitations:", error);
    }
  };

  const handleInviteCollaborator = async () => {
    if (!user) {
      toast.error("You must be signed in to invite collaborators");
      return;
    }

    if (!collaboratorEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(collaboratorEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      toast.error("Authentication required");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email: collaboratorEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to send invitation");
        return;
      }

      toast.success(`Invitation sent to ${collaboratorEmail}`);
      setCollaboratorEmail("");
      await loadWorkspace(); // Reload to show updated workspace
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const response = await fetch(`${baseUrl}/invitations/${invitationId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        toast.success("Invitation accepted! You can now collaborate.");
        setPendingInvitations([]);
        await loadWorkspace();
        // Refresh the page to reload tasks from the new workspace
        window.location.reload();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to accept invitation");
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation");
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const response = await fetch(`${baseUrl}/invitations/${invitationId}/decline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        toast.success("Invitation declined");
        setPendingInvitations([]);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to decline invitation");
      }
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast.error("Failed to decline invitation");
    }
  };

  const handleRemoveCollaborator = async (memberId: string) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const response = await fetch(`${baseUrl}/workspace/members/${memberId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Collaborator removed");
        setMemberToRemove(null);
        await loadWorkspace();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to remove collaborator");
      }
    } catch (error) {
      console.error("Error removing collaborator:", error);
      toast.error("Failed to remove collaborator");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[340px] sm:w-[400px]">
        <SheetHeader className="px-[8px] py-[16px] p-[16px]">
          <SheetTitle className="font-['DM_Sans'] text-[20px] text-[#333333]">
            Settings
          </SheetTitle>
          <SheetDescription className="font-['DM_Sans'] text-[14px] text-[#999999]">
            Manage your lists and collaborators
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-[8px] px-[16px] py-[0px]">
          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <>
              <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-['DM_Sans'] text-[16px] text-[#333333] mb-2 flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  Collaboration Invitation
                </h3>
                {pendingInvitations.map((invitation) => (
                  <div key={invitation.id} className="space-y-3">
                    <p className="font-['DM_Sans'] text-[14px] text-[#333333]">
                      <span className="font-semibold">{invitation.fromEmail}</span> invited you to collaborate on their lists
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        className="flex-1 gap-2"
                        size="sm"
                      >
                        <Check size={16} />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleDeclineInvitation(invitation.id)}
                        variant="outline"
                        className="flex-1 gap-2"
                        size="sm"
                      >
                        <X size={16} />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Account Section */}
          <div className="space-y-4">
            <h3 className="font-['DM_Sans'] text-[16px] text-[#333333] mb-2">
              Account
            </h3>
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#f3f3f5] rounded-lg">
                  <User className="text-[#666666]" size={20} />
                  <div className="flex-1">
                    {user.name && (
                      <p className="font-['DM_Sans'] text-[14px] text-[#333333]">
                        {user.name}
                      </p>
                    )}
                    <p className="font-['DM_Sans'] text-[12px] text-[#666666]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={onSignOut}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="font-['DM_Sans'] text-[14px] text-[#666666]">
                  Sign in to sync your tasks across devices and collaborate with others.
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

          <Separator />

          {/* Collaborators Section */}
          {user && workspace && (
            <>
              <div className="space-y-4">
                <h3 className="font-['DM_Sans'] text-[16px] text-[#333333] mb-2 flex items-center gap-2">
                  <Users size={18} />
                  Collaborators
                </h3>
                <div className="space-y-2">
                  {workspace.members.map((member) => {
                    const isOwner = member.role === "owner";
                    const isCurrentUserOwner = workspace.ownerId === user?.email || workspace.ownerEmail === user?.email;
                    const canRemove = isCurrentUserOwner && !isOwner;

                    return (
                      <div key={member.id} className="flex items-center gap-3 p-2 bg-[#f9f9f9] rounded-lg">
                        <User className="text-[#666666]" size={16} />
                        <div className="flex-1">
                          <p className="font-['DM_Sans'] text-[13px] text-[#333333]">
                            {member.email}
                          </p>
                        </div>
                        <span className="font-['DM_Sans'] text-[11px] text-[#999999] uppercase">
                          {member.role}
                        </span>
                        {canRemove && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMemberToRemove({ id: member.id, email: member.email })}
                            className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <UserMinus size={14} />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Invite Collaborator Section */}
          {user && (
            <div className="space-y-4">
              <div>
                <h3 className="font-['DM_Sans'] text-[16px] text-[#333333] mb-2">
                  Invite Collaborator
                </h3>
                <p className="font-['DM_Sans'] text-[14px] text-[#666666] mb-3">
                  Share your lists with someone. They'll be able to add, edit, complete, and delete items.
                </p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[#333333]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="collaborator@example.com"
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleInviteCollaborator();
                    }
                  }}
                  className="bg-white border-[#e4e4e4]"
                  disabled={!user}
                />
                <Button 
                  onClick={handleInviteCollaborator}
                  className="w-full"
                  disabled={!collaboratorEmail.trim() || !user}
                >
                  Send Invitation
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>

      {/* Confirm Remove Collaborator Dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-['DM_Sans']">Remove Collaborator?</AlertDialogTitle>
            <AlertDialogDescription className="font-['DM_Sans']">
              Are you sure you want to remove <strong>{memberToRemove?.email}</strong> from your workspace? 
              They will no longer have access to your shared tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-['DM_Sans']">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToRemove && handleRemoveCollaborator(memberToRemove.id)}
              className="bg-red-600 hover:bg-red-700 font-['DM_Sans']"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
