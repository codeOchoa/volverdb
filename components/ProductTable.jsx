"use client";

import * as React from "react";
import {
    Box,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";

export default function ProductTable({
        rows,
        setLoading,
        setNotify,
        onEdit,
        refreshData,
    }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);

    const handleDelete = async (sku) => {
        if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${sku}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            setNotify({
                open: true,
                message: "Producto eliminado correctamente",
                severity: "success",
            });
            refreshData();
        } catch {
            setNotify({
                open: true,
                message: "Error al eliminar producto",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <TableContainer sx={{ flex: 1, overflowY: "auto" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {[
                                "SKU",
                                "EAN",
                                "Producto",
                                "Stock",
                                "Precio compra",
                                "Precio venta",
                                "Categoría",
                                "Distribuidor",
                                "Fecha ingreso",
                                "Fecha vencimiento",
                                "",
                            ].map((col) => (
                                <TableCell key={col}>{col}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                            <TableRow key={r.sku}>
                                <TableCell>{r.sku}</TableCell>
                                <TableCell>{r.ean}</TableCell>
                                <TableCell>{r.name}</TableCell>
                                <TableCell>{r.stock}</TableCell>
                                <TableCell>${r.cost?.toLocaleString("es-AR")}</TableCell>
                                <TableCell>${r.price?.toLocaleString("es-AR")}</TableCell>
                                <TableCell>{r.category}</TableCell>
                                <TableCell>{r.distributor}</TableCell>
                                <TableCell>{r.entryDate}</TableCell>
                                <TableCell>{r.expiryDate}</TableCell>
                                <TableCell>
                                    <Tooltip title="Editar">
                                        <IconButton color="primary"
                                            size="small"
                                            onClick={() => onEdit(r)}>
                                            <SettingsIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton color="error"
                                            size="small"
                                            onClick={() => handleDelete(r.sku)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination component="div"
                rowsPerPageOptions={[10, 25, 50]}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                labelRowsPerPage="Filas por página" />
        </Box>
    );
}