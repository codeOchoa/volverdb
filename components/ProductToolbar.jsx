"use client";

import { useState } from "react";
import { Box,
    TextField,
    IconButton,
    Button,
    Stack,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { UploadProducts } from "./index";

function ProductToolbar({ setNotify, onCreate }) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

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

    return (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField variant="outlined"
                placeholder="SKU / EAN / Nombre del Producto"
                size="small"
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleSearch}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }} />
            <Stack direction="row" spacing={1}>
                <Button variant="contained"
                    color="success"
                    startIcon={<FileUploadIcon />}>
                    Importar Excel
                    <UploadProducts setLoading={setLoading} />
                </Button>
                <Button variant="contained"
                    color="success"
                    startIcon={<FileDownloadIcon />}>
                    Exportar Excel
                </Button>
                <Button variant="contained"
                    color="success"
                    startIcon={<AddCircleIcon />}
                    onClick={onCreate}>
                    Crear producto
                </Button>
            </Stack>
        </Box>
    );
}

export default ProductToolbar;