import { Task } from "../App";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Flag, ListChecks, ShoppingCart } from "lucide-react";
import { useState } from "react";

type TaskItemProps = {
  task: Task;
  onClick: () => void;
  onToggle: (completed: boolean) => void;
  showTypeIcon?: boolean;
};

export function TaskItem({ task, onClick, onToggle, showTypeIcon = false }: TaskItemProps) {
  const [isChecking, setIsChecking] = useState(false);
  const displayCompleted = task.completed || isChecking;

  const handleToggle = (completed: boolean) => {
    if (!task.completed && completed) {
      // Show checked state first
      setIsChecking(true);
      setTimeout(() => {
        onToggle(completed);
      }, 600);
    } else {
      onToggle(completed);
    }
  };

  return (
    <div
      className="box-border content-stretch flex gap-[8px] items-start bg-card p-[12px] px-[16px] py-[12px] relative shrink-0 w-full rounded-[8px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] cursor-pointer hover:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.12)] transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start gap-[12px] w-full">
        <div className="flex items-center gap-[4px] shrink-0 pt-[2px]">
          {task.isPriority && !task.completed && (
            <Flag className="text-[#f24822]" size={16} />
          )}
          {showTypeIcon && (
            task.type === "todo" ? (
              <ListChecks className="text-[#3dadff]" size={16} />
            ) : (
              <ShoppingCart className="text-[#66d575]" size={16} />
            )
          )}
        </div>
        <div className="flex flex-col gap-[4px] flex-1 min-w-0">
          <div className="flex items-start gap-[8px]">
            <p
              className={`text-[16px] flex-1 break-words ${
                displayCompleted ? "line-through text-muted-foreground" : "text-foreground"
              }`}
            >
              {task.title}
            </p>
          </div>
          {task.details && (
            <p className="text-[14px] text-muted-foreground break-words">
              {task.details}
            </p>
          )}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-[4px] mt-[4px]">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[11px] px-[6px] py-[2px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {task.dueDate && !task.completed && (
            <p className="text-[12px] text-muted-foreground mt-[2px]">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <div
          className="flex items-center justify-center relative shrink-0 -mr-2 -my-2 p-3 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleToggle(!task.completed);
          }}
        >
          <Checkbox checked={displayCompleted} />
        </div>
      </div>
    </div>
  );
}
