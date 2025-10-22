"use client";

import { useState } from "react";
import { Box, Button, Grid, Modal, Paper, Typography } from "@mui/material";
import { AdjustDialog, NotificationBar } from "@/components/index";
import { useCart } from "@/store/useCart";

function CartSummary({ sx = {} }) {
    const [notify, setNotify] = useState({ open: false, message: "", severity: "info" });
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
            setNotify({ open: true, message: "No hay productos en el carrito", severity: "warn" });
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
            setNotify({ open: true, message: "Venta registrada", severity: "success" });
        } else {
            setNotify({ open: true, message: "No se pudo registrar la venta", severity: "error" });
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

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "end", mt: 1 }}>
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
                {/* Si agregás más contenido a futuro envolvelo en un
            <Box sx={{ flex:1, overflowY:'auto' }}> para evitar crecer el contenedor */}
            </Paper>

            <Modal open={confirmClear} onClose={() => setConfirmClear(false)}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 360,
                    bgcolor: "background.paper",
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 24,
                }}>
                    <Typography variant="h6" mb={1}>
                        Limpiar carrito
                    </Typography>
                    <Typography variant="body2" mb={3}>
                        ¿Seguro que deseas eliminar todos los productos del carrito?
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button onClick={() => setConfirmClear(false)}>Cancelar</Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                setConfirmClear(false);
                                clear();
                                setNotify({  open: true,
                                    message: "Carrito vacío",
                                    severity: "info",
                                });
                            }}>
                            Eliminar
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal open={confirmFinish} onClose={() => setConfirmFinish(false)}>
                <Box
                    sx={{ position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 360,
                        bgcolor: "background.paper",
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 24,
                    }}>
                    <Typography variant="h6" mb={1}>
                        Finalizar venta
                    </Typography>
                    <Typography variant="body2" mb={3}>
                        ¿Confirmás el registro de la venta?
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button onClick={() => setConfirmFinish(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={finalize}>
                            Finalizar
                        </Button>
                    </Box>
                </Box>
            </Modal>

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