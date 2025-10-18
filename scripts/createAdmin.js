import bcrypt from "bcryptjs";
import { usersDB } from "../lib/db.js";

const createAdmin = async () => {
    const hash = await bcrypt.hash("13mortadelas", 10);
    await usersDB.insert({
        username: "raviol",
        password: hash,
        role: "admin",
    });
    console.log("Usuario administrador creado correctamente.");
};

createAdmin();