"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, 
    Button, 
    Card, 
    Input, 
    InputAdornment, 
    InputLabel, 
    FormControl, 
    Modal, 
    Typography, 
    Stack, 
    styled 
} from "@mui/material";
import { LoadingOverlay, NotificationBar } from "@/components/index";
import { getDateTime } from "@/utils/getDateTime";

const OpenCashContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    alignItems: "center",
    justifyContent: "center",
    backgroundImage:
        "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
        backgroundRepeat: 'no-repeat',
    ...theme.applyStyles("dark", {
        backgroundImage:
            "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
    transition: theme.transitions.create("background-image", {
        duration: theme.transitions.duration.standard,
    }),
}));

export default function OpenCashPage() {
    const [amount, setAmount] = useState("");
    const [openConfirm, setOpenConfirm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notify, setNotify] = useState({ open: false, message: "", severity: "info" });
    const router = useRouter();

    useEffect(() => {
        const checkCashStatus = async () => {
            try {
                const res = await fetch("/api/cash/status");
                const data = await res.json();

                if (data.ok && data.isOpen) {
                    setNotify({
                        open: true,
                        message: "Caja ya abierta, redirigiendo a ventas...",
                        severity: "info",
                    });
                    setTimeout(() => router.push("/sales"), 1500);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error al verificar caja:", err);
                setNotify({
                    open: true,
                    message: "No se pudo verificar el estado de la caja",
                    severity: "error",
                });
                setLoading(false);
            }
        };

        checkCashStatus();
    }, [router]);

    const handleOpenCash = async () => {
        const { date, full } = getDateTime();
        setOpenConfirm(false);
        setLoading(true);
        try {
            const res = await fetch("/api/cash/open", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date, initialAmount: amount, openedAt: full }),
            });

            const data = await res.json();

            if (data.ok) {
                setNotify({ open: true, message: "Caja abierta correctamente", severity: "success" });
                localStorage.setItem("cashStatus", date);
                setTimeout(() => router.push("/sales"), 800);
            } else {
                setNotify({ open: true, message: "Error al abrir la caja", severity: "error" });
            }
        } catch {
            setNotify({ open: true, message: "Error de conexión", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <OpenCashContainer>
            <Card variant="outlined"
                sx={{ p: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    width: "100%",
                    maxWidth: 500,
                }}>
                <Typography variant="h4" textAlign="center">
                    Abrí tu caja para empezar a cobrar
                </Typography>
            
                <FormControl fullWidth sx={{ m: 1, display: "flex", flexDirection: "column", alignItems: "center" }} variant="standard" >
                    <InputLabel htmlFor="standard-adornment-amount"
                        sx={{ transform: "translateX(20%)", 
                            textAlign: "center", 
                            fontSize: "1.2rem", 
                            fontWeight: 500, 
                            top: "-4px", }}>Ingresá el monto inicial en efectivo</InputLabel>
                    <Input id="standard-adornment-amount"
                        size="normal"
                        inputProps={{ min: 0, inputMode: "decimal" }}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        sx={{ fontSize: "3rem", 
                            fontWeight: 100, 
                            height: "5rem", 
                            maxWidth: "280px", 
                            width: "100%",
                        }}
                        startAdornment={<InputAdornment position="start">
                            <Typography fontSize="1.5rem" fontWeight={100}>$</Typography>
                        </InputAdornment>} />
                </FormControl>

                <Button variant="contained"
                    size="large"
                    sx={{ mt: 2 }}
                    onClick={() => setOpenConfirm(true)}
                    disabled={!amount || loading}>
                    Abrir Caja
                </Button>
            </Card>
            
            <Modal open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <Box sx={{ position: "absolute",
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
                        Confirmar apertura
                    </Typography>
                    <Typography variant="body2" mb={3}>
                        ¿Deseás abrir la caja con ${amount} en efectivo?
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={handleOpenCash}>
                            Confirmar
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <NotificationBar open={notify.open}
                message={notify.message}
                severity={notify.severity}
                onClose={() => setNotify({ ...notify, open: false })} />

            <LoadingOverlay active={loading} />

        </OpenCashContainer>
    );
}