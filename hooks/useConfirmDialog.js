"use client";

import { useState } from "react";

export default function useConfirmDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState({ title: "", message: "", onConfirm: null });

    const openConfirm = (opts) => {
        setConfig(opts);
        setIsOpen(true);
    };

    const closeConfirm = () => setIsOpen(false);

    const ConfirmDialogProps = {
        open: isOpen,
        title: config.title,
        message: config.message,
        onConfirm: () => {
            config.onConfirm?.();
            closeConfirm();
        },
        onCancel: closeConfirm,
    };

    return { openConfirm, closeConfirm, ConfirmDialogProps };
}