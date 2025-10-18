"use client";

import { create } from "zustand";
import { useEffect } from "react";

const useToast = create((set) => ({
    toasts: [],
    push: (msg, kind = "info") => {
        const id = crypto.randomUUID();
        set(s => ({ toasts: [...s.toasts, { id, msg, kind }] }));
        setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 2200);
    }
}));
export const toast = {
    info: (m) => useToast.getState().push(m, "info"),
    ok: (m) => useToast.getState().push(m, "ok"),
    warn: (m) => useToast.getState().push(m, "warn"),
    err: (m) => useToast.getState().push(m, "err"),
};

export default function ToastHost() {
    const toasts = useToast(s => s.toasts);
    useEffect(() => { }, [toasts]);
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 space-y-2 z-50">
            {toasts.map(t => (
                <div key={t.id}
                    className="px-4 py-2 rounded-xl shadow bg-black/85 text-white text-sm">
                    {t.msg}
                </div>
            ))}
        </div>
    );
}