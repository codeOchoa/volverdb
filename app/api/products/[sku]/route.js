import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { sku } = params;
        const [rows] = await db.query("SELECT * FROM products WHERE sku = ? LIMIT 1", [sku]);

        if (rows.length === 0) {
            return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (err) {
        console.error("Error obteniendo producto:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { sku } = params;
        const data = await req.json();

        const [exists] = await db.query("SELECT id FROM products WHERE sku = ? LIMIT 1", [sku]);
        if (exists.length === 0) {
            return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
        }

        await db.query("UPDATE products SET ? WHERE sku = ?", [data, sku]);

        return NextResponse.json({ message: "Producto actualizado correctamente" });
    } catch (err) {
        console.error("Error actualizando producto:", err);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { sku } = params;

        const [exists] = await db.query("SELECT id FROM products WHERE sku = ? LIMIT 1", [sku]);
        if (exists.length === 0) {
            return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
        }

        await db.query("DELETE FROM products WHERE sku = ?", [sku]);

        return NextResponse.json({ message: "Producto eliminado correctamente" });
    } catch (err) {
        console.error("Error eliminando producto:", err);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}