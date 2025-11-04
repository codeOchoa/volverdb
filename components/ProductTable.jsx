"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Box,
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
import { EditDialog, NotificationBar } from "@/components/index";

function ProductTable({ setLoading }) {
    const [products, setProducts] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [editOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [notify, setNotify] = useState({ open: false, message: "", severity: "info" });

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const res = await fetch("/api/products/list");
        const data = await res.json();
        setProducts(data);
        setLoading(false);
    };

    const handleEdit = (p) => {
        setSelected(p);
        setEditOpen(true);
    };

    const handleDelete = async (ean) => {
        if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/products/delete?ean=${ean}`, { method: "DELETE" });
            const result = await res.json();
            if (!res.ok) throw new Error();
            setNotify({
                open: true,
                message: result.message || "Producto eliminado",
                severity: result.ok ? "success" : "error"
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
        fetchProducts();
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
                        {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p) => (
                            <TableRow key={p.ean}>
                                <TableCell>{p.sku}</TableCell>
                                <TableCell>{p.ean}</TableCell>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{p.stock}</TableCell>
                                <TableCell>${p.cost?.toLocaleString("es-AR")}</TableCell>
                                <TableCell>${p.price?.toLocaleString("es-AR")}</TableCell>
                                <TableCell>{p.category}</TableCell>
                                <TableCell>{p.distributor}</TableCell>
                                <TableCell>{p.entryDate}</TableCell>
                                <TableCell>{p.expiryDate}</TableCell>
                                <TableCell>
                                    <Tooltip title="Editar">
                                        <IconButton color="primary"
                                            size="small"
                                            onClick={() => handleEdit(p)}>
                                            <SettingsIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton color="error"
                                            size="small"
                                            onClick={() => handleDelete(p.ean)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selected && (
                <EditDialog open={editOpen}
                    onClose={() => setEditOpen(false)}
                    product={selected}
                    onSaved={fetchProducts}
                    setLoading={setLoading} />
            )}

            <NotificationBar open={notify.open}
                message={notify.message}
                severity={notify.severity}
                onClose={() => setNotify({ ...notify, open: false })} />

            <TablePagination component="div"
                rowsPerPageOptions={[10, 25, 50]}
                count={products.length}
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

export default ProductTable;