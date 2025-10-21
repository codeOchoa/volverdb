"use client";

import { Box, LinearProgress } from "@mui/material";

function LoadingOverlay({ active = false }) {
    if (!active) return null;

    return (
        <>
            {/* Blur sobre el contenido */}
            <Box sx={{
                    position: "fixed",
                    inset: 0,
                    backdropFilter: "blur(4px)",
                    backgroundColor: "rgba(0,0,0,0.1)",
                    zIndex: 1200,
                }} />
            {/* Barra de progreso inferior */}
            <Box sx={{
                    width: "100%",
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    zIndex: 1300,
                }}>
                <LinearProgress />
            </Box>
        </>
    );
}

export default LoadingOverlay;