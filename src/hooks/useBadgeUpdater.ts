import { useEffect } from 'react';
import { Task } from '../App';

function calculateBadgeCount(tasks: Task[]): number {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return tasks.filter(task => {
    if (task.completed) return false;
    
    const isPriority = task.isPriority;
    const isDueOrOverdue = task.dueDate ? new Date(task.dueDate) <= endOfToday : false;
    
    return isPriority || isDueOrOverdue;
  }).length;
}

export function useBadgeUpdater(tasks: Task[]) {
  useEffect(() => {
    const count = calculateBadgeCount(tasks);
    
    if (!('setAppBadge' in navigator)) {
      return;
    }

    if (count > 0) {
      (navigator as any).setAppBadge(count).catch(() => {});
    } else {
      (navigator as any).clearAppBadge?.().catch(() => {});
    }
  }, [tasks]);

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
