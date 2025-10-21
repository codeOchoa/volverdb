"use client";

import { useState } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useCart } from "@/store/useCart";
import ConfirmDialog from "./ConfirmDialog";
import AdjustDialog from "./AdjustDialog";
import { toast } from "./Toast";

function CartSummary({ sx = {} }) {
    const subtotal = useCart((s) => s.subtotal());
    const adj = useCart((s) => s.adjValue());
    const total = useCart((s) => s.total());
    const items = useCart((s) => s.items);
    const clear = useCart((s) => s.clear);
    const adjustment = useCart((s) => s.adjustment);
    const setAdjustment = useCart((s) => s.setAdjustment);
    const paymentMethod = useCart((s) => s.paymentMethod);

    const [confirmClear, setConfirmClear] = useState(false);
    const [confirmFinish, setConfirmFinish] = useState(false);
    const [openDesc, setOpenDesc] = useState(false);
    const [openRec, setOpenRec] = useState(false);

    const finalize = async () => {
        setConfirmFinish(false);
        if (items.length === 0) {
            toast.warn("No hay productos en el carrito");
            return;
        }
        const payload = {
            date: new Date().toISOString(),
            items,
            paymentMethod,
            subtotal,
            adjustment: adj,
            total,
        };
        const res = await fetch("/api/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (res.ok) {
            toast.ok("Venta registrada");
            clear();
        } else {
            toast.err("No se pudo registrar la venta");
        }
    };

    return (
        <>
            <Paper variant="outlined"
                sx={{
                    borderRadius: 3,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    // altura controlada desde props (Page) + scroll interno si hiciera falta
                    ...sx,
                }}>
                {/* Bloque de montos - NO crece, se mantiene */}
                <Box sx={(theme) => ({
                        borderRadius: 2,
                        p: 2,
                        bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.900",
                        color: "common.white",
                    })}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", opacity: 0.9 }}>
                        <Typography variant="body2">Subtotal</Typography>
                        <Typography variant="body2">
                            ${subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", opacity: 0.9 }}>
                        <Typography variant="body2">{adjustment.label}</Typography>
                        <Typography variant="body2">
                            ${adj.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "end", mt: 1 }}>
                        <Typography variant="h6" fontWeight={700}>
                            Total
                        </Typography>
                        <Typography variant="h4" fontWeight={800}>
                            ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        </Typography>
                    </Box>
                </Box>

                {/* Botones de ajuste */}
                <Grid container spacing={1.5}>
                    <Grid size={6}>
                        <Button onClick={() => setOpenDesc(true)} fullWidth variant="outlined">
                            Descuento
                        </Button>
                    </Grid>
                    <Grid size={6}>
                        <Button onClick={() => setOpenRec(true)} fullWidth variant="outlined">
                            Recargo
                        </Button>
                    </Grid>
                </Grid>

                {/* Botones principales */}
                <Grid container spacing={1.5}>
                    <Grid size={6}>
                        <Button onClick={() => setConfirmClear(true)} fullWidth variant="contained" color="error">
                            Limpiar carrito
                        </Button>
                    </Grid>
                    <Grid size={6}>
                        <Button onClick={() => setConfirmFinish(true)} fullWidth variant="contained" color="success">
                            Finalizar venta
                        </Button>
                    </Grid>
                </Grid>

                {/* Si en este panel agregás más contenido a futuro (e.g., lista corta, vouchers, etc.),
            envolvelo en un <Box sx={{ flex:1, overflowY:'auto' }}> para evitar crecer el contenedor */}
            </Paper>

            {/* Modales */}
            <ConfirmDialog open={confirmClear}
                title="Limpiar carrito"
                message="¿Seguro que deseas eliminar todos los productos del carrito?"
                confirmText="Eliminar"
                onConfirm={() => {
                    setConfirmClear(false);
                    clear();
                    toast.info("Carrito vacío");
                }}
                onCancel={() => setConfirmClear(false)} />
            <ConfirmDialog open={confirmFinish}
                title="Finalizar venta"
                message="¿Confirmás el registro de la venta?"
                confirmText="Finalizar"
                onConfirm={finalize}
                onCancel={() => setConfirmFinish(false)} />
            <AdjustDialog open={openDesc}
                mode="descuento"
                initial={adjustment}
                onSave={(adj) => {
                    setAdjustment(adj);
                    setOpenDesc(false);
                }}
                onClose={() => setOpenDesc(false)} />
            <AdjustDialog open={openRec}
                mode="recargo"
                initial={adjustment}
                onSave={(adj) => {
                    setAdjustment(adj);
                    setOpenRec(false);
                }}
                onClose={() => setOpenRec(false)} />
        </>
    );
}

export default CartSummary;