import { useState, useEffect } from "react";
import { Task } from "../App";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { X, Trash2, ListChecks, ShoppingCart } from "lucide-react";
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

type TaskDetailsDialogProps = {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
};

export function TaskDetailsDialog({
  task,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: TaskDetailsDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [details, setDetails] = useState(task.details || "");
  const [type, setType] = useState<"todo" | "shopping">(task.type);
  const [isPriority, setIsPriority] = useState(task.isPriority);
  const [tags, setTags] = useState<string[]>(task.tags);
  const [tagInput, setTagInput] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDetails(task.details || "");
    setType(task.type);
    setIsPriority(task.isPriority);
    setTags(task.tags);
    setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
  }, [task]);

  const handleSave = () => {
    if (!title.trim()) return;

    onUpdate({
      title: title.trim(),
      details: details.trim(),
      type,
      isPriority,
      tags,
      dueDate: dueDate?.toISOString() || null,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
    onOpenChange(false);
  };

  const addTag = () => {
    const normalizedTag = tagInput.trim().toLowerCase();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags([...tags, normalizedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task details, priority, tags, and due date.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="details">Details</Label>
              <Input
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Enter task details"
              />
            </div>

            <div className="grid gap-2">
              <Label>Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={type === "todo" ? "default" : "outline"}
                  onClick={() => setType("todo")}
                  className="flex-1"
                >
                  <ListChecks className="mr-2" size={16} /> To-do
                </Button>
                <Button
                  type="button"
                  variant={type === "shopping" ? "default" : "outline"}
                  onClick={() => setType("shopping")}
                  className="flex-1"
                >
                  <ShoppingCart className="mr-2" size={16} /> Shopping
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="priority">Priority</Label>
              <Switch id="priority" checked={isPriority} onCheckedChange={setIsPriority} />
            </div>

            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    {dueDate ? dueDate.toLocaleDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
                </PopoverContent>
              </Popover>
              {dueDate && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDueDate(undefined)}
                >
                  Clear date
                </Button>
              )}
            </div>

            <div className="flex gap-2 justify-between pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={!title.trim()}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this task. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
