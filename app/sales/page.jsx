// import { useHotkeys } from "@/hooks/index";

// useHotkeys({
//     onClear: handleClearCart,
//     onFinish: handleFinalizeSale,
//     onCancel: closeModal,
// });

"use client";

import { useState } from "react";
import { Box, Button, Container, Grid, IconButton, Modal, Paper, styled, Typography } from "@mui/material";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { CartSummary, LoadingOverlay, NotificationBar, PaymentSection, ProductInput, SalesTable } from "@/components/index";
import { useCart } from "@/store/useCart";

const SalesPageContainer = styled(Container)(({ theme }) => ({
    width: '100%',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    boxSizing: 'border-box',
}));

const SalesPageBox = styled(Box)(({ theme }) => ({
    minHeight: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    maxHeight: 874,
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage:
        "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles("dark", {
        backgroundImage:
            "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
    transition: theme.transitions.create("background-image", {
        duration: theme.transitions.duration.standard,
    }),
}));

export default function SalesPage() {
    const [confirmLeave, setConfirmLeave] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notify, setNotify] = useState({ open: false, message: "", severity: "info" });
    const clear = useCart((s) => s.clear);

    const handleLeave = async () => {
        setConfirmLeave(false);
        setLoading(true);
        await new Promise((r) => setTimeout(r, 700));
        clear();
        setLoading(false);
        setNotify({ open: true, message: "Sesión cerrada, carrito eliminado", severity: "info" });
        window.location.href = "/dashboard";
    };

    return (
        <SalesPageBox>
            <SalesPageContainer>
                <Paper elevation={0}
                    sx={{ mx: "auto",
                        p: { xs: 2, sm: 3 },
                        borderRadius: 3,
                        bgcolor: "background.paper",
                        boxShadow:
                            "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
                    }}>
                    <Box sx={{ position: "relative", mb: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography variant="h4" fontWeight={800} letterSpacing={0.5}>
                            CARRITO
                        </Typography>
                        <IconButton onClick={() => setConfirmLeave(true)}
                            sx={{ position: "absolute", right: 0, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
                            aria-label="Configuración">
                            <SettingsRoundedIcon />
                        </IconButton>
                    </Box>

                    <Box
                        sx={{ borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            p: 1.5,
                            height: { xs: 340, md: 400 },
                            overflow: "auto",
                            bgcolor: "background.paper",
                        }}>
                        <SalesTable />
                    </Box>

                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <ProductInput />
                            <PaymentSection />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <CartSummary
                                sx={{ height: { xs: 240, md: 260 },
                                    display: "flex",
                                    flexDirection: "column",
                                }} />
                        </Grid>
                    </Grid>
                </Paper>
            </SalesPageContainer>

            <Modal open={confirmLeave} onClose={() => setConfirmLeave(false)}>
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
                        Salir al dashboard
                    </Typography>
                    <Typography variant="body2" mb={3}>
                        Si sales del carrito, este será eliminado.
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button onClick={() => setConfirmLeave(false)}>Cancelar</Button>
                        <Button variant="contained" color="error" onClick={handleLeave}>
                            Continuar
                        </Button>
                    </Box>
                </Box>
            </Modal>
            
            <NotificationBar
                open={notify.open}
                message={notify.message}
                severity={notify.severity}
                onClose={() => setNotify({ ...notify, open: false })} />
        
            <LoadingOverlay active={loading} />
            
        </SalesPageBox>
    );
}