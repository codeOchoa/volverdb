"use client";

export default function ConfirmDialog({ open, title, message, confirmText = "Continuar", cancelText = "Cancelar", onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-2xl p-6 w-[420px] shadow-xl">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-5">{message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg border"> {cancelText} </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-black text-white"> {confirmText} </button>
                </div>
            </div>
        </div>
    );
}