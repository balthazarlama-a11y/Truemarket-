import { useUser, useClerk } from "@clerk/clerk-react";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: "user" | "business";
    imageUrl: string;
}

export function useAuth() {
    const { user, isLoaded, isSignedIn } = useUser();
    const clerk = useClerk();

    const authUser: AuthUser | null =
        isLoaded && isSignedIn && user
            ? {
                id: user.id,
                email: user.primaryEmailAddress?.emailAddress || "",
                name: user.fullName || user.firstName || "",
                role: (user.publicMetadata?.role as "user" | "business") || "user",
                imageUrl: user.imageUrl,
            }
            : null;

    return {
        user: authUser,
        isLoading: !isLoaded,
        isSignedIn: !!isSignedIn,
        signOut: () => clerk.signOut(),
    };
}
