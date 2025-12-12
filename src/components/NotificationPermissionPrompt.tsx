import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/App';

interface NotificationPermissionPromptProps {
  tasks: Task[];
}

function calculatePriorityCount(tasks: Task[]): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return tasks.filter(task => {
    if (task.completed) return false;
    
    const isPriority = task.isPriority;
    const isOverdue = task.dueDate ? new Date(task.dueDate) < now : false;
    
    return isPriority || isOverdue;
  }).length;
}

export function NotificationPermissionPrompt({ tasks }: NotificationPermissionPromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      setPermissionState('unsupported');
      return;
    }

    setPermissionState(Notification.permission);
  }, []);

  const priorityCount = calculatePriorityCount(tasks);

  // Don't show if:
  // - No priority/overdue tasks
  // - Notifications not supported
  // - Permission already granted or denied
  // - User dismissed the prompt this session
  // - Not a PWA (standalone mode)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  if (
    priorityCount === 0 ||
    permissionState === 'unsupported' ||
    permissionState === 'granted' ||
    permissionState === 'denied' ||
    dismissed ||
    !isStandalone
  ) {
    return null;
  }

  const handleRequestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermissionState(result);
    } catch {
      // Permission request failed
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 bg-card border border-border rounded-xl p-4 shadow-lg z-50 animate-in slide-in-from-top-2 duration-300">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
      >
        <X size={18} />
      </button>
      
      <div className="flex items-start gap-3 pr-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bell className="text-primary" size={20} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-foreground text-sm">
            Enable badge notifications
          </h3>
          <p className="text-muted-foreground text-xs mt-1">
            You have {priorityCount} priority {priorityCount === 1 ? 'task' : 'tasks'}. Enable notifications to see a badge on the app icon.
          </p>
          
          <Button
            onClick={handleRequestPermission}
            size="sm"
            className="mt-3"
          >
            Enable
          </Button>
        </div>
      </div>
    </div>
  );
}
