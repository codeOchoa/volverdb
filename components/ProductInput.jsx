"use client";

import { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    ButtonGroup,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useCart } from "@/store/useCart";
import { toast } from "./Toast";
import { validateEAN } from "@/utils/validateEAN";

function ProductInput() {
    const [ean, setEan] = useState("");
    const [qty, setQty] = useState(1);
    const addItem = useCart((s) => s.addItem);
    const btnRef = useRef(null);
    const eanRef = useRef(null);

    useEffect(() => {
        eanRef.current?.focus();
    }, []);

    const doSearch = async () => {
        if (!ean) return;
        if (!validateEAN(ean)) {
            toast.err("Código inválido");
            return;
        }
        const res = await fetch(`/api/products/find?ean=${encodeURIComponent(ean)}`);
        const data = await res.json();
        if (!res.ok || !data) {
            toast.err("Producto no registrado / inexistente");
            return;
        }
        addItem(data, Number(qty) || 1);
        toast.ok("Producto añadido");
        setEan("");
        setQty(1);
        eanRef.current?.focus();
        btnRef.current?.focus();
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            doSearch();
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
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
                            startAdornment: <InputAdornment position="start">#</InputAdornment>,
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
                        p: 1.25,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}>
                    <ButtonGroup variant="outlined" size="medium" sx={{ flexShrink: 0 }}>
                        <IconButton onClick={() => setQty((q) => Math.max(1, Number(q) - 1))}>
                            <RemoveRoundedIcon />
                        </IconButton>
                    </ButtonGroup>
                    <TextField value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        onKeyDown={onKeyDown}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*", style: { textAlign: "center", width: 64 } }}
                        variant="outlined" />
                    <ButtonGroup variant="outlined" size="medium" sx={{ flexShrink: 0 }}>
                        <IconButton onClick={() => setQty((q) => Number(q) + 1)}>
                            <AddRoundedIcon />
                        </IconButton>
                    </ButtonGroup>
                </Box>
            </Grid>

            <Grid size={{ xs: 4, md: 3 }} sx={{ display: "flex", alignItems: "end" }}>
                <Button ref={btnRef}
                    onClick={doSearch}
                    variant="outlined"
                    fullWidth
                    startIcon={<SearchRoundedIcon />}
                    sx={{ height: 48, borderRadius: 2 }}>
                    Buscar
                </Button>
            </Grid>
        </Grid>
    );
}

export default ProductInput;