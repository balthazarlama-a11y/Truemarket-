import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    document.getElementById("root")!.innerHTML =
        '<div style="padding:40px;font-family:sans-serif;text-align:center"><h1>⚠️ Error de configuración</h1><p>Falta <code>VITE_CLERK_PUBLISHABLE_KEY</code> en las variables de entorno.</p><p style="color:#888">Agrégala en Vercel → Settings → Environment Variables y redeploy.</p></div>';
} else {
    createRoot(document.getElementById("root")!).render(
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <App />
        </ClerkProvider>
    );
}
