"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const calcSubtotal = (items) =>
    items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 0), 0);

const applyAdj = (subtotal, adj) => {
    if (!adj) return 0;
    const { type, value } = adj;
    const v = Number(value) || 0;
    if (type === "monto") return v;
    if (type === "porcentaje") return subtotal * (v / 100);
    return 0;
};

const clampQty = (n, max = 999) => Math.min(max, Math.max(1, Number(n) || 1));
const getMaxFromStock = (stock) => {
    const s = Number(stock);
    if (!Number.isFinite(s)) return 999;
    return Math.max(0, s);
};

const INITIAL_ADJ = { value: 0, type: "monto", label: "Sin ajuste" };

export const useCart = create(
    persist(
        (set, get) => ({
            items: [],
            paymentMethod: "Efectivo",

            adjustment: INITIAL_ADJ,

            addItem: (prod, qty = 1) => {
                const items = [...get().items];
                const ean = String(prod?.ean || "").trim();
                if (!ean) return;

                const idx = items.findIndex((i) => i.ean === ean);

                const safePrice = Number(prod.price) || 0;
                const stock = prod.stock ?? (idx >= 0 ? items[idx].stock : undefined);
                const max = getMaxFromStock(stock);

                const safeQty = clampQty(qty, max === 0 ? 1 : max);

                if (max <= 0) return;

                if (idx >= 0) {
                    const next = clampQty(items[idx].qty + safeQty, max);
                    items[idx] = { ...items[idx], qty: next, price: safePrice, stock: max };
                } else {
                    items.push({
                        ean,
                        name: prod.name,
                        price: safePrice,
                        qty: safeQty,
                        stock: max,
                    });
                }

                set({ items });
            },

            inc: (ean) =>
                set({
                    items: get().items.map((i) => {
                        if (i.ean !== ean) return i;
                        const max = getMaxFromStock(i.stock);
                        return { ...i, qty: clampQty(i.qty + 1, max) };
                    }),
                }),

            dec: (ean) =>
                set({
                    items: get().items.map((i) => {
                        if (i.ean !== ean) return i;
                        return { ...i, qty: clampQty(i.qty - 1, getMaxFromStock(i.stock) || 999) };
                    }),
                }),

            setQty: (ean, qty) =>
                set({
                    items: get().items.map((i) => {
                        if (i.ean !== ean) return i;
                        const max = getMaxFromStock(i.stock);
                        return { ...i, qty: clampQty(qty, max || 999) };
                    }),
                }),

            remove: (ean) => set({ items: get().items.filter((i) => i.ean !== ean) }),

            clear: () =>
                set({
                    items: [],
                    adjustment: INITIAL_ADJ,
                    paymentMethod: "Efectivo",
                }),

            setAdjustment: (adj) => set({ adjustment: adj }),
            setPaymentMethod: (m) => set({ paymentMethod: m }),

            subtotal: () => calcSubtotal(get().items),
            adjValue: () => applyAdj(get().subtotal(), get().adjustment),
            total: () => Math.max(0, get().subtotal() + get().adjValue()),
        }),
        {
            name: "volverdb-cart",
            storage: createJSONStorage(() => localStorage),
            version: 1,
            partialize: (state) => ({
                items: state.items,
                paymentMethod: state.paymentMethod,
                adjustment: state.adjustment,
            }),
        }
    )
);