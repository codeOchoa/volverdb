"use client";

import { useCart } from "@/store/useCart";

const methods = ["Efectivo", "QR", "Tarjeta Debito", "Tarjeta Credito", "Transferencia", "NFC", "Link", "Otros"];

export default function PaymentSection() {
    const method = useCart(s => s.paymentMethod);
    const setMethod = useCart(s => s.setPaymentMethod);
    return (
        <div className="mt-4">
            <label className="block text-sm font-semibold mb-1 bg-black text-white rounded-t-xl px-4 py-2">
                Metodo de Pago
            </label>
            <select value={method} onChange={e => setMethod(e.target.value)}
                className="w-full border rounded-b-xl px-4 py-3">
                {methods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
        </div>
    );
}