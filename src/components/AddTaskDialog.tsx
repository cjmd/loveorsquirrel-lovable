import { useState, useEffect } from "react";
import { Task } from "../App";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "./ui/drawer";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { X, ListChecks, ShoppingCart } from "lucide-react";
type AddTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: Partial<Task>) => void;
  defaultType?: "todo" | "shopping";
};
export function AddTaskDialog({
  open,
  onOpenChange,
  onCreateTask,
  defaultType = "todo"
}: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [type, setType] = useState<"todo" | "shopping">(defaultType);
  const [isPriority, setIsPriority] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Update type when dialog opens with new defaultType
  useEffect(() => {
    if (open) {
      setType(defaultType);
    }
  }, [open, defaultType]);
  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreateTask({
      title: title.trim(),
      details: details.trim(),
      type,
      isPriority,
      tags,
      dueDate: dueDate?.toISOString() || null
    });

    // Reset form
    setTitle("");
    setDetails("");
    setType(defaultType);
    setIsPriority(false);
    setTags([]);
    setTagInput("");
    setDueDate(undefined);
    onOpenChange(false);
  };
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  return <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="sr-only">Add New Task</DrawerTitle>
          <DrawerDescription className="sr-only">Create a new task with title, details, and options</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6 overflow-y-auto flex-1">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="New reminder" onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }} autoFocus className="text-[20px] text-[#999999] border-none shadow-none px-0 h-auto focus-visible:ring-0 px-[8px] py-[4px]" />
              <Input value={details} onChange={e => setDetails(e.target.value)} placeholder="Details" className="text-[16px] text-[#999999] border-none shadow-none px-0 h-auto focus-visible:ring-0 px-[8px] py-[4px]" onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }} />
            </div>
            <div className="grid gap-2">
              <Label className="text-foreground font-medium">Type</Label>
              <div className="flex gap-2">
                <Button type="button" variant={type === "todo" ? "default" : "outline"} onClick={() => setType("todo")} className="flex-1">
                  <ListChecks className="mr-2" size={16} /> To-do
                </Button>
                <Button type="button" variant={type === "shopping" ? "default" : "outline"} onClick={() => setType("shopping")} className="flex-1">
                  <ShoppingCart className="mr-2" size={16} /> Shopping
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <Label htmlFor="priority" className="text-foreground font-medium">
                Priority
              </Label>
              <Switch id="priority" checked={isPriority} onCheckedChange={setIsPriority} />
            </div>

            <div className="grid gap-2">
              <Label className="text-foreground font-medium">Tags</Label>
              <div className="flex gap-2">
                <Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add tag" onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }} className="text-[16px] text-[#999999] border-none shadow-none px-0 h-auto focus-visible:ring-0 px-[8px] py-[4px]" />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              {tags.length > 0 && <div className="flex flex-wrap gap-2">
                  {tags.map(tag => <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>)}
                </div>}
            </div>

            <div className="grid gap-2">
              <Label className="text-foreground font-medium">Due Date</Label>
              <Popover modal={true} open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="justify-start text-[16px] text-foreground border-none shadow-none px-[8px] h-auto font-normal hover:bg-transparent">
                    {dueDate ? dueDate.toLocaleDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[100]" align="start">
                  <Calendar mode="single" selected={dueDate} onSelect={date => {
                  setDueDate(date);
                  setIsDatePickerOpen(false);
                }} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!title.trim()}>
                Create Task
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>;
}