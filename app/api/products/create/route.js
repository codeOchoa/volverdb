import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const data = await req.json();
        const { sku, ean, name, price, stock = 0, category } = data;

        if (!sku || !ean || !name || !price) {
            return NextResponse.json(
                { message: "Campos obligatorios: sku, ean, name, price" },
                { status: 400 }
            );
        }

        const [exists] = await db.query(
            "SELECT id FROM products WHERE sku = ? OR ean = ? LIMIT 1",
            [sku, ean]
        );

        if (exists.length > 0) {
            return NextResponse.json(
                { message: "Ya existe un producto con ese SKU o EAN" },
                { status: 409 }
            );
        }

        await db.query(
            `INSERT INTO products (sku, ean, name, price, stock, category)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [sku, ean, name, parseFloat(price), parseInt(stock), category || null]
        );

        return NextResponse.json({ message: "Producto creado correctamente" }, { status: 201 });
    } catch (error) {
        console.error("Error creando producto:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}
