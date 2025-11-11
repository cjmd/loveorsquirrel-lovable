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
  workspaceId?: string | null;
};

type WorkspaceMember = {
  id: string;
  email: string;
  name: string;
  role: string;
  isCurrentUser?: boolean;
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
  onOpenAuth,
  workspaceId
}: SettingsMenuProps) {
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [workspaceOwnerEmail, setWorkspaceOwnerEmail] = useState<string | null>(null);
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
      // Determine active workspace
      let activeWorkspaceId = workspaceId || localStorage.getItem("activeWorkspaceId");

      if (!activeWorkspaceId) {
        const { data: latestMembership } = await supabase
          .from("workspace_members")
          .select("workspace_id, created_at, role")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        activeWorkspaceId = latestMembership?.workspace_id || null;
        if (activeWorkspaceId) localStorage.setItem("activeWorkspaceId", activeWorkspaceId);
      }

      if (!activeWorkspaceId) return;

      // Get current user's role in this workspace
      const { data: myMembership, error: roleError } = await supabase
        .from("workspace_members")
        .select("role")
        .eq("workspace_id", activeWorkspaceId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (roleError) throw roleError;
      setIsOwner(myMembership?.role === "owner");

      // Get workspace owner info
      const { data: workspaceData } = await supabase
        .from("workspaces")
        .select("owner_id")
        .eq("id", activeWorkspaceId)
        .maybeSingle();

      if (workspaceData) {
        const { data: ownerEmail } = await supabase.rpc("get_user_email", { _user_id: workspaceData.owner_id });
        setWorkspaceOwnerEmail(ownerEmail || null);
      }

      // Get all workspace members
      const { data: members, error: membersError } = await supabase
        .from("workspace_members")
        .select("id, user_id, role")
        .eq("workspace_id", activeWorkspaceId);

      if (membersError) throw membersError;

      const formattedMembers: WorkspaceMember[] = await Promise.all(
        (members || []).map(async (m: any) => {
          try {
            const { data: email } = await supabase.rpc("get_user_email", { _user_id: m.user_id });
            return {
              id: m.id,
              email: email || "Unknown",
              name: email || "Member",
              role: m.role,
              isCurrentUser: m.user_id === user.id
            };
          } catch {
            return {
              id: m.id,
              email: "Unknown",
              name: "Member",
              role: m.role,
              isCurrentUser: m.user_id === user.id
            };
          }
        })
      );

      setWorkspaceMembers(formattedMembers);
    } catch (error) {
      console.error("Error loading workspace:", error);
    }
  };

  const loadInvitations = async () => {
    if (!user) return;

    try {
      // First, get workspaces the user is already a member of
      const { data: membershipData } = await supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("user_id", user.id);

      const memberWorkspaceIds = new Set((membershipData || []).map((m: any) => m.workspace_id));

      // Fetch pending invitations
      const { data, error } = await supabase
        .from("invitations")
        .select("id, workspace_id, from_user_id, to_email, created_at, status")
        .eq("status", "pending");

      if (error) throw error;

      // Filter to invitations for the current user that they haven't already joined
      const userInvitations = (data || []).filter(
        (inv: any) => 
          (inv.to_email || "").toLowerCase() === (user.email || "").toLowerCase() &&
          !memberWorkspaceIds.has(inv.workspace_id)
      );

      // Keep only the most recent pending invite per workspace
      const dedupedMap = new Map<string, any>();
      userInvitations
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .forEach((inv: any) => {
          if (!dedupedMap.has(inv.workspace_id)) dedupedMap.set(inv.workspace_id, inv);
        });
      const deduped = Array.from(dedupedMap.values());

      // Resolve sender emails using a secure definer function
      const formatted: Invitation[] = await Promise.all(
        deduped.map(async (inv: any) => {
          try {
            const { data: senderEmail } = await supabase.rpc("get_user_email", { _user_id: inv.from_user_id });
            return {
              id: inv.id,
              workspace_id: inv.workspace_id,
              from_email: senderEmail || "Unknown"
            };
          } catch {
            return { id: inv.id, workspace_id: inv.workspace_id, from_email: "Unknown" };
          }
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

      // Mark this invite as accepted
      const { error: inviteError } = await supabase
        .from("invitations")
        .update({ status: "accepted" })
        .eq("id", invitationId);

      if (inviteError) throw inviteError;

      // Persist and broadcast active workspace change so new tasks are created in the shared space
      localStorage.setItem("activeWorkspaceId", workspaceId);
      window.dispatchEvent(new CustomEvent("workspace-changed", { detail: workspaceId }));

      // Remove any remaining invites for the same workspace from the UI
      setPendingInvitations(prev => prev.filter(inv => inv.workspace_id !== workspaceId));

      toast.success("Invitation accepted! You can now collaborate.");
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
      // Get the member's user_id and workspace_id before deleting
      const memberToDelete = workspaceMembers.find(m => m.id === memberId);
      if (!memberToDelete) return;

      // First, get the user_id from workspace_members
      const { data: memberData } = await supabase
        .from("workspace_members")
        .select("user_id, workspace_id")
        .eq("id", memberId)
        .maybeSingle();

      // Delete the workspace membership
      const { error: deleteError } = await supabase
        .from("workspace_members")
        .delete()
        .eq("id", memberId);

      if (deleteError) throw deleteError;

      // Clean up any pending invitations for this user to this workspace
      if (memberData) {
        const { data: userProfile } = await supabase.rpc("get_user_email", { _user_id: memberData.user_id });
        
        if (userProfile) {
          await supabase
            .from("invitations")
            .update({ status: "declined" })
            .eq("workspace_id", memberData.workspace_id)
            .eq("to_email", userProfile.toLowerCase())
            .eq("status", "pending");
        }
      }

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

            {/* Workspace Members Section - Show for all users who are part of a workspace */}
            {user && workspaceMembers.length > 0 && (
              <>
                <Separator />
                
                {/* Show whose workspace this is for non-owners */}
                {!isOwner && workspaceOwnerEmail && (
                  <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-[14px] text-foreground font-semibold">
                      Shared Workspace
                    </h3>
                    <p className="text-[13px] text-[#333333]">
                      You're collaborating with <span className="font-semibold">{workspaceOwnerEmail}</span>
                    </p>
                    <p className="text-[12px] text-[#666666]">
                      You can both see, add, edit, and complete all tasks in this shared space.
                    </p>
                  </div>
                )}

                {/* Workspace Members List */}
                <div className="space-y-4">
                  <h3 className="text-[16px] text-foreground mb-2 flex items-center gap-2">
                    <Users size={18} />
                    {isOwner ? "Collaborators" : "Workspace Members"}
                  </h3>
                  <div className="space-y-2">
                    {workspaceMembers.map((member) => {
                      const canRemove = isOwner && member.role !== "owner" && !member.isCurrentUser;
                      return (
                        <div key={member.id} className={`flex items-center gap-3 p-2 rounded-lg ${
                          member.isCurrentUser ? "bg-blue-50 border border-blue-200" : "bg-[#f9f9f9]"
                        }`}>
                          <User className="text-[#666666]" size={16} />
                          <div className="flex-1">
                            <p className="text-[13px] text-[#333333]">
                              {member.email}
                              {member.isCurrentUser && " (You)"}
                            </p>
                          </div>
                          <span className={`text-[11px] uppercase px-2 py-1 rounded ${
                            member.role === "owner" 
                              ? "bg-purple-100 text-purple-700 font-semibold"
                              : "text-[#999999]"
                          }`}>
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