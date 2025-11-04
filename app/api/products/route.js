import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const ean = searchParams.get("ean");
        const name = searchParams.get("name");
        const category = searchParams.get("category");
        const limit = parseInt(searchParams.get("limit")) || 100;
        const offset = parseInt(searchParams.get("offset")) || 0;

        let query = "SELECT * FROM products";
        const conditions = [];
        const values = [];

        if (ean) {
            conditions.push("ean = ?");
            values.push(ean);
        }

        if (name) {
            conditions.push("name LIKE ?");
            values.push(`%${name}%`);
        }

        if (category) {
            conditions.push("category = ?");
            values.push(category);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY id DESC LIMIT ? OFFSET ?";
        values.push(limit, offset);

        const [rows] = await db.query(query, values);

        return NextResponse.json(rows);
    } catch (err) {
        console.error("Error al obtener productos:", err);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}

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
            "INSERT INTO products (sku, ean, name, price, stock, category) VALUES (?, ?, ?, ?, ?, ?)",
            [sku, ean, name, parseFloat(price), parseInt(stock), category || null]
        );

        return NextResponse.json({ message: "Producto creado correctamente" }, { status: 201 });
    } catch (err) {
        console.error("Error al crear producto:", err);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}