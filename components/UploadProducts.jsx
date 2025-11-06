"use client";

import { useState } from "react";
import { Box,
    Button,
    Typography,
    Paper,
    Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { NotificationBar, LoadingOverlay } from "@/components/index";

export default function UploadProducts({ setLoading }) {
    const [file, setFile] = useState(null);
    const [notify, setNotify] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const [loading, setLocalLoading] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected || null);
    };

    const handleUpload = async () => {
        if (!file) {
            setNotify({
                open: true,
                message: "Seleccioná un archivo CSV válido",
                severity: "warning",
            });
            return;
        }

        setLoading?.(true);
        setLocalLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/products/upload", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (res.ok) {
                setNotify({
                    open: true,
                    message: result.message || "Carga completada correctamente",
                    severity: "success",
                });
            } else {
                setNotify({
                    open: true,
                    message: result.error || "Error al procesar el archivo",
                    severity: "error",
                });
            }
        } catch (err) {
            console.error("Error al subir CSV:", err);
            setNotify({
                open: true,
                message: "Error de conexión o formato inválido",
                severity: "error",
            });
        } finally {
            setLoading?.(false);
            setLocalLoading(false);
        }
    };

    return (
        <Paper elevation={2}
            sx={{ p: 4,
                textAlign: "center",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
            }}>
            <Typography variant="h6" fontWeight={600}>
                Cargar productos desde CSV
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Estructura requerida: SKU, EAN, Producto, Stock, Precio compra, Precio venta, Porcentaje aplicado, Categoría, Distribuidor, Fecha ingreso, Fecha vencimiento
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <Button component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}>
                    Seleccionar archivo
                    <input type="file"
                        accept=".csv"
                        hidden
                        onChange={handleFileChange} />
                </Button>
                {file && (
                    <Typography variant="body2" color="text.secondary">
                        {file.name}
                    </Typography>
                )}
            </Stack>

            <Button variant="contained"
                sx={{ mt: 2, px: 4 }}
                disabled={!file || loading}
                onClick={handleUpload}>
                Subir y sincronizar
            </Button>

            <NotificationBar open={notify.open}
                message={notify.message}
                severity={notify.severity}
                onClose={() => setNotify({ ...notify, open: false })} />

            <LoadingOverlay active={loading} />
            
        </Paper>
    );
}