"use client";

import { useRouter } from "next/navigation";

export function useLogout() {
    const router = useRouter();

    const logout = async () => {
        try {
            await fetch("/api/logout", { method: "POST" });
            router.replace("/login");
        } catch (err) {
            console.error("Error al cerrar sesion:", err);
            router.replace("/login");
        }
    };

    return logout;
}