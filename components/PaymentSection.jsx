"use client";

import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useCart } from "@/store/useCart";

const METHODS = [ "Efectivo", "QR", "Tarjeta Debito", "Tarjeta Credito", "Transferencia", "NFC", "Link", "Otros" ];

function PaymentSection() {
    const paymentMethod = useCart((s) => s.paymentMethod);
    const setPaymentMethod = useCart((s) => s.setPaymentMethod);

    return (
        <Box sx={{ mt: 2 }}>
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
                Método de Pago
            </Typography>
            <Box
                sx={{ border: "1px solid",
                    borderTop: "none",
                    borderColor: "divider",
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                    p: 2,
                }}>
                <FormControl fullWidth>
                    <InputLabel id="payment-method-label">Seleccionar</InputLabel>
                    <Select labelId="payment-method-label"
                        value={paymentMethod}
                        label="Seleccionar"
                        onChange={(e) => setPaymentMethod(e.target.value)}>
                        {METHODS.map((method) => (
                            <MenuItem key={method} value={method}>
                                {method}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
}

export default PaymentSection;