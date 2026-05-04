"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Button, ButtonGroup, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { api } from "@/lib/api";
import { useCart } from "@/store/useCart";
import { validateEAN } from "@/utils/validateEAN";
import { NotificationBar } from "@/components/index";

function ProductInput() {
    const [notify, setNotify] = useState({ open: false, message: "", severity: "info" });
    const [ean, setEan] = useState("");
    const [qty, setQty] = useState(1);

    const items = useCart((s) => s.items);
    const addItem = useCart((s) => s.addItem);
    const btnRef = useRef(null);
    const eanRef = useRef(null);

    useEffect(() => {
        eanRef.current?.focus();
    }, []);

    const doSearch = async () => {
        const clean = (ean || "").trim();
        if (!clean) return;

        if (!validateEAN(clean)) {
            setNotify({ open: true, message: "Código inválido", severity: "error" });
            return;
        }

        const requested = Math.max(1, Number(qty) || 1);

        try {
            const json = await api.get(`/api/products/find?ean=${encodeURIComponent(clean)}`);

            if (!json?.success || !json?.data) {
                setNotify({ open: true, message: json?.message || "Producto no registrado / inexistente", severity: "error" });
                return;
            }

            const product = json.data;
            const available = Number(product.stock ?? 0);
            const already = Number(items.find((i) => i.ean === product.ean)?.qty || 0);

            if (available <= 0) {
                setNotify({ open: true, message: "Sin stock disponible", severity: "error" });
                return;
            }

            if (already + requested > available) {
                setNotify({
                    open: true,
                    message: `Stock insuficiente. Disponible: ${available}. En carrito: ${already}`,
                    severity: "warning",
                });
                return;
            }

            addItem(product, requested);
            setNotify({ open: true, message: "Producto añadido", severity: "success" });

            setEan("");
            setQty(1);

            eanRef.current?.focus();
            btnRef.current?.focus();

        } catch (err) {
            console.error(err);
            setNotify({
                open: true,
                message: err?.message || "Error buscando producto",
                severity: "error"
            });
        }
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            doSearch();
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2.5 }}>
                <Typography variant="subtitle2"
                    fontWeight={700}
                    sx={(theme) => ({
                        px: 2,
                        py: 1,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.900",
                        color: "common.white",
                    })}>
                    EAN / SKU
                </Typography>
                <Box sx={{
                    border: "1px solid",
                    borderTop: "none",
                    borderColor: "divider",
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                    p: 2,
                }}>
                    <TextField inputRef={eanRef}
                        value={ean}
                        onChange={(e) => setEan(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="7765987453691"
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">#</InputAdornment>
                            ),
                        }} />
                </Box>
            </Grid>

            <Grid size={{ xs: 8, md: 3 }}>
                <Typography variant="subtitle2"
                    fontWeight={700}
                    textAlign="center"
                    sx={(theme) => ({
                        px: 2,
                        py: 1,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.900",
                        color: "common.white",
                    })}>
                    Cantidad
                </Typography>
                <Box sx={{
                    border: "1px solid",
                    borderTop: "none",
                    borderColor: "divider",
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}>
                    <ButtonGroup variant="outlined" size="medium">
                        <IconButton onClick={() => setQty((q) => Math.max(1, Number(q) - 1))}>
                            <RemoveRoundedIcon />
                        </IconButton>
                    </ButtonGroup>
                    <TextField value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        onKeyDown={onKeyDown}
                        inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            style: { textAlign: "center", width: 64 },
                        }}
                        variant="outlined" />
                    <ButtonGroup variant="outlined" size="medium">
                        <IconButton onClick={() => setQty((q) => Number(q) + 1)}>
                            <AddRoundedIcon />
                        </IconButton>
                    </ButtonGroup>
                </Box>
            </Grid>
            <Grid size={{ xs: 4, md: 3 }} sx={{ display: "flex", alignItems: "end", mb: 2.5 }}>
                <Button ref={btnRef}
                    onClick={doSearch}
                    variant="outlined"
                    fullWidth
                    startIcon={<SearchRoundedIcon />}
                    sx={{ height: 48, borderRadius: 2 }}>
                    Buscar
                </Button>
            </Grid>

            <NotificationBar open={notify.open}
                message={notify.message}
                severity={notify.severity}
                onClose={() => setNotify({ ...notify, open: false })} />
        </Grid>
    );
}

export default ProductInput;