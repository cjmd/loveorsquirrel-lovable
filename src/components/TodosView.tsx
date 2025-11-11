import { useState, useEffect } from "react";
import { Task, ViewType } from "../App";
import { TaskItem } from "./TaskItem";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ListChecks, Settings } from "lucide-react";

type TodosViewProps = {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onReorder: (taskOrders: { id: string; order: number }[]) => void;
  onViewChange: (view: ViewType) => void;
  onOpenSettingsMenu: () => void;
};

type SortBy = "order" | "dueDate" | "priority";
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

export function TodosView({ tasks, onTaskClick, onTaskToggle, onReorder, onViewChange, onOpenSettingsMenu }: TodosViewProps) {
  const [sortBy, setSortBy] = useState<SortBy>("order");
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

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "order") return a.order - b.order;
    if (sortBy === "priority") {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return a.order - b.order;
    }
    if (sortBy === "dueDate") {
      if (!a.dueDate && !b.dueDate) return a.order - b.order;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

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
            <div className="content-stretch flex font-['DM_Sans'] gap-[10px] items-center relative shrink-0 w-[234px]">
              <ListChecks className="relative shrink-0 text-[#3dadff]" size={24} />
              <p className="relative shrink-0 text-[#333333]">To-dos</p>
            </div>
            <button 
              onClick={onOpenSettingsMenu}
              className="relative shrink-0 text-[#333333]"
            >
              <Settings size={24} />
            </button>
          </div>

          {/* Filters and sorting */}
          <div className="flex gap-[8px] w-full flex-wrap">
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
              <p className="font-['DM_Sans'] text-[#999999]">
                {filterBy === "all"
                  ? "No to-dos yet. Tap + to add one!"
                  : `No ${filterBy} to-dos`}
              </p>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
