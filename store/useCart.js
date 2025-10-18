"use client";

import { create } from "zustand";

const calcSubtotal = (items) => items.reduce((a, i) => a + i.price * i.qty, 0);
const applyAdj = (subtotal, adj) => {
    if (!adj) return 0;
    const { type, value } = adj; // type: "monto" | "porcentaje", value: number (positivo/descuento, negativo/recargo? usaremos signo)
    if (type === "monto") return value;
    if (type === "porcentaje") return subtotal * (value / 100);
    return 0;
};

export const useCart = create((set, get) => ({
    items: [],
    paymentMethod: "Efectivo",
    adjustment: { label: "Descuento / Recargo", value: 0, type: "monto" }, // puede ser negativo (recargo) o positivo (descuento negativo) según el signo que apliquemos
    addItem: (prod, qty = 1) => {
        const items = [...get().items];
        const idx = items.findIndex(i => i.ean === prod.ean);
        if (idx >= 0) { items[idx].qty += qty; }
        else { items.push({ ean: prod.ean, name: prod.detalle, price: prod.precio, qty }); }
        set({ items });
    },
    inc: (ean) => set({ items: get().items.map(i => i.ean === ean ? { ...i, qty: i.qty + 1 } : i) }),
    dec: (ean) => set({ items: get().items.map(i => i.ean === ean && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i) }),
    setQty: (ean, qty) => set({ items: get().items.map(i => i.ean === ean ? { ...i, qty: Math.max(1, Number(qty) || 1) } : i) }),
    remove: (ean) => set({ items: get().items.filter(i => i.ean !== ean) }),
    clear: () => set({ items: [], adjustment: { label: "Descuento / Recargo", value: 0, type: "monto" } }),
    setPaymentMethod: (m) => set({ paymentMethod: m }),
    setAdjustment: (adj) => set({ adjustment: adj }),
    subtotal: () => calcSubtotal(get().items),
    adjValue: () => applyAdj(get().subtotal(), get().adjustment),
    total: () => {
        const sub = get().subtotal();
        const adj = get().adjValue(); // puede ser positivo (descuento) o negativo (recargo)
        return Math.max(0, sub + adj);
    }
}));