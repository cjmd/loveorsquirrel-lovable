import { useEffect } from 'react';
import { Task } from '../App';

function calculateBadgeCount(tasks: Task[]): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return tasks.filter(task => {
    if (task.completed) return false;
    
    const isPriority = task.isPriority;
    const isOverdue = task.dueDate ? new Date(task.dueDate) < now : false;
    
    return isPriority || isOverdue;
  }).length;
}

export function useBadgeUpdater(tasks: Task[]) {
  useEffect(() => {
    if (!('setAppBadge' in navigator)) return;

    const count = calculateBadgeCount(tasks);

    if (count > 0) {
      (navigator as any).setAppBadge(count).catch(() => {});
    } else {
      (navigator as any).clearAppBadge?.().catch(() => {});
    }
  }, [tasks]);

  // Also update on visibility change
  useEffect(() => {
    if (!('setAppBadge' in navigator)) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const count = calculateBadgeCount(tasks);
        if (count > 0) {
          (navigator as any).setAppBadge(count).catch(() => {});
        } else {
          (navigator as any).clearAppBadge?.().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [tasks]);
}
