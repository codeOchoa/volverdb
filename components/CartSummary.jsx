"use client";

import { useState } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useCart } from "@/store/useCart";
import { AdjustDialog, NotificationBar } from "@/components";

function CartSummary({ sx = {} }) {
    const [notify, setNotify] = useState({ open: false, message: "", severity: "info" });
    const [submitting, setSubmitting] = useState(false);

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

        if (submitting) return;

        if (items.length === 0) {
            setNotify({ open: true, message: "No hay productos en el carrito", severity: "warning" });
            return;
        }

        if (!paymentMethod) {
            setNotify({ open: true, message: "Seleccioná un método de pago", severity: "warning" });
            return;
        }

        const payload = {
            items,
            paymentMethod,
            subtotal: Number(subtotal) || 0,
            adjustment: Number(adj) || 0,
            total: Number(total) || 0,
        };

        try {
            setSubmitting(true);

            const res = await fetch("/api/sales", {
                method: "POST",
                credentials: "include", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        
            const json = await res.json().catch(() => null);
        
            if (!res.ok || !json?.ok) {
                const msg =
                    json?.message ||
                    json?.error ||
                    "No se pudo registrar la venta";
                throw new Error(msg);
            }
        
            clear();
            setNotify({ open: true, message: "Venta registrada correctamente", severity: "success" });
        } catch (err) {
            setNotify({
                open: true,
                message: err?.message || "No se pudo registrar la venta",
                severity: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Paper variant="outlined"
                sx={{ borderRadius: 3,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    ...sx,
                }}>
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
                    <Box sx={{ display: "flex",
                            justifyContent: "space-between",
                            alignItems: "end",
                            mt: 1,
                        }}>
                        <Typography variant="h6" fontWeight={700}>
                            Total
                        </Typography>
                        <Typography variant="h4" fontWeight={800}>
                            ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        </Typography>
                    </Box>
                </Box>
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
                <Grid container spacing={1.5}>
                    <Grid size={6}>
                        <Button onClick={() => { 
                            clear();
                            setNotify({ open: true, message: "Carrito vacío", severity: "info" });
                            }}
                            fullWidth
                            variant="contained"
                            color="error"
                            disabled={submitting}>
                            Limpiar carrito
                        </Button>
                    </Grid>
                    <Grid size={6}>
                        <Button onClick={finalize}
                            fullWidth
                            variant="contained"
                            color="success"
                            disabled={submitting}>
                            Finalizar venta
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

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

            <NotificationBar open={notify.open}
                message={notify.message}
                severity={notify.severity}
                onClose={() => setNotify({ ...notify, open: false })} />
        </>
    );
}

export default CartSummary;