"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Typography, Stack, Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import useToastMessage from "@/hooks/useToastMessage";
import { getDateTime } from "@/utils/getDateTime";

const OpenCashContainer = styled(Stack)(({ theme }) => ({
    height: "100dvh",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage:
        "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    ...theme.applyStyles("dark", {
        backgroundImage:
            "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
}));

export default function OpenCashPage() {
    const [amount, setAmount] = useState("");
    const router = useRouter();
    const { show } = useToastMessage();

    const handleOpenCash = async () => {
        if (!amount || Number(amount) <= 0) {
            show("Ingresá un monto válido para abrir la caja", "error");
            return;
        }

        const { date, full } = getDateTime();
        await fetch("/api/cash/open", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, initialAmount: amount, openedAt: full }),
        });

        localStorage.setItem("cashStatus", date);
        show("Caja abierta correctamente", "success");
        router.push("/sales");
    };

    return (
        <OpenCashContainer>
            <Card variant="outlined"
                sx={{ p: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    width: "100%",
                    maxWidth: 500,
                }}>
                <Typography variant="h4" textAlign="center">
                    Abrí tu caja para empezar a cobrar
                </Typography>
            
                <FormControl fullWidth sx={{ m: 1, display: "flex", flexDirection: "column", alignItems: "center" }} variant="standard" >
                    <InputLabel htmlFor="standard-adornment-amount"
                        sx={{ transform: "translateX(20%)", 
                            textAlign: "center", 
                            fontSize: "1.2rem", 
                            fontWeight: 500, 
                            top: "-4px", }}>Ingresá el monto inicial en efectivo</InputLabel>
                    <Input id="standard-adornment-amount"
                        size="normal"
                        inputProps={{ min: 0 }}
                        onChange={(e) => setAmount(e.target.value)}
                        value={amount}
                        sx={{
                            fontSize: "3rem", 
                            fontWeight: 100, 
                            height: "5rem", 
                            maxWidth: "280px", 
                            width: "100%",
                        }}
                        startAdornment={<InputAdornment position="start">
                            <Typography fontSize="1.5rem" fontWeight={100}>$</Typography>
                        </InputAdornment>} />
                </FormControl>

                <Button variant="contained"
                    size="large"
                    sx={{ mt: 2 }}
                    onClick={handleOpenCash}>
                    Abrir Caja
                </Button>
            </Card>
        </OpenCashContainer>
    );
}



