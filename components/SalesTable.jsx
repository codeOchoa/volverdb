"use client";

import { useState } from "react";
import { useCart } from "@/store/useCart";

export default function SalesTable() {
    const { items, inc, dec, setQty, remove } = useCart();
    const [editEan, setEditEan] = useState(null);

    return (
        <div className="border rounded-2xl p-3 h-[420px] overflow-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-600">
                        <th className="w-10">#</th>
                        <th className="w-48">Codigo</th>
                        <th>Detalle</th>
                        <th className="w-40 text-center">Cantidad</th>
                        <th className="w-28 text-right">Unitario</th>
                        <th className="w-28 text-right">Importe</th>
                        <th className="w-10"></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((it, idx) => (
                        <tr key={it.ean} className="border-t">
                            <td>{idx + 1}</td>
                            <td className="font-mono">{it.ean}</td>
                            <td className="font-semibold">{it.name}</td>
                            <td>
                                <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => dec(it.ean)} className="px-2">–</button>
                                    {editEan === it.ean ? (
                                        <input
                                            autoFocus
                                            defaultValue={it.qty}
                                            onBlur={(e) => { setQty(it.ean, e.target.value); setEditEan(null); }}
                                            onKeyDown={(e) => { if (e.key === "Enter") { setQty(it.ean, e.currentTarget.value); setEditEan(null); } }}
                                            className="w-16 text-center border rounded"
                                        />
                                    ) : (
                                        <span onClick={() => setEditEan(it.ean)} className="cursor-text select-none">{it.qty}</span>
                                    )}
                                    <button onClick={() => inc(it.ean)} className="px-2">+</button>
                                </div>
                            </td>
                            <td className="text-right">${it.price.toLocaleString("es-AR")}</td>
                            <td className="text-right">${(it.price * it.qty).toLocaleString("es-AR")}</td>
                            <td>
                                <button onClick={() => remove(it.ean)} className="text-red-600">🗑️</button>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr><td colSpan={7} className="text-center py-8 text-gray-400">Sin productos</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}