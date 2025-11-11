import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Download, X } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-4 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-stone-900">Install love or squirrel</p>
          <p className="text-xs text-stone-600 mt-0.5">Add to home screen for easy access</p>
        </div>
        <Button
          onClick={handleInstallClick}
          size="sm"
          className="bg-stone-900 hover:bg-stone-800"
        >
          <Download className="w-4 h-4 mr-2" />
          Install
        </Button>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-stone-600" />
        </button>
      </div>
    </div>
  );
}
