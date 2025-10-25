"use client";

import { useEffect, useState } from "react";
import { Box, Grid2 as Grid, Paper, Typography } from "@mui/material";
import ProductToolbar from "@/components/ProductToolbar";
import ProductTable from "@/components/ProductTable";
import ProductModal from "@/components/ProductModal";
import LoadingOverlay from "@/components/LoadingOverlay";
import NotificationBar from "@/components/NotificationBar";

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

    useEffect(() => {
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

        fetchProducts();
    }, []);

    return (
        <Box
            sx={{ height: "100dvh",
                width: "100%",
                p: 3,
                backgroundImage:
                    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
                overflow: "hidden",
            }}>
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
        </Box>
    );
}