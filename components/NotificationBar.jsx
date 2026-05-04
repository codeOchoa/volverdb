"use client";

import { forwardRef } from "react";
import { Alert, Snackbar } from "@mui/material";

const NotificationBar = forwardRef(
    ({ open, message, severity = "info", onClose }, ref) => {
        const validSeverity =
            ["success", "info", "warning", "error"].includes(severity)
                ? severity
                : "info";

        const duration = validSeverity === "error" ? 4000 : 2200;

        return (
            <Snackbar ref={ref}
                open={open}
                onClose={onClose}
                key={message}
                autoHideDuration={duration}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert onClose={onClose}
                    severity={validSeverity}
                    variant="filled"
                    sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>
        );
    }
);

NotificationBar.displayName = "NotificationBar";

export default NotificationBar;