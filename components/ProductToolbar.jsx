"use client";

import { useState } from "react";
import { Box,
    TextField,
    IconButton,
    Button,
    Stack,
    InputAdornment,
    Modal,
    Paper,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { UploadProducts, LoadingOverlay, NotificationBar } from "@/components/index";

function ProductToolbar({ setNotify, onCreate }) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [notify, setLocalNotify] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/search?q=${query}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setNotify({
                open: true,
                message: `${data.length} resultados encontrados`,
                severity: "success",
            });
        } catch {
            setNotify({
                open: true,
                message: "Error en la búsqueda",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/products/export");
            if (!res.ok) throw new Error("Error al exportar productos");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "productos_volverdb.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
            setLocalNotify({
                open: true,
                message: "Archivo exportado correctamente",
                severity: "success",
            });
        } catch {
            setLocalNotify({
                open: true,
                message: "Error al exportar archivo",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField variant="outlined"
                    placeholder="SKU / EAN / Nombre del Producto"
                    size="medium"
                    fullWidth
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearch}
                                        disableRipple={false}
                                        sx={{ backgroundColor: "transparent !important", 
                                            borderColor: "transparent !important",
                                            "&:hover": {
                                                backgroundColor: "transparent", 
                                                borderColor: "transparent",
                                            },
                                            "& .MuiTouchRipple-root": {
                                                color: "rgba(0,0,0,0.3)",
                                            },
                                        }}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }} />
                <Stack direction="row" spacing={2}>
                    <Button variant="contained"
                        color="success"
                        startIcon={<FileUploadIcon />}
                        onClick={() => setOpenUpload(true)}>
                        Importar
                    </Button>
                    <Button variant="contained"
                        color="success"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleExport}>
                        Exportar
                    </Button>
                    <Button variant="contained"
                        color="success"
                        startIcon={<AddCircleIcon />}
                        onClick={onCreate}>
                        Crear
                    </Button>
                </Stack>
            </Box>

            <Modal open={openUpload} onClose={() => setOpenUpload(false)}>
                <Paper sx={{ position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        p: 4,
                        width: 500,
                        borderRadius: 3,
                    }}>
                    <Typography variant="h6" mb={2}>
                        Importar productos desde archivo CSV
                    </Typography>
                    <UploadProducts setLoading={setLoading} />
                    <Box mt={2} textAlign="right">
                        <Button onClick={() => setOpenUpload(false)}>Cerrar</Button>
                    </Box>
                </Paper>
            </Modal>

            <NotificationBar open={notify.open || notify.open}
                message={notify.message || notify.message}
                severity={notify.severity || notify.severity}
                onClose={() => {
                    setNotify({ ...notify, open: false });
                    setLocalNotify({ ...notify, open: false });
                }} />

            <LoadingOverlay active={loading} />
        </>
    );
}

export default ProductToolbar;