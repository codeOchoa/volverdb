"use client";

import Link from "next/link";
import { useState } from "react";
import SalesTable from "@/components/SalesTable";
import ProductInput from "@/components/ProductInput";
import PaymentSection from "@/components/PaymentSection";
import CartSummary from "@/components/CartSummary";
import ConfirmDialog from "@/components/ConfirmDialog";
import ToastHost from "@/components/Toast";
import { useCart } from "@/store/useCart";
// import { formatARS } from "@/utils/formatCurrency";
// import { validateEAN } from "@/utils/validateEAN";
// import { getDateTime } from "@/utils/getDateTime";
// import { useConfirmDialog, useHotkeys, useToastMessage } from "@/hooks/index";

export default function SalesPage() {
    const [confirmLeave, setConfirmLeave] = useState(false);
    const clear = useCart(s => s.clear);
    // const { full } = getDateTime(); // "2025-10-17 15:24:02"
    // const { openConfirm, ConfirmDialogProps } = useConfirmDialog();
    // const { show } = useToastMessage();
    //     show("Producto añadido", "success");

    //     <ConfirmDialog {...ConfirmDialogProps} /> // Abrir:
    // openConfirm({ title:"Finalizar venta", message:"¿Confirmás?", onConfirm: handleFinish });

    // useHotkeys({
    //     onClear: handleClearCart,
    //     onFinish: handleFinalizeSale,
    //     onCancel: closeModal,
    // });

    // if (!validateEAN(ean)) {
    //     toast.err("Código inválido");
    //     return;
    // }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-center relative mb-4">
                    <h1 className="text-3xl font-bold tracking-wide">CARRITO</h1>
                    <button onClick={() => setConfirmLeave(true)}
                        className="absolute right-0 w-10 h-10 rounded-xl border flex items-center justify-center">⚙️</button>
                </div>

                {/* Table */}
                <SalesTable />

                {/* Bottom controls */}
                <div className="grid grid-cols-12 gap-6 mt-6">
                    <div className="col-span-8">
                        <ProductInput />
                        <PaymentSection />
                    </div>

                    <div className="col-span-4">
                        <CartSummary />
                    </div>
                </div>
            </div>

            <ConfirmDialog open={confirmLeave}
                title="Salir al dashboard"
                message="Si sales del Carrito, este será eliminado."
                confirmText="Continuar"
                onCancel={() => setConfirmLeave(false)}
                onConfirm={() => {
                    setConfirmLeave(false);
                    clear();
                    window.location.href = "/dashboard";
                }} />

            <ToastHost />
        </div>
    );
}