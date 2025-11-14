import { useState } from "react";
import { Task, ViewType } from "../App";
import { TaskItem } from "./TaskItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Archive, Settings, ArrowUpDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

type ArchiveViewProps = {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onViewChange: (view: ViewType) => void;
  onOpenSettingsMenu: () => void;
  workspaceMembers?: Record<string, string>;
};

type FilterBy = "all" | "todos" | "shopping";
type SortBy = "completedAt" | "createdAt" | "dueDate";

export function ArchiveView({ tasks, onTaskClick, onTaskToggle, onViewChange, onOpenSettingsMenu, workspaceMembers = {} }: ArchiveViewProps) {
  const [filterBy, setFilterBy] = useState<FilterBy>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("completedAt");

  // Only show completed tasks
  const completedTasks = tasks.filter((task) => task.completed);

  // Get all unique tags from completed tasks
  const allTags = Array.from(new Set(completedTasks.flatMap(task => task.tags))).sort();

  // Filter by type and tag
  const filteredTasks = completedTasks.filter((task) => {
    // Filter by type
    let typeMatch = true;
    if (filterBy === "todos") typeMatch = task.type === "todo";
    else if (filterBy === "shopping") typeMatch = task.type === "shopping";
    
    // Filter by tag
    const tagMatch = selectedTag === "all" || task.tags.includes(selectedTag);
    
    return typeMatch && tagMatch;
  });

  // Sort completed tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "completedAt") return b.updatedAt - a.updatedAt;
    if (sortBy === "createdAt") return b.createdAt - a.createdAt;
    if (sortBy === "dueDate") {
      if (!a.dueDate && !b.dueDate) return b.updatedAt - a.updatedAt;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  return (
    <div className="size-full">
      <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-[90px] pt-[60px] px-[16px] relative size-full">
        {/* Header */}
        <div className="content-stretch flex items-start justify-between leading-[normal] not-italic relative shrink-0 text-[24px] text-nowrap w-full whitespace-pre">
            <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-[234px]">
              <Archive className="relative shrink-0 text-[#ff9500]" size={24} />
              <p className="relative shrink-0 text-foreground">Archive</p>
            </div>
            <button 
              onClick={onOpenSettingsMenu}
              className="relative shrink-0 text-foreground"
            >
              <Settings size={24} />
            </button>
        </div>

        {/* Filters */}
        <div className="flex gap-[8px] w-full items-center flex-wrap">
            <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterBy)}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue />
              </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="todos">To-dos</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
            </SelectContent>
          </Select>

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="All tags" />
              </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag} className="lowercase">
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="ml-auto shrink-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem onClick={() => setSortBy("completedAt")}>
                Completed Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("createdAt")}>
                Date Created
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("dueDate")}>
                Due Date
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Task list */}
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onToggle={(completed) => onTaskToggle(task.id, completed)}
              showTypeIcon={true}
              assigneeName={task.assignedTo ? workspaceMembers[task.assignedTo] : null}
            />
          ))}
        </div>

          {sortedTasks.length === 0 && (
            <div className="flex items-center justify-center w-full pt-20">
              <p className="text-muted-foreground">
                {filterBy === "all"
                  ? "No completed tasks yet"
                  : `No completed ${filterBy} yet`}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
