"use client";

import { useEffect } from "react";

/**
 * Hook para escuchar teclas globales (F2, F10, ESC, Enter, etc.)
 * @param {Object} actions - mapa de acciones: { key: fn }
 */
export default function useHotkeys(actions = {}) {
    useEffect(() => {
        const handler = (e) => {
            const key = e.key.toLowerCase();
            if (key === "f2" && actions.onClear) {
                e.preventDefault();
                actions.onClear();
            }
            if (key === "f10" && actions.onFinish) {
                e.preventDefault();
                actions.onFinish();
            }
            if (key === "escape" && actions.onCancel) {
                e.preventDefault();
                actions.onCancel();
            }
            if (key === "enter" && actions.onEnter) {
                actions.onEnter();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [actions]);
}