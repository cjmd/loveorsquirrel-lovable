import { useState, useEffect } from "react";
import { Task, ViewType } from "../App";
import { TaskItem } from "./TaskItem";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ShoppingCart, Settings } from "lucide-react";

type ShoppingViewProps = {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onReorder: (taskOrders: { id: string; order: number }[]) => void;
  onViewChange: (view: ViewType) => void;
  onOpenSettingsMenu: () => void;
};

type FilterBy = "all" | "active" | "completed" | "priority";

function DraggableTaskItem({
  task,
  index,
  moveTask,
  onClick,
  onToggle,
}: {
  task: Task;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  onClick: () => void;
  onToggle: (completed: boolean) => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "task",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveTask(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }} className="w-full">
      <TaskItem task={task} onClick={onClick} onToggle={onToggle} />
    </div>
  );
}

export function ShoppingView({ tasks, onTaskClick, onTaskToggle, onReorder, onViewChange, onOpenSettingsMenu }: ShoppingViewProps) {
  const [filterBy, setFilterBy] = useState<FilterBy>("active");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [localTasks, setLocalTasks] = useState(tasks);

  // Update local tasks when props change
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Get all unique tags from tasks
  const allTags = Array.from(new Set(localTasks.flatMap(task => task.tags))).sort();

  // Filter tasks
  const filteredTasks = localTasks.filter((task) => {
    // Filter by status
    let statusMatch = true;
    if (filterBy === "active") statusMatch = !task.completed;
    else if (filterBy === "completed") statusMatch = task.completed;
    else if (filterBy === "priority") statusMatch = task.isPriority && !task.completed;
    
    // Filter by tag
    const tagMatch = selectedTag === "all" || task.tags.includes(selectedTag);
    
    return statusMatch && tagMatch;
  });

  // Sort by order
  const sortedTasks = [...filteredTasks].sort((a, b) => a.order - b.order);

  const moveTask = (dragIndex: number, hoverIndex: number) => {
    const dragTask = sortedTasks[dragIndex];
    const newTasks = [...sortedTasks];
    newTasks.splice(dragIndex, 1);
    newTasks.splice(hoverIndex, 0, dragTask);

    // Update orders
    const taskOrders = newTasks.map((task, index) => ({
      id: task.id,
      order: index,
    }));

    setLocalTasks(newTasks);
    onReorder(taskOrders);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-[90px] pt-[60px] px-[16px] relative size-full">
          {/* Header */}
          <div className="content-stretch flex items-start justify-between leading-[normal] not-italic relative shrink-0 text-[24px] text-nowrap w-full whitespace-pre">
            <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-[234px]">
              <ShoppingCart className="relative shrink-0 text-[#66d575]" size={24} />
              <p className="relative shrink-0 text-foreground">Shopping</p>
            </div>
            <button 
              onClick={onOpenSettingsMenu}
              className="relative shrink-0 text-foreground"
            >
              <Settings size={24} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-[8px] w-full items-center">
            <div className="flex gap-[4px] bg-muted rounded-lg p-[2px]">
              <button
                onClick={() => setFilterBy("active")}
                className={`px-[16px] py-[6px] rounded-md transition-colors ${
                  filterBy === "active"
                    ? "bg-background text-foreground shadow-sm"
                    : "bg-transparent text-muted-foreground"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterBy("priority")}
                className={`px-[16px] py-[6px] rounded-md transition-colors ${
                  filterBy === "priority"
                    ? "bg-background text-foreground shadow-sm"
                    : "bg-transparent text-muted-foreground"
                }`}
              >
                Priority
              </button>
            </div>
            
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-[140px] bg-background">
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
            {sortedTasks.map((task, index) => (
              <DraggableTaskItem
                key={task.id}
                task={task}
                index={index}
                moveTask={moveTask}
                onClick={() => onTaskClick(task)}
                onToggle={(completed) => onTaskToggle(task.id, completed)}
              />
            ))}
          </div>

          {sortedTasks.length === 0 && (
            <div className="flex items-center justify-center w-full pt-20">
              <p className="text-muted-foreground">
                {filterBy === "all"
                  ? "No shopping items yet. Tap + to add one!"
                  : `No ${filterBy} shopping items`}
              </p>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
