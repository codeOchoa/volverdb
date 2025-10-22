"use client";

import { useState } from "react";
import {
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { useCart } from "@/store/useCart";

function SalesTable() {
    const { items, inc, dec, setQty, remove } = useCart();
    const [editEan, setEditEan] = useState(null);

    return (
        <TableContainer component={Box} sx={{ bgcolor: "background.paper" }}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell width={48}>#</TableCell>
                        <TableCell width={160}>Código</TableCell>
                        <TableCell>Detalle</TableCell>
                        <TableCell align="center" width={160}>
                            Cantidad
                        </TableCell>
                        <TableCell align="right" width={120}>
                            Unitario
                        </TableCell>
                        <TableCell align="right" width={120}>
                            Importe
                        </TableCell>
                        <TableCell width={56}></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {items.map((it, idx) => (
                        <TableRow key={it.ean} hover>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>
                                <Typography variant="body2" fontFamily="monospace">
                                    {it.ean}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>{it.name}</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                    <IconButton onClick={() => dec(it.ean)} size="small">
                                        <RemoveRoundedIcon />
                                    </IconButton>

                                    {editEan === it.ean ? (
                                        <TextField autoFocus
                                            defaultValue={it.qty}
                                            onBlur={(e) => {
                                                setQty(it.ean, e.target.value);
                                                setEditEan(null);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    setQty(it.ean, e.currentTarget.value);
                                                    setEditEan(null);
                                                }
                                            }}
                                            size="small"
                                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", style: { textAlign: "center", width: 56 } }} />
                                    ) : (
                                        <Typography onClick={() => setEditEan(it.ean)}
                                            sx={{ cursor: "text", userSelect: "none", minWidth: 32, textAlign: "center" }}>
                                            {it.qty}
                                        </Typography>
                                    )}

                                    <IconButton onClick={() => inc(it.ean)} size="small">
                                        <AddRoundedIcon />
                                    </IconButton>
                                </Box>
                            </TableCell>
                            <TableCell align="right">${it.price.toLocaleString("es-AR")}</TableCell>
                            <TableCell align="right">${(it.price * it.qty).toLocaleString("es-AR")}</TableCell>
                            <TableCell>
                                <Tooltip title="Eliminar">
                                    <IconButton onClick={() => remove(it.ean)} color="error" size="small">
                                        <DeleteOutlineRoundedIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}

                    {items.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                <Typography color="text.disabled" sx={{ py: 4 }}>
                                    Sin productos
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default SalesTable;