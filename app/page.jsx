"use client";

import * as React from 'react';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const cashStatus = localStorage.getItem("cashStatus");

        if (!token) {
            router.replace("/login");
            return;
        }

        const today = new Date().toISOString().split("T")[0];
        const cajaAbierta = cashStatus === today;

        if (!cajaAbierta) {
            router.replace("/open-cash");
        } else {
            router.replace("/sales");
        }
    }, [router]);

    return (
        <Box sx={{ width: '100%',
            position: 'fixed',
            bottom: '0rem',
            left: '0rem',
        }}>
            <LinearProgress />
        </Box>
    );
}
