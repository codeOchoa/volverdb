"use client";

import { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Snackbar, Alert, Stack
} from "@mui/material";

export default function EditDialog({ open, onClose, product, onSaved, setLoading }) {
    const [form, setForm] = useState(product || {});
    const [notify, setNotify] = useState({ open: false, message: "", severity: "info" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/products/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            setNotify({
                open: true,
                message: data.message || "Producto actualizado",
                severity: data.ok ? "success" : "error",
            });
            if (data.ok) onSaved();
            setTimeout(() => onClose(), 1000);
        } catch (err) {
            console.error("Error al actualizar:", err);
            setNotify({ open: true, message: "Error en el servidor", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Editar producto</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField label="EAN / SKU"
                            name="ean"
                            value={form.ean || ""}
                            onChange={handleChange}
                            fullWidth
                            disabled />
                        <TextField label="Nombre"
                            name="name"
                            value={form.name || ""}
                            onChange={handleChange}
                            fullWidth />
                        <TextField label="Precio"
                            name="price"
                            type="number"
                            value={form.price || ""}
                            onChange={handleChange}
                            fullWidth />
                        <TextField label="Stock"
                            name="stock"
                            type="number"
                            value={form.stock || ""}
                            onChange={handleChange}
                            fullWidth />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={notify.open}
                autoHideDuration={2500}
                onClose={() => setNotify({ ...notify, open: false })}>
                <Alert severity={notify.severity}>{notify.message}</Alert>
            </Snackbar>
        </>
    );
}