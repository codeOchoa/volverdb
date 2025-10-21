// import { formatARS } from "@/utils/formatCurrency";
// import { validateEAN } from "@/utils/validateEAN";
// import { getDateTime } from "@/utils/getDateTime";
// import { useConfirmDialog, useHotkeys, useToastMessage } from "@/hooks/index";


// const { full } = getDateTime(); // "2025-10-17 15:24:02"
// const { openConfirm, ConfirmDialogProps } = useConfirmDialog();
// const { show } = useToastMessage();
//     show("Producto añadido", "success");

//     <ConfirmDialog {...ConfirmDialogProps} /> // Abrir:
// openConfirm({ title:"Finalizar venta", message:"¿Confirmás?", onConfirm: handleFinish });

// useHotkeys({
//     onClear: handleClearCart,
//     onFinish: handleFinalizeSale,
//     onCancel: closeModal,
// });

// if (!validateEAN(ean)) {
//     toast.err("Código inválido");
//     return;
// }

"use client";

import { useState } from "react";
import { Box, Container, Grid, IconButton, Paper, Typography } from "@mui/material";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { CartSummary, ConfirmDialog, PaymentSection, ProductInput, SalesTable, ToastHost } from "@/components/index";
import { useCart } from "@/store/useCart";

export default function SalesPage() {
    const [confirmLeave, setConfirmLeave] = useState(false);
    const clear = useCart((s) => s.clear);

    return (
        <Box sx={(theme) => ({
                minHeight: "100dvh",
                // Altura objetivo sin scroll de página:
                maxHeight: 874,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: 2, sm: 4 },
                py: { xs: 2, sm: 3 },
                backgroundImage:
                    theme.palette.mode === "dark"
                        ? "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))"
                        : "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
                backgroundRepeat: "no-repeat",
                transition: theme.transitions.create("background-image", {
                    duration: theme.transitions.duration.standard,
                }),
            })}>
            <Container maxWidth="lg" disableGutters>
                <Paper elevation={0}
                    sx={{
                        mx: "auto",
                        p: { xs: 2, sm: 3 },
                        borderRadius: 3,
                        bgcolor: "background.paper",
                        boxShadow:
                            "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
                    }}>
                    {/* Header */}
                    <Box sx={{ position: "relative", mb: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography variant="h4" fontWeight={800} letterSpacing={0.5}>
                            CARRITO
                        </Typography>
                        <IconButton
                            onClick={() => setConfirmLeave(true)}
                            sx={{ position: "absolute", right: 0, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
                            aria-label="Configuración">
                            <SettingsRoundedIcon />
                        </IconButton>
                    </Box>

                    {/* Tabla (con scroll interno, altura fija) */}
                    <Box
                        sx={{
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            p: 1.5,
                            // Altura pensada para encajar en 874px totales:
                            height: { xs: 340, md: 400 },
                            overflow: "auto",
                            bgcolor: "background.paper",
                        }}>
                        <SalesTable />
                    </Box>

                    {/* Controles inferiores */}
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <ProductInput />
                            <PaymentSection />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            {/* Panel derecho con altura controlada y overflow interno */}
                            <CartSummary
                                sx={{
                                    height: { xs: 240, md: 260 },
                                    display: "flex",
                                    flexDirection: "column",
                                }} />
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            <ConfirmDialog
                open={confirmLeave}
                title="Salir al dashboard"
                message="Si sales del Carrito, este será eliminado."
                confirmText="Continuar"
                onCancel={() => setConfirmLeave(false)}
                onConfirm={() => {
                    setConfirmLeave(false);
                    clear();
                    window.location.href = "/dashboard";
                }} />

            <ToastHost />
        </Box>
    );
}
