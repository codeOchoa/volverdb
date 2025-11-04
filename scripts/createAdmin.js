import bcrypt from "bcryptjs";
import { usersDB } from "../lib/db.js";

const createAdmin = async () => {
    const hash = await bcrypt.hash("Dark1557", 10);
    await usersDB.insert({
        username: "volver",
        password: hash,
        role: "admin",
    });
    console.log("Usuario administrador creado correctamente.");
};

createAdmin();