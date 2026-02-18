import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

// ── Types ────────────────────────────────────────────────────
interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: "buyer" | "seller";
    createdAt: string | null;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    loginMutation: ReturnType<typeof useLoginMutation>;
    registerMutation: ReturnType<typeof useRegisterMutation>;
    registerCompanyMutation: ReturnType<typeof useRegisterCompanyMutation>;
    logoutMutation: ReturnType<typeof useLogoutMutation>;
}

// ── Mutations ────────────────────────────────────────────────
function useLoginMutation() {
    const [, setLocation] = useLocation();
    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            const res = await apiRequest("POST", "/api/auth/login", data);
            return res.json();
        },
        onSuccess: (user: AuthUser) => {
            queryClient.setQueryData(["/api/auth/user"], user);
            if (user.role === "seller") {
                setLocation("/dashboard");
            } else {
                setLocation("/");
            }
        },
    });
}

function useRegisterMutation() {
    const [, setLocation] = useLocation();
    return useMutation({
        mutationFn: async (data: { email: string; name: string; password: string }) => {
            const res = await apiRequest("POST", "/api/auth/register", data);
            return res.json();
        },
        onSuccess: (user: AuthUser) => {
            queryClient.setQueryData(["/api/auth/user"], user);
            setLocation("/");
        },
    });
}

function useRegisterCompanyMutation() {
    const [, setLocation] = useLocation();
    return useMutation({
        mutationFn: async (data: Record<string, string>) => {
            const res = await apiRequest("POST", "/api/auth/register-company", data);
            return res.json();
        },
        onSuccess: (user: AuthUser) => {
            queryClient.setQueryData(["/api/auth/user"], user);
            setLocation("/dashboard");
        },
    });
}

function useLogoutMutation() {
    const [, setLocation] = useLocation();
    return useMutation({
        mutationFn: async () => {
            await apiRequest("POST", "/api/auth/logout");
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/auth/user"], null);
            setLocation("/");
        },
    });
}

// ── Context ──────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const {
        data: user,
        isLoading,
    } = useQuery<AuthUser | null>({
        queryKey: ["/api/auth/user"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/auth/user", { credentials: "include" });
                if (res.status === 401) return null;
                if (!res.ok) throw new Error("Failed to fetch user");
                return res.json();
            } catch {
                return null;
            }
        },
        staleTime: Infinity,
        retry: false,
    });

    const loginMutation = useLoginMutation();
    const registerMutation = useRegisterMutation();
    const registerCompanyMutation = useRegisterCompanyMutation();
    const logoutMutation = useLogoutMutation();

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                isLoading,
                loginMutation,
                registerMutation,
                registerCompanyMutation,
                logoutMutation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
