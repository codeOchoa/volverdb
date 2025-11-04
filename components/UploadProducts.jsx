"use client";

import { useState } from "react";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";

export default function UploadProducts({ setLoading }) {
    const [file, setFile] = useState(null);
    const [notify, setNotify] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async () => {
        if (!file)
            return setNotify({
                open: true,
                message: "Selecciona un archivo",
                severity: "warning",
            });

        setLoading(true);
        try {
            const text = await file.text();
            const rows = text.split("\n").map((r) => r.split(","));
            const data = rows.slice(1).map(([ean, name, price, stock]) => ({
                ean,
                name,
                price: parseFloat(price),
                stock: parseInt(stock),
            }));

            const res = await fetch("/api/products/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            setNotify({
                open: true,
                message: result.message || "Carga completada",
                severity: result.ok ? "success" : "error",
            });
        } catch (err) {
            setNotify({
                open: true,
                message: "Error al procesar el archivo",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box textAlign="center" p={2}>
            <Typography variant="h6" mb={2}>
                Cargar archivo CSV (EAN, Nombre, Precio, Stock)
            </Typography>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <Button variant="contained"
                sx={{ mt: 2 }}
                disabled={!file}
                onClick={handleUpload}>
                Subir y sincronizar
            </Button>

            <Snackbar open={notify.open}
                autoHideDuration={2500}
                onClose={() => setNotify({ ...notify, open: false })}>
                <Alert severity={notify.severity}>{notify.message}</Alert>
            </Snackbar>
        </Box>
    );
}
