"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import AppTheme from "./shared-theme/AppTheme";
import ColorModeSelect from "./shared-theme/ColorModeSelect";

export default function ClientThemeWrapper({ children }) {
    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <Box sx={{
                    position: "relative",
                    minHeight: "100dvh",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "background.default",
                }}>
                <ColorModeSelect sx={{
                        position: "fixed",
                        top: "1rem",
                        right: "1rem",
                        zIndex: 1200,
                    }} />
                {children}
            </Box>
        </AppTheme>
    );
}