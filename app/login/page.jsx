"use client";

import * as React from 'react';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, 
    Button, 
    Card as MuiCard, 
    Checkbox, 
    FormControl, 
    FormControlLabel, 
    FormLabel, 
    Link, 
    TextField, 
    Typography, 
    Stack, 
    styled 
} from '@mui/material';
import { LoadingOverlay, NotificationBar } from "@/components/index";
// import { ForgotPassword } from '../../components/index';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    alignItems: "center",
    justifyContent: "center",
    backgroundImage:
        "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles("dark", {
        backgroundImage:
            "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
    transition: theme.transitions.create("background-image", {
        duration: theme.transitions.duration.standard,
    }),
}));

export default function LoginPage() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [notify, setNotify] = useState({ open: false, message: "", severity: "info" });
    // const [open, setOpen] = React.useState(false);
    const router = useRouter();

    // const handleClickOpen = () => { setOpen(true); };
    // const handleClose = () => { setOpen(false); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setNotify({ open: true, message: "Inicio de sesión correcto", severity: "success" });
                setTimeout(() => router.push("/open-cash"), 800);
            } else {
            setNotify({ open: true, message: "Usuario o contraseña incorrectos", severity: "error" });
            }
        } catch (err) {
            console.error(err);
            setNotify({ open: true, message: "Error de conexión", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SignInContainer direction="column" justifyContent="space-between">
            <Card variant="outlined">
                <Typography component="h1"
                    variant="h4"
                    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                    Inicio de Sesión
                </Typography>
                <Box component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}>
                    <FormControl>
                        <FormLabel htmlFor="username">Usuario</FormLabel>
                        <TextField id="username"
                            type="text"
                            name="username"
                            placeholder="tu_usuario"
                            autoComplete="username"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setForm({ ...form, username: e.target.value })} />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Contraseña</FormLabel>
                        <TextField name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            required
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    </FormControl>
                    <FormControlLabel control={<Checkbox value="remember" color="primary" />}
                        label="Recordar" />
                    {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
                    <Button type="submit"
                        fullWidth disabled={loading}
                        variant="contained">
                        Iniciar Sesión
                    </Button>
                    <Link type="button"
                        // component="button"
                        // onClick={handleClickOpen}
                        variant="body2"
                        sx={{ alignSelf: 'center' }}
                        href="https://wa.me/542235432090?text=Olvide%20mi%20contraseña">
                        Olvidaste tu contraseña?
                    </Link>
                </Box>
            </Card>
            <NotificationBar open={notify.open}
                message={notify.message}
                severity={notify.severity}
                onClose={() => setNotify({ ...notify, open: false })} />
            <LoadingOverlay active={loading} />
        </SignInContainer>
    );
}