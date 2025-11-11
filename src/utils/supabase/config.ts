// Supabase configuration with environment variable support

// Get Supabase URL from environment or use default
const url = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) 
  || "https://gxkyjoarsetogfejoask.supabase.co";

// Extract project ID from URL
export const projectId = url.replace('https://', '').replace('.supabase.co', '');

// Get anon key from environment or use default
export const publicAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY)
  || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4a3lqb2Fyc2V0b2dmZWpvYXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNzUzMTEsImV4cCI6MjA3Nzk1MTMxMX0.NVhaj7ZjJSwOlzU_oBl6q0A8NVcbTbW2k5OKK4HhN04";

// Full Supabase URL
export const supabaseUrl = url;
