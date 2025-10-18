"use client";

import { useState } from "react";
import { useCart } from "@/store/useCart";
import ConfirmDialog from "./ConfirmDialog";
import AdjustDialog from "./AdjustDialog";
import { toast } from "./Toast";

export default function CartSummary() {
    const subtotal = useCart(s => s.subtotal());
    const adj = useCart(s => s.adjValue());
    const total = useCart(s => s.total());
    const items = useCart(s => s.items);
    const clear = useCart(s => s.clear);
    const adjustment = useCart(s => s.adjustment);
    const setAdjustment = useCart(s => s.setAdjustment);
    const paymentMethod = useCart(s => s.paymentMethod);

    const [confirmClear, setConfirmClear] = useState(false);
    const [confirmFinish, setConfirmFinish] = useState(false);
    const [openDesc, setOpenDesc] = useState(false);
    const [openRec, setOpenRec] = useState(false);

    const finalize = async () => {
        setConfirmFinish(false);
        if (items.length === 0) { toast.warn("No hay productos en el carrito"); return; }
        const payload = {
            date: new Date().toISOString(),
            items, paymentMethod,
            subtotal, adjustment: adj, total
        };
        const res = await fetch("/api/sales", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (res.ok) { toast.ok("Venta registrada"); clear(); }
        else { toast.err("No se pudo registrar la venta"); }
    };

    return (
        <>
            <div className="bg-black text-white rounded-2xl p-4 space-y-1">
                <div className="flex justify-between text-sm opacity-80">
                    <span>Subtotal</span><span>${subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm opacity-80">
                    <span>{adjustment.label}</span>
                    <span>${adj.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-end mt-2">
                    <div className="text-2xl font-semibold">Total</div>
                    <div className="text-3xl font-bold">${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
                <button onClick={() => setOpenDesc(true)} className="px-4 py-3 rounded-xl border bg-gray-100">Descuento</button>
                <button onClick={() => setOpenRec(true)} className="px-4 py-3 rounded-xl border bg-gray-100">Recargo</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
                <button onClick={() => setConfirmClear(true)} className="px-4 py-3 rounded-xl bg-red-600 text-white">Limpiar carrito</button>
                <button onClick={() => setConfirmFinish(true)} className="px-4 py-3 rounded-xl bg-green-600 text-white">Finalizar venta</button>
            </div>

            {/* Modales */}
            <ConfirmDialog
                open={confirmClear}
                title="Limpiar carrito"
                message="¿Seguro que deseas eliminar todos los productos del carrito?"
                confirmText="Eliminar"
                onConfirm={() => { setConfirmClear(false); clear(); toast.info("Carrito vacío"); }}
                onCancel={() => setConfirmClear(false)}
            />
            <ConfirmDialog
                open={confirmFinish}
                title="Finalizar venta"
                message="¿Confirmás el registro de la venta?"
                confirmText="Finalizar"
                onConfirm={finalize}
                onCancel={() => setConfirmFinish(false)}
            />
            <AdjustDialog
                open={openDesc}
                mode="descuento"
                initial={adjustment}
                onSave={(adj) => { setAdjustment(adj); setOpenDesc(false); }}
                onClose={() => setOpenDesc(false)}
            />
            <AdjustDialog
                open={openRec}
                mode="recargo"
                initial={adjustment}
                onSave={(adj) => { setAdjustment(adj); setOpenRec(false); }}
                onClose={() => setOpenRec(false)}
            />
        </>
    );
}