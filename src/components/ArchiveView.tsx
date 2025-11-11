import { useState } from "react";
import { Task, ViewType } from "../App";
import { TaskItem } from "./TaskItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Archive, Settings } from "lucide-react";

type ArchiveViewProps = {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onViewChange: (view: ViewType) => void;
  onOpenSettingsMenu: () => void;
};

type FilterBy = "all" | "todos" | "shopping";

export function ArchiveView({ tasks, onTaskClick, onTaskToggle, onViewChange, onOpenSettingsMenu }: ArchiveViewProps) {
  const [filterBy, setFilterBy] = useState<FilterBy>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

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

  // Sort by completion time (most recent first)
  const sortedTasks = [...filteredTasks].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="size-full">
      <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-[90px] pt-[60px] px-[16px] relative size-full">
        {/* Header */}
        <div className="content-stretch flex items-start justify-between leading-[normal] not-italic relative shrink-0 text-[24px] text-nowrap w-full whitespace-pre">
          <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-[234px]">
            <Archive className="relative shrink-0 text-[#ff9500]" size={24} />
            <p className="relative shrink-0 text-[#333333]">Archive</p>
          </div>
          <button 
            onClick={onOpenSettingsMenu}
            className="relative shrink-0 text-[#333333]"
          >
            <Settings size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-[8px] w-full flex-wrap">
          <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterBy)}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="todos">To-dos</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="All tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            />
          ))}
        </div>

        {sortedTasks.length === 0 && (
          <div className="flex items-center justify-center w-full pt-20">
            <p className="text-[#999999]">
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
