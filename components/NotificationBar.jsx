"use client";

import { Snackbar, Alert } from "@mui/material";
import { useState, forwardRef } from "react";

const NotificationBar = forwardRef(({ open, message, severity, onClose }, ref) => (
    <Snackbar ref={ref}
        open={open}
        onClose={onClose}
        autoHideDuration={2200}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
            {message}
        </Alert>
    </Snackbar>
));

NotificationBar.displayName = "NotificationBar";

export default NotificationBar;