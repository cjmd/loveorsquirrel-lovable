import { useEffect, useState } from "react";
import { ViewType } from "../App";
import { StickyNote, Settings, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export type Note = {
  id: string;
  title: string;
  content: string;
  order: number;
  createdAt: number;
  updatedAt: number;
  userId?: string;
  workspaceId?: string | null;
};

type NotesViewProps = {
  onOpenSettingsMenu: () => void;
  onViewChange: (view: ViewType) => void;
  workspaceId: string | null;
  userId: string | null;
};

const LOCAL_KEY = "notes";

export function NotesView({ onOpenSettingsMenu, workspaceId, userId }: NotesViewProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  // Load notes
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_KEY);
    if (cached) {
      try {
        setNotes(JSON.parse(cached));
      } catch {}
    }

    if (!userId || !workspaceId) return;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("order", { ascending: true });
      setLoading(false);
      if (error) {
        console.error("Load notes failed:", error);
        return;
      }
      const mapped: Note[] = (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        order: row.order,
        createdAt: new Date(row.created_at).getTime(),
        updatedAt: new Date(row.updated_at).getTime(),
        userId: row.user_id,
        workspaceId: row.workspace_id,
      }));
      setNotes(mapped);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(mapped));
    };
    load();
  }, [userId, workspaceId]);

  // Realtime
  useEffect(() => {
    if (!userId || !workspaceId) return;

    const channel = supabase
      .channel("notes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const n = payload.new as any;
            const newNote: Note = {
              id: n.id,
              title: n.title,
              content: n.content,
              order: n.order,
              createdAt: new Date(n.created_at).getTime(),
              updatedAt: new Date(n.updated_at).getTime(),
              userId: n.user_id,
              workspaceId: n.workspace_id,
            };
            setNotes((prev) =>
              prev.some((x) => x.id === newNote.id) ? prev : [...prev, newNote]
            );
          } else if (payload.eventType === "UPDATE") {
            const n = payload.new as any;
            setNotes((prev) =>
              prev.map((note) => {
                if (note.id !== n.id) return note;
                const dbUpdated = new Date(n.updated_at).getTime();
                if (note.updatedAt > dbUpdated) return note;
                return {
                  ...note,
                  title: n.title,
                  content: n.content,
                  order: n.order,
                  updatedAt: dbUpdated,
                };
              })
            );
          } else if (payload.eventType === "DELETE") {
            const id = (payload.old as any)?.id;
            setNotes((prev) => prev.filter((n) => n.id !== id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, workspaceId]);

  const persist = (next: Note[]) => {
    setNotes(next);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
  };

  const handleAddNote = async () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      order: notes.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (!userId || !workspaceId) {
      persist([newNote, ...notes]);
      return;
    }

    persist([newNote, ...notes]);

    const { error } = await supabase.from("notes").insert({
      id: newNote.id,
      user_id: userId,
      workspace_id: workspaceId,
      title: newNote.title,
      content: newNote.content,
      order: newNote.order,
    });
    if (error) {
      console.error("Create note failed:", error);
      toast.error("Failed to create note");
    }
  };

  const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
    const next = notes.map((n) =>
      n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
    );
    persist(next);

    if (!userId || !workspaceId) return;

    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    const { error } = await supabase.from("notes").update(dbUpdates).eq("id", id);
    if (error) console.error("Update note failed:", error);
  };

  const handleDeleteNote = async (id: string) => {
    const next = notes.filter((n) => n.id !== id);
    persist(next);
    if (!userId || !workspaceId) {
      toast.success("Note deleted");
      return;
    }
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      console.error("Delete note failed:", error);
      toast.error("Failed to delete note");
    } else {
      toast.success("Note deleted");
    }
  };

  return (
    <div className="size-full overflow-y-auto">
      <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-[180px] pt-[60px] px-[16px] relative min-h-full">
        {/* Header */}
        <div className="flex items-start justify-between w-full text-[24px]">
          <div className="flex gap-[10px] items-center">
            <StickyNote className="text-[#a78bfa]" size={24} />
            <p className="text-foreground">Notes</p>
          </div>
          <button onClick={onOpenSettingsMenu} className="text-foreground">
            <Settings size={24} />
          </button>
        </div>

        {/* Add note button */}
        <Button
          onClick={handleAddNote}
          variant="outline"
          className="w-full justify-center gap-2"
        >
          <Plus size={16} />
          New note
        </Button>

        {/* Notes list */}
        <div className="flex flex-col gap-[12px] w-full">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-card rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] p-[12px] flex flex-col gap-[8px]"
            >
              <div className="flex items-start gap-2">
                <Input
                  value={note.title}
                  onChange={(e) => handleUpdateNote(note.id, { title: e.target.value })}
                  placeholder="Title"
                  className="flex-1 border-0 bg-transparent text-[16px] font-medium px-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-auto py-0"
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      aria-label="Delete note"
                    >
                      <Trash2 size={16} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Textarea
                value={note.content}
                onChange={(e) => handleUpdateNote(note.id, { content: e.target.value })}
                placeholder="Write something..."
                className="border-0 bg-transparent px-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none min-h-[60px]"
              />
            </div>
          ))}

          {notes.length === 0 && !loading && (
            <div className="flex items-center justify-center w-full pt-20">
              <p className="text-muted-foreground">
                No notes yet. Tap "New note" to add one!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
