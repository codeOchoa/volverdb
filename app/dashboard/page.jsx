"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Paper, styled, Typography } from "@mui/material";
import { GlobalSpeedDial, LoadingOverlay, NotificationBar, ProductModal, ProductTable, ProductToolbar } from "@/components/index";

const DashboardPageBox = styled(Box)(({ theme }) => ({
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

export default function DashboardPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notify, setNotify] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const [openModal, setOpenModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/products");
            if (!res.ok) throw new Error("Error al cargar productos");
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            setNotify({
                open: true,
                message: "No se pudieron cargar los productos",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <DashboardPageBox>
            <Paper elevation={3}
                sx={{ borderRadius: 3,
                    p: 3,
                    height: "calc(100% - 24px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    bgcolor: "background.default",
                }}>
                <Typography variant="h5" fontWeight={700} align="center">
                    Panel de Productos
                </Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12 }}>
                        <ProductToolbar setLoading={setLoading}
                            setNotify={setNotify}
                            onCreate={() => {
                                setEditData(null);
                                setOpenModal(true);
                            }} />
                    </Grid>
                </Grid>

                <Box sx={{ flex: 1,
                        overflow: "hidden",
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        boxShadow: 1,
                    }}>
                    <ProductTable rows={products}
                        setLoading={setLoading}
                        setNotify={setNotify}
                        onEdit={(data) => {
                            setEditData(data);
                            setOpenModal(true);
                        }}
                        refreshData={fetchProducts} />
                </Box>
            </Paper>

            <GlobalSpeedDial />

            <ProductModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                mode={editData ? "edit" : "create"}
                initialData={editData}
                refreshData={fetchProducts} />

            <NotificationBar open={notify.open}
                message={notify.message}
                severity={notify.severity}
                onClose={() => setNotify({ ...notify, open: false })} />

            <LoadingOverlay active={loading} />
        </DashboardPageBox>
    );
}