import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. please check your Vercel environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase credentials. Please check your environment variables.");
  }
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("Rendering error:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; background: #070b14; color: white; font-family: sans-serif;">
      <h1>Application Error</h1>
      <p>Something went wrong while loading the application.</p>
      <pre style="background: #1a1f2e; padding: 10px; border-radius: 4px;">${error instanceof Error ? error.message : String(error)}</pre>
      <p>Please check the console for more details.</p>
    </div>
  `;
}
