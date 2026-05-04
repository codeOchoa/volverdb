import bcrypt from "bcryptjs";
import { pool, query } from "../lib/db.js";

const ADMIN_USERNAME = "volver";
const ADMIN_PASSWORD = "Dark1557";
const ADMIN_ROLE = "admin";

async function createAdmin() {
    try {
        console.log("🔐 Creando usuario administrador...");

        const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

        const existing = await query(
            "SELECT id FROM users WHERE username = ? LIMIT 1",
            [ADMIN_USERNAME]
        );

        if (existing.length > 0) {
            console.log("⚠️ El usuario administrador ya existe. Actualizando contraseña...");
            
            await query(
                "UPDATE users SET password = ?, role = ? WHERE username = ?",
                [hash, ADMIN_ROLE, ADMIN_USERNAME]
            );

            console.log("✔ Contraseña del administrador actualizada.");
            process.exit(0);
        }

        await query(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            [ADMIN_USERNAME, hash, ADMIN_ROLE]
        );

        console.log("✔ Usuario administrador creado correctamente.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error al crear el administrador:", error);
        process.exit(1);
    }
}

createAdmin();