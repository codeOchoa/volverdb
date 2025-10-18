"use client";

import { toast } from "@/components/Toast";

export default function useToastMessage() {
    const show = (msg, type = "info") => {
        if (type === "error") toast.err(msg);
        else if (type === "warn") toast.warn(msg);
        else if (type === "success") toast.ok(msg);
        else toast.info(msg);
    };
    return { show };
}