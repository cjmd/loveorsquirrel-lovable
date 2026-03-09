

## Problem

The `vaul` drawer (v0.9.x) captures the content height on mount and positions itself using `transform: translate3d()`. When "More options" expands via a CSS `max-height` transition, vaul doesn't re-measure — the drawer stays at its initial height and the expanded content is clipped below the viewport. The `resize` event dispatch workaround doesn't work reliably on mobile Safari/Chrome.

## Solution

**Remove the CSS max-height animation and instead toggle content visibility instantly.** This lets vaul's internal `ResizeObserver` detect the height change on the `DrawerContent` element and reposition the drawer naturally.

### Changes in `src/components/AddTaskDialog.tsx`

1. **Replace the `max-h` transition with a simple conditional render** — but wrap it so the DOM element stays mounted (avoiding the key-remount flicker). Use `display: none` / `display: block` instead of `max-height: 0` since `display` changes trigger layout reflow that vaul's ResizeObserver reliably detects:

```tsx
// Replace the max-h transition div with:
<div 
  ref={optionsContentRef}
  className="space-y-4 mt-4"
  style={{ display: isOptionsOpen ? 'block' : 'none' }}
>
  {/* ...all the option fields unchanged... */}
</div>
```

2. **Simplify the "More options" onClick handler** — remove the `resize` dispatch hacks since they're no longer needed. Keep the `blur()` and `scrollIntoView`:

```tsx
onClick={() => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  const next = !isOptionsOpen;
  setIsOptionsOpen(next);
  if (next) {
    setTimeout(() => {
      optionsContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}}
```

This is a minimal change — the transition is sacrificed for reliability. The drawer will snap to the new height instantly, which matches the desktop behavior shown in the video.

