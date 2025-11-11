import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Plus, Home, ListChecks, ShoppingCart, Archive } from "lucide-react";
import { Task, ViewType } from "../App";
import { HomeView } from "../components/HomeView";
import { TodosView } from "../components/TodosView";
import { ShoppingView } from "../components/ShoppingView";
import { ArchiveView } from "../components/ArchiveView";
import { AddTaskDialog } from "../components/AddTaskDialog";
import { TaskDetailsDialog } from "../components/TaskDetailsDialog";
import { SettingsMenu } from "../components/SettingsMenu";
import { AuthDialog } from "../components/AuthDialog";
import { PWAInstaller } from "../components/PWAInstaller";
import { InstallPrompt } from "../components/InstallPrompt";
import { supabaseUrl, publicAnonKey, projectId } from "../utils/supabase/config";

const supabase = createClient(supabaseUrl, publicAnonKey);

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [defaultTaskType, setDefaultTaskType] = useState<"todo" | "shopping">("todo");

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-dcb5bd28`;

  // Load user and tasks on mount
  useEffect(() => {
    checkAuth();
    loadTasks();
  }, []);

  const checkAuth = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const response = await fetch(`${baseUrl}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser({ email: data.user.email, name: data.user.name });
      } else {
        localStorage.removeItem("access_token");
      }
    } catch (error) {
      console.error("Auth check error:", error);
    }
  };

  const loadTasks = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      // Load from localStorage if not logged in
      const localTasks = localStorage.getItem("tasks");
      if (localTasks) {
        setTasks(JSON.parse(localTasks));
      }
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/tasks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title || "",
      details: taskData.details || null,
      completed: false,
      type: taskData.type || "todo",
      isPriority: taskData.isPriority || false,
      tags: taskData.tags || [],
      dueDate: taskData.dueDate || null,
      order: tasks.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      // Save locally if not logged in
      saveTasks([...tasks, newTask]);
      toast.success("Task created");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks([...tasks, data.task]);
        toast.success("Task created");
      } else {
        toast.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    const accessToken = localStorage.getItem("access_token");
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates, updatedAt: Date.now() } : task,
    );

    if (!accessToken) {
      saveTasks(updatedTasks);
      toast.success("Task updated");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setTasks(updatedTasks);
        toast.success("Task updated");
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const accessToken = localStorage.getItem("access_token");
    const updatedTasks = tasks.filter((task) => task.id !== taskId);

    if (!accessToken) {
      saveTasks(updatedTasks);
      toast.success("Task deleted");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        setTasks(updatedTasks);
        toast.success("Task deleted");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    await handleUpdateTask(taskId, { completed });
  };

  const handleReorderTasks = async (taskOrders: { id: string; order: number }[]) => {
    const accessToken = localStorage.getItem("access_token");
    const updatedTasks = tasks.map((task) => {
      const orderUpdate = taskOrders.find((t) => t.id === task.id);
      return orderUpdate ? { ...task, order: orderUpdate.order } : task;
    });

    setTasks(updatedTasks);

    if (!accessToken) {
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return;
    }

    try {
      await fetch(`${baseUrl}/tasks/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ orders: taskOrders }),
      });
    } catch (error) {
      console.error("Error reordering tasks:", error);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${baseUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Sign up failed");
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      setUser({ email: data.user.email, name: data.user.name });
      toast.success("Account created successfully!");

      // Sync local tasks to server
      const localTasks = localStorage.getItem("tasks");
      if (localTasks) {
        const tasksToSync = JSON.parse(localTasks);
        for (const task of tasksToSync) {
          await fetch(`${baseUrl}/tasks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.access_token}`,
            },
            body: JSON.stringify(task),
          });
        }
      }

      await loadTasks();
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Sign up failed");
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${baseUrl}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Sign in failed");
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      setUser({ email: data.user.email, name: data.user.name });
      toast.success("Signed in successfully!");
      await loadTasks();
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Sign in failed");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setTasks([]);
    toast.success("Signed out successfully");
  };

  const handleAddTask = () => {
    setDefaultTaskType(currentView === "shopping" ? "shopping" : "todo");
    setIsAddDialogOpen(true);
  };

  // Filter tasks by type for each view
  const todoTasks = tasks.filter((task) => task.type === "todo");
  const shoppingTasks = tasks.filter((task) => task.type === "shopping");
  const allTasks = tasks;

  return (
    <>
      <PWAInstaller />
      <InstallPrompt />

      <div className="size-full bg-background relative">
        {/* Main content */}
        {currentView === "home" && (
          <HomeView
            tasks={tasks}
            onTaskClick={setSelectedTask}
            onTaskToggle={handleToggleTask}
            onViewChange={setCurrentView}
            onOpenSettingsMenu={() => setIsSettingsMenuOpen(true)}
          />
        )}

        {currentView === "todos" && (
          <TodosView
            tasks={todoTasks}
            onTaskClick={setSelectedTask}
            onTaskToggle={handleToggleTask}
            onReorder={handleReorderTasks}
            onViewChange={setCurrentView}
            onOpenSettingsMenu={() => setIsSettingsMenuOpen(true)}
          />
        )}

        {currentView === "shopping" && (
          <ShoppingView
            tasks={shoppingTasks}
            onTaskClick={setSelectedTask}
            onTaskToggle={handleToggleTask}
            onReorder={handleReorderTasks}
            onViewChange={setCurrentView}
            onOpenSettingsMenu={() => setIsSettingsMenuOpen(true)}
          />
        )}

        {currentView === "archive" && (
          <ArchiveView
            tasks={allTasks}
            onTaskClick={setSelectedTask}
            onTaskToggle={handleToggleTask}
            onViewChange={setCurrentView}
            onOpenSettingsMenu={() => setIsSettingsMenuOpen(true)}
          />
        )}

        {/* Floating Add Button */}
        <button
          onClick={handleAddTask}
          className="fixed bottom-[70px] left-1/2 -translate-x-1/2 w-[56px] h-[56px] rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg hover:opacity-90 transition-opacity z-50"
        >
          <Plus size={28} />
        </button>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border h-[60px] flex items-center justify-around px-[16px] z-40">
          <button
            onClick={() => setCurrentView("home")}
            className={`flex flex-col items-center gap-[4px] ${
              currentView === "home" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <Home size={24} />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => setCurrentView("todos")}
            className={`flex flex-col items-center gap-[4px] ${
              currentView === "todos" ? "text-[#3dadff]" : "text-muted-foreground"
            }`}
          >
            <ListChecks size={24} />
            <span className="text-[10px]">To-dos</span>
          </button>

          <button
            onClick={() => setCurrentView("shopping")}
            className={`flex flex-col items-center gap-[4px] ${
              currentView === "shopping" ? "text-[#66d575]" : "text-muted-foreground"
            }`}
          >
            <ShoppingCart size={24} />
            <span className="text-[10px]">Shopping</span>
          </button>

          <button
            onClick={() => setCurrentView("archive")}
            className={`flex flex-col items-center gap-[4px] ${
              currentView === "archive" ? "text-[#ff9500]" : "text-muted-foreground"
            }`}
          >
            <Archive size={24} />
            <span className="text-[10px]">Archive</span>
          </button>
        </div>

        {/* Dialogs */}
        <AddTaskDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onCreateTask={handleCreateTask}
          defaultType={defaultTaskType}
        />

        {selectedTask && (
          <TaskDetailsDialog
            task={selectedTask}
            open={!!selectedTask}
            onOpenChange={(open) => !open && setSelectedTask(null)}
            onUpdate={(updates) => handleUpdateTask(selectedTask.id, updates)}
            onDelete={() => handleDeleteTask(selectedTask.id)}
          />
        )}

        <SettingsMenu
          tasks={tasks}
          open={isSettingsMenuOpen}
          onOpenChange={setIsSettingsMenuOpen}
          user={user}
          onSignOut={handleSignOut}
          onOpenAuth={() => setIsAuthDialogOpen(true)}
        />

        <AuthDialog
          open={isAuthDialogOpen}
          onOpenChange={setIsAuthDialogOpen}
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
        />
      </div>
    </>
  );
};

export default Index;
