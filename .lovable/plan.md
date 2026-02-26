

## Fix: Persist Default Workspace Preference in the Database

### Problem
The "default workspace" preference is currently stored only in `localStorage`. This means:
- It's lost when the user clears browser data or uses a different browser/device
- It doesn't sync across sessions on different devices
- After logging out and back in, the preference may be gone

### Solution
Store the default workspace preference in the `profiles` table by adding a `default_workspace_id` column, and update the app to read/write from the database instead of (or in addition to) localStorage.

### Technical Details

**1. Database Migration**
- Add a `default_workspace_id` column (nullable UUID) to the `profiles` table

**2. Update `SettingsMenu.tsx` - `handleSetDefaultWorkspace`**
- After toggling the default, save/clear the `default_workspace_id` in the `profiles` table via Supabase
- Keep localStorage as a fast cache, but treat the database as the source of truth

**3. Update `SettingsMenu.tsx` - `loadUserWorkspaces`**
- Read the default workspace from the `profiles` table instead of only localStorage
- Cache it to localStorage for quick access

**4. Update `Index.tsx` - `loadWorkspaceId`**
- In step 2 (checking default workspace), also fetch from the `profiles` table if localStorage has no value
- This ensures the preference works on new devices/browsers

