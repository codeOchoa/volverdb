"use client";

import { useState, useEffect } from "react";

function AdjustDialog({ open, initial = { type:"monto", value:0}, mode = "descuento", onSave, onClose }) {
    const [type, setType] = useState(initial.type);
    const [value, setValue] = useState(initial.value);

    useEffect(() => { if (open) { setType(initial.type); setValue(initial.value); } }, [open, initial]);

    const title = mode === "descuento" ? "Descuento" : "Recargo";

    return !open ? null : (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-2xl p-6 w-[420px] shadow-xl">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>

                <div className="mb-3">
                    <label className="text-sm font-medium">Tipo</label>
                    <select value={type} onChange={e => setType(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2">
                        <option value="monto">Monto fijo ($)</option>
                        <option value="porcentaje">Porcentaje (%)</option>
                    </select>
                </div>

                <div className="mb-5">
                    <label className="text-sm font-medium">Valor</label>
                    <input type="number" value={value} onChange={e => setValue(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2" />
                </div>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancelar</button>
                    <button
                        onClick={() => onSave({ type, value: (mode === "descuento" ? -Math.abs(Number(value) || 0) : +Math.abs(Number(value) || 0)), label: "Descuento / Recargo" })}
                        className="px-4 py-2 rounded-lg bg-black text-white">Aplicar</button>
                </div>
            </div>
        </div>
    );
}

export default AdjustDialog;