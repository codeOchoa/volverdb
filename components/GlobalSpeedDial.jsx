"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {SpeedDial,
    SpeedDialAction,
    Zoom,
    styled,
    Box,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import DashboardIcon from "@mui/icons-material/Dashboard";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import LogoutIcon from "@mui/icons-material/Logout";
import LockIcon from "@mui/icons-material/Lock";

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 2000,
    "& .MuiFab-primary": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        transition: "all 0.3s ease",
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
    },
}));

export default function GlobalSpeedDial() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleToggle = () => setOpen((prev) => !prev);

    const actions = [
        { icon: <PointOfSaleIcon />, name: "Caja", route: "/sales" },
        { icon: <DashboardIcon />, name: "Panel de Control", route: "/dashboard" },
        { icon: <QueryStatsIcon />, name: "Métricas", route: "/metrics" },
        { icon: <LockIcon />, name: "Cerrar Caja", route: "/close-cash" },
        { icon: <LogoutIcon />, name: "Cerrar Sesión", route: "/logout" },
    ];

    const handleNavigate = (route) => {
        setOpen(false);
        router.push(route);
    };

    return (
        <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1500 }}>
            <Zoom in timeout={350}>
                <StyledSpeedDial ariaLabel="Menú rápido"
                    icon={open ? <CloseIcon /> : <MenuIcon />}
                    onClick={handleToggle}
                    open={open}
                    direction="up">
                    {actions.map((action) => (
                        <SpeedDialAction key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            tooltipPlacement="left"
                            onClick={() => handleNavigate(action.route)} />
                    ))}
                </StyledSpeedDial>
            </Zoom>
        </Box>
    );
}