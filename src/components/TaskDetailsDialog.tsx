import { useState, useEffect, useMemo } from "react";
import { Task } from "../App";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "./ui/drawer";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { X, Trash2, ListChecks, ShoppingCart } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./ui/command";
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
  tasks?: Task[];
};

export function TaskDetailsDialog({
  task,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  tasks = []
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
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Get existing tags sorted by most recently used
  const existingTags = useMemo(() => {
    const tagMap = new Map<string, number>();
    
    // Collect all tags with their most recent usage timestamp
    tasks.forEach(t => {
      t.tags.forEach(tag => {
        const currentMax = tagMap.get(tag) || 0;
        tagMap.set(tag, Math.max(currentMax, t.updatedAt));
      });
    });
    
    // Sort by most recent usage and filter out already selected tags
    return Array.from(tagMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
      .filter(tag => !tags.includes(tag));
  }, [tasks, tags]);

  // Filter suggestions based on input
  const filteredSuggestions = useMemo(() => {
    if (!tagInput.trim()) return existingTags.slice(0, 5);
    const search = tagInput.toLowerCase();
    return existingTags.filter(tag => tag.includes(search)).slice(0, 5);
  }, [existingTags, tagInput]);

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

  const addTag = (tag?: string) => {
    const normalizedTag = (tag || tagInput).trim().toLowerCase();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags([...tags, normalizedTag]);
      setTagInput("");
      setShowTagSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh] max-h-[85svh] flex flex-col">
          <DrawerHeader className="text-left flex-shrink-0">
            <DrawerTitle className="sr-only">Edit Task</DrawerTitle>
            <DrawerDescription className="sr-only">Update task details, priority, tags, and due date</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-2 overflow-y-auto flex-1">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                  className="text-[20px] text-[#999999] border-none shadow-none px-0 h-auto focus-visible:ring-0 px-[8px] py-[4px]"
                />
                <Input
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Details"
                  className="text-[16px] text-[#999999] border-none shadow-none px-0 h-auto focus-visible:ring-0 px-[8px] py-[4px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-foreground font-medium">Type</Label>
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

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="priority" className="text-foreground font-medium">Priority</Label>
                <Switch id="priority" checked={isPriority} onCheckedChange={setIsPriority} />
              </div>

              <div className="grid gap-2">
                <Label className="text-foreground font-medium">Tags</Label>
                <Popover open={showTagSuggestions && filteredSuggestions.length > 0}>
                  <PopoverTrigger asChild>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onFocus={() => setShowTagSuggestions(true)}
                        placeholder="Add tag"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          } else if (e.key === "Escape") {
                            setShowTagSuggestions(false);
                          }
                        }}
                        className="text-[16px] text-[#999999] border-none shadow-none px-0 h-auto focus-visible:ring-0 px-[8px] py-[4px]"
                      />
                      <Button type="button" onClick={() => addTag()} variant="outline">
                        Add
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-[var(--radix-popover-trigger-width)] p-0" 
                    align="start"
                    onInteractOutside={(e) => {
                      // Don't close when clicking the input or add button
                      const target = e.target as HTMLElement;
                      if (target.closest('input') || target.closest('button')) {
                        e.preventDefault();
                      } else {
                        setShowTagSuggestions(false);
                      }
                    }}
                  >
                    <Command>
                      <CommandList>
                        <CommandEmpty>No existing tags found</CommandEmpty>
                        <CommandGroup heading="Recent tags">
                          {filteredSuggestions.map((tag) => (
                            <CommandItem
                              key={tag}
                              value={tag}
                              onSelect={() => addTag(tag)}
                              className="lowercase cursor-pointer"
                            >
                              {tag}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1 lowercase">
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
                <Label className="text-foreground font-medium">Due Date</Label>
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
            </div>
          </div>
          <DrawerFooter className="flex-shrink-0 pt-2">
            <div className="flex flex-col gap-2 w-full">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2 w-full"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <div className="flex gap-2 w-full">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={!title.trim()} className="flex-1">
                  Save
                </Button>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

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
