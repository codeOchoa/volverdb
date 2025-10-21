"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

function ConfirmDialog({
    open,
    title,
    message,
    confirmText = "Continuar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
}) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            {message && (
                <DialogContent>
                    <DialogContentText>{message}</DialogContentText>
                </DialogContent>
            )}
            <DialogActions>
                <Button variant="outlined" onClick={onCancel}>
                    {cancelText}
                </Button>
                <Button variant="contained" onClick={onConfirm}>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;