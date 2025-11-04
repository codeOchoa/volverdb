"use client";

import { useState, useEffect } from "react";
import { Modal,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
} from "@mui/material";
import { LoadingOverlay, NotificationBar } from "@/components/index";

function ProductModal({
    open,
    onClose,
    mode = "create",
    initialData = null,
    refreshData,
}) {
    const [form, setForm] = useState({
        sku: "",
        ean: "",
        name: "",
        stock: "",
        cost: "",
        price: "",
        category: "",
        distributor: "",
        entryDate: "",
        expiryDate: "",
    });
    const [loading, setLoading] = useState(false);
    const [notify, setNotify] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else
            setForm({
                sku: "",
                ean: "",
                name: "",
                stock: "",
                cost: "",
                price: "",
                category: "",
                distributor: "",
                entryDate: "",
                expiryDate: "",
            });
    }, [initialData]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint =
                mode === "edit"
                    ? `/api/products/${form.sku}`
                    : "/api/products/create";
            const method = mode === "edit" ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error();

            setNotify({
                open: true,
                message:
                    mode === "edit"
                        ? "Producto actualizado correctamente"
                        : "Producto creado correctamente",
                severity: "success",
            });

            if (refreshData) refreshData();
            onClose();
        } catch {
            setNotify({
                open: true,
                message: "Error al guardar el producto",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "min(700px, 95%)",
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                }}>
                <Typography variant="h6" mb={2}>
                    {mode === "edit" ? "Editar producto" : "Crear producto"}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <TextField label="SKU"
                                fullWidth
                                value={form.sku}
                                onChange={(e) => handleChange("sku", e.target.value)}
                                required />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField label="EAN"
                                fullWidth
                                value={form.ean}
                                onChange={(e) => handleChange("ean", e.target.value)}
                                required />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField label="Producto"
                                fullWidth
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                required />
                        </Grid>

                        <Grid size={{ xs: 4 }}>
                            <TextField label="Stock"
                                fullWidth
                                type="number"
                                value={form.stock}
                                onChange={(e) => handleChange("stock", e.target.value)} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField label="Precio compra"
                                fullWidth
                                type="number"
                                value={form.cost}
                                onChange={(e) => handleChange("cost", e.target.value)} />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField label="Precio venta"
                                fullWidth
                                type="number"
                                value={form.price}
                                onChange={(e) => handleChange("price", e.target.value)} />
                        </Grid>

                        <Grid size={{ xs: 6 }}>
                            <TextField label="Categoría"
                                fullWidth
                                value={form.category}
                                onChange={(e) => handleChange("category", e.target.value)} />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField label="Distribuidor"
                                fullWidth
                                value={form.distributor}
                                onChange={(e) => handleChange("distributor", e.target.value)} />
                        </Grid>

                        <Grid size={{ xs: 6 }}>
                            <TextField label="Fecha ingreso"
                                type="date"
                                fullWidth
                                value={form.entryDate}
                                onChange={(e) => handleChange("entryDate", e.target.value)}
                                InputLabelProps={{ shrink: true }}  />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField label="Fecha vencimiento"
                                type="date"
                                fullWidth
                                value={form.expiryDate}
                                onChange={(e) => handleChange("expiryDate", e.target.value)}
                                InputLabelProps={{ shrink: true }} />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            mt: 3,
                        }}>
                        <Button onClick={onClose}>Cancelar</Button>
                        <Button variant="contained" type="submit">
                            {mode === "edit" ? "Guardar cambios" : "Crear producto"}
                        </Button>
                    </Box>
                </form>

                <NotificationBar open={notify.open}
                    message={notify.message}
                    severity={notify.severity}
                    onClose={() => setNotify({ ...notify, open: false })} />
                    
                <LoadingOverlay active={loading} />
            </Box>
        </Modal>
    );
}

export default ProductModal;