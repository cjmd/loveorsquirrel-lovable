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
    const count = calculateBadgeCount(tasks);
    
    console.log('[Badge] API supported:', 'setAppBadge' in navigator);
    console.log('[Badge] Priority/overdue count:', count);
    console.log('[Badge] Is standalone PWA:', window.matchMedia('(display-mode: standalone)').matches);
    
    if (!('setAppBadge' in navigator)) {
      console.log('[Badge] Badging API not supported in this browser');
      return;
    }

    if (count > 0) {
      (navigator as any).setAppBadge(count)
        .then(() => console.log('[Badge] Successfully set badge to', count))
        .catch((err: Error) => console.log('[Badge] Failed to set badge:', err.message));
    } else {
      (navigator as any).clearAppBadge?.()
        .then(() => console.log('[Badge] Successfully cleared badge'))
        .catch((err: Error) => console.log('[Badge] Failed to clear badge:', err.message));
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
