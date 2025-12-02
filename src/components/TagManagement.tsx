import { useState, useEffect, useMemo } from "react";
import { Task } from "../App";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Trash2, Tag as TagIcon } from "lucide-react";
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

type TagManagementProps = {
  tasks: Task[];
  onDeleteTag: (tag: string) => void;
};

type TagInfo = {
  tag: string;
  activeCount: number;
  totalCount: number;
};

export function TagManagement({ tasks, onDeleteTag }: TagManagementProps) {
  const [tagToDelete, setTagToDelete] = useState<TagInfo | null>(null);

  const tagStats = useMemo(() => {
    const stats = new Map<string, { active: number; total: number }>();

    tasks.forEach((task) => {
      if (task.tags) {
        task.tags.forEach((tag) => {
          const current = stats.get(tag) || { active: 0, total: 0 };
          stats.set(tag, {
            active: current.active + (task.completed ? 0 : 1),
            total: current.total + 1,
          });
        });
      }
    });

    return Array.from(stats.entries())
      .map(([tag, counts]) => ({
        tag,
        activeCount: counts.active,
        totalCount: counts.total,
      }))
      .sort((a, b) => b.totalCount - a.totalCount);
  }, [tasks]);

  const handleDeleteClick = (tagInfo: TagInfo) => {
    setTagToDelete(tagInfo);
  };

  const handleConfirmDelete = () => {
    if (tagToDelete) {
      onDeleteTag(tagToDelete.tag);
      setTagToDelete(null);
    }
  };

  if (tagStats.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <TagIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No tags in use</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {tagStats.map((tagInfo) => (
          <div
            key={tagInfo.tag}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Badge variant="secondary" className="lowercase shrink-0">
                {tagInfo.tag}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {tagInfo.activeCount > 0 ? (
                  <>
                    {tagInfo.activeCount} active task{tagInfo.activeCount !== 1 ? "s" : ""}
                    {tagInfo.totalCount > tagInfo.activeCount && (
                      <span className="text-muted-foreground/70">
                        {" "}
                        · {tagInfo.totalCount - tagInfo.activeCount} archived
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {tagInfo.totalCount} archived task{tagInfo.totalCount !== 1 ? "s" : ""}
                  </>
                )}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
              onClick={() => handleDeleteClick(tagInfo)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog open={!!tagToDelete} onOpenChange={() => setTagToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete tag "{tagToDelete?.tag}"?</AlertDialogTitle>
            <AlertDialogDescription>
              {tagToDelete?.activeCount ? (
                <>
                  This tag is currently used by {tagToDelete.activeCount} active task
                  {tagToDelete.activeCount !== 1 ? "s" : ""}.
                  {tagToDelete.totalCount > tagToDelete.activeCount && (
                    <>
                      {" "}
                      It's also on {tagToDelete.totalCount - tagToDelete.activeCount} archived task
                      {tagToDelete.totalCount - tagToDelete.activeCount !== 1 ? "s" : ""}.
                    </>
                  )}{" "}
                  Deleting will remove this tag from all tasks.
                </>
              ) : (
                <>
                  This tag is only on archived tasks ({tagToDelete?.totalCount} task
                  {tagToDelete?.totalCount !== 1 ? "s" : ""}). It will be removed from all of them.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Tag
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
