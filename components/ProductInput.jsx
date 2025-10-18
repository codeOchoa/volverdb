"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/store/useCart";
import { toast } from "./Toast";

export default function ProductInput() {
    const [ean, setEan] = useState("");
    const [qty, setQty] = useState(1);
    const addItem = useCart(s => s.addItem);
    const btnRef = useRef(null);
    const eanRef = useRef(null);

    useEffect(() => { eanRef.current?.focus(); }, []);

    const doSearch = async () => {
        if (!ean) return;
        const res = await fetch(`/api/products/find?ean=${encodeURIComponent(ean)}`);
        const data = await res.json();
        if (!res.ok || !data) { toast.err("Producto no registrado / inexistente"); return; }
        addItem(data, Number(qty) || 1);
        toast.ok("Producto añadido");
        setEan("");
        setQty(1);
        eanRef.current?.focus();
        btnRef.current?.focus(); // foco visual en la lupa
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") { e.preventDefault(); doSearch(); }
    };

    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
                <label className="block text-sm font-semibold mb-1 bg-black text-white rounded-t-xl px-4 py-2">EAN / SKU</label>
                <input ref={eanRef} value={ean} onChange={e => setEan(e.target.value)} onKeyDown={onKeyDown}
                    className="w-full border rounded-b-xl px-4 py-3" placeholder="7765987453691" />
            </div>

            <div className="col-span-3">
                <label className="block text-sm font-semibold mb-1 bg-black text-white rounded-t-xl px-4 py-2 text-center">Cantidad</label>
                <div className="flex border rounded-b-xl overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1, Number(q) - 1))} className="px-3">–</button>
                    <input value={qty} onChange={e => setQty(e.target.value)} onKeyDown={onKeyDown}
                        className="w-full text-center outline-none" />
                    <button onClick={() => setQty(q => Number(q) + 1)} className="px-3">+</button>
                </div>
            </div>

            <div className="col-span-3 flex items-end">
                <button ref={btnRef} onClick={doSearch}
                    className="w-full h-12 border rounded-xl flex items-center justify-center focus:ring-2 focus:ring-black">
                    🔍
                </button>
            </div>
        </div>
    );
}