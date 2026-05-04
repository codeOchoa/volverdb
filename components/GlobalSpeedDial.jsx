"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Box, 
    SpeedDial, 
    SpeedDialAction, 
    SpeedDialIcon, 
    Zoom
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { useLogout } from "@/hooks/useLogout";

export default function GlobalSpeedDial() {
    const router = useRouter();
    const logout = useLogout(); 
    const [open, setOpen] = useState(false);

    const actions = [
        { icon: <PointOfSaleIcon />, name: "Caja", route: "/sales" },
        { icon: <DashboardIcon />, name: "Panel de Control", route: "/dashboard" },
        { icon: <QueryStatsIcon />, name: "Métricas", route: "/metrics" },
        { icon: <LockIcon />, name: "Cerrar Caja", route: "/close-cash" },
        { icon: <LogoutIcon />, name: "Cerrar Sesión", logout: true },
    ];

    const handleAction = (action) => {
        setOpen(false);

        if (action.logout) {
            logout(); 
        } else {
            router.push(action.route);
        }
    };

    return (
        <Box sx={{ position: "fixed", top: 24, left: 24, zIndex: 1500 }}>
            <Zoom in timeout={350}>
                <SpeedDial ariaLabel="Menú rápido"
                    open={open}
                    onClick={() => setOpen((o) => !o)}
                    direction="down"
                    icon={<SpeedDialIcon icon={<MenuIcon />} openIcon={<CloseIcon />} />}
                    slotProps={{
                        fab: { color: "primary",
                            disableRipple: false,
                            sx: { transition: "background-color 0.3s ease",
                                "&:hover": { backgroundColor: "primary.dark", },
                            },
                        },
                    }}>
                    {actions.map((action) => (
                        <SpeedDialAction key={action.name}
                            icon={action.icon}
                            onClick={() => handleAction(action)}
                            // onClick={() => {
                            //     setOpen(false);
                            //     router.push(action.route);
                            // }}
                            slotProps={{
                                fab: { disableRipple: false, },
                                tooltip: {
                                    title: action.name,
                                    placement: "right",
                                },
                            }} />
                    ))}
                </SpeedDial>
            </Zoom>
        </Box>
    );
}