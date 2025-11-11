import { useState, useEffect } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, LogOut, Users, Check, X, UserMinus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Task } from "../App";

type SettingsMenuProps = {
  tasks: Task[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SupabaseUser | null;
  onSignOut: () => void;
  onOpenAuth: () => void;
};

type WorkspaceMember = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type Invitation = {
  id: string;
  from_email: string;
  workspace_id: string;
};

export function SettingsMenu({
  tasks,
  open,
  onOpenChange,
  user,
  onSignOut,
  onOpenAuth
}: SettingsMenuProps) {
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; email: string } | null>(null);

  // Load workspace data when dialog opens
  useEffect(() => {
    if (open && user) {
      loadWorkspaceData();
      loadInvitations();
    }
  }, [open, user]);

  const loadWorkspaceData = async () => {
    if (!user) return;

    try {
      // Get user's workspace
      const { data: memberData, error: memberError } = await supabase
        .from("workspace_members")
        .select("workspace_id, role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (memberError) throw memberError;
      if (!memberData) return;

      setIsOwner(memberData.role === "owner");

      // Get all workspace members except the current user
      const { data: members, error: membersError } = await supabase
        .from("workspace_members")
        .select("id, user_id, role")
        .eq("workspace_id", memberData.workspace_id)
        .neq("user_id", user.id);

      if (membersError) throw membersError;

      const formattedMembers: WorkspaceMember[] = (members || []).map((m: any) => ({
        id: m.id,
        email: "Collaborator",
        name: "Member",
        role: m.role
      }));

      setWorkspaceMembers(formattedMembers);
    } catch (error) {
      console.error("Error loading workspace:", error);
    }
  };

  const loadInvitations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("id, workspace_id, from_user_id, to_email")
        .eq("status", "pending");

      if (error) throw error;

      // Only show invitations where the current user is the recipient, not the sender
      const userInvitations = (data || []).filter(
        (inv: any) => inv.to_email.toLowerCase() === (user.email || "").toLowerCase()
      );

      // Get sender emails separately
      const formatted: Invitation[] = await Promise.all(
        userInvitations.map(async (inv: any) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", inv.from_user_id)
            .maybeSingle();

          return {
            id: inv.id,
            workspace_id: inv.workspace_id,
            from_email: profileData?.email || "Unknown"
          };
        })
      );

      setPendingInvitations(formatted);
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(collaboratorEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (collaboratorEmail === user.email) {
      toast.error("You cannot invite yourself");
      return;
    }

    try {
      // Get user's workspace
      const { data: memberData, error: memberError } = await supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("user_id", user.id)
        .single();

      if (memberError) throw memberError;

      // Check if already a member
      const { data: existingMember } = await supabase
        .from("workspace_members")
        .select("id, profiles:user_id(email)")
        .eq("workspace_id", memberData.workspace_id);

      if (existingMember?.some((m: any) => m.profiles?.email === collaboratorEmail)) {
        toast.error("This user is already a collaborator");
        return;
      }

      // Check if invitation already exists
      const { data: existingInvitation } = await supabase
        .from("invitations")
        .select("id")
        .eq("workspace_id", memberData.workspace_id)
        .eq("to_email", collaboratorEmail)
        .eq("status", "pending")
        .maybeSingle();

      if (existingInvitation) {
        toast.error("An invitation is already pending for this email");
        return;
      }

      // Create invitation
      const { error: inviteError } = await supabase
        .from("invitations")
        .insert({
          workspace_id: memberData.workspace_id,
          from_user_id: user.id,
          to_email: collaboratorEmail.trim().toLowerCase()
        });

      if (inviteError) throw inviteError;

      toast.success(`Invitation sent to ${collaboratorEmail}`);
      setCollaboratorEmail("");
    } catch (error: any) {
      console.error("Error inviting collaborator:", error);
      toast.error(error.message || "Failed to send invitation");
    }
  };

  const handleAcceptInvitation = async (invitationId: string, workspaceId: string) => {
    if (!user) return;

    try {
      // Add user to workspace
      const { error: memberError } = await supabase
        .from("workspace_members")
        .insert({
          workspace_id: workspaceId,
          user_id: user.id,
          role: "member"
        });

      if (memberError) throw memberError;

      // Update invitation status
      const { error: inviteError } = await supabase
        .from("invitations")
        .update({ status: "accepted" })
        .eq("id", invitationId);

      if (inviteError) throw inviteError;

      toast.success("Invitation accepted! You can now collaborate.");
      
      // Reload the page to refresh tasks from new workspace
      window.location.reload();
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      toast.error(error.message || "Failed to accept invitation");
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from("invitations")
        .update({ status: "declined" })
        .eq("id", invitationId);

      if (error) throw error;

      toast.success("Invitation declined");
      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (error: any) {
      console.error("Error declining invitation:", error);
      toast.error(error.message || "Failed to decline invitation");
    }
  };

  const handleRemoveCollaborator = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("workspace_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      toast.success("Collaborator removed");
      setMemberToRemove(null);
      await loadWorkspaceData();
    } catch (error: any) {
      console.error("Error removing collaborator:", error);
      toast.error(error.message || "Failed to remove collaborator");
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[340px] sm:w-[400px] overflow-y-auto">
          <SheetHeader className="p-[16px] py-0 px-0">
            <SheetTitle className="text-[20px] text-foreground">
              Settings
            </SheetTitle>
            <SheetDescription className="text-[14px] text-[#999999]">
              Manage your lists and collaborators
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6 px-[8px] px-[16px] py-[0px]">
            {/* Pending Invitations */}
            {pendingInvitations.length > 0 && (
              <>
                <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-[16px] text-foreground mb-2 flex items-center gap-2">
                    <Users size={18} className="text-blue-600" />
                    Collaboration Invitation
                  </h3>
                  {pendingInvitations.map((invitation) => (
                    <div key={invitation.id} className="space-y-3">
                      <p className="text-[14px] text-[#333333]">
                        <span className="font-semibold">{invitation.from_email}</span> invited you to collaborate on their lists
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAcceptInvitation(invitation.id, invitation.workspace_id)}
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

            {user && workspaceMembers.length > 0 && (
              <>
                <Separator />
                
                {/* Collaborators Section */}
                <div className="space-y-4">
                  <h3 className="text-[16px] text-foreground mb-2 flex items-center gap-2">
                    <Users size={18} />
                    Collaborators
                  </h3>
                  <div className="space-y-2">
                    {workspaceMembers.map((member) => {
                      const canRemove = isOwner && member.role !== "owner";
                      return (
                        <div key={member.id} className="flex items-center gap-3 p-2 bg-[#f9f9f9] rounded-lg">
                          <User className="text-[#666666]" size={16} />
                          <div className="flex-1">
                            <p className="text-[13px] text-[#333333]">
                              {member.email}
                            </p>
                          </div>
                          <span className="text-[11px] text-[#999999] uppercase">
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
              </>
            )}

            {/* Invite Collaborator Section */}
            {user && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[16px] text-foreground mb-2">
                      Invite Collaborator
                    </h3>
                    <p className="text-[14px] text-[#666666] mb-3">
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
                    />
                    <Button
                      onClick={handleInviteCollaborator}
                      className="w-full"
                      disabled={!collaboratorEmail.trim()}
                    >
                      Send Invitation
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirm Remove Collaborator Dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Collaborator?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{memberToRemove?.email}</strong> from your workspace? 
              They will no longer have access to your shared tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToRemove && handleRemoveCollaborator(memberToRemove.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}