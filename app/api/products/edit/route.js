import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const data = await req.json();

        const {
            id,
            sku,
            ean,
            name,
            stock,
            cost,
            price,
            percent,
            category,
            distributor,
            entryDate,
            expiryDate
        } = data;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID es obligatorio." },
                { status: 400 }
            );
        }

        if (!ean || !name || !distributor) {
            return NextResponse.json(
                { success: false, message: "EAN, nombre y distribuidor son obligatorios." },
                { status: 400 }
            );
        }

        const existing = await query(
            "SELECT * FROM products WHERE id = ? LIMIT 1",
            [id]
        );

        if (existing.length === 0) {
            return NextResponse.json(
                { success: false, message: "Producto no encontrado." },
                { status: 404 }
            );
        }

        const duplicate = await query(
            `SELECT id FROM products
            WHERE (sku = ? AND distributor = ? AND id != ?)
            OR (ean = ? AND distributor = ? AND id != ?)
            LIMIT 1`,
            [sku, distributor, id, ean, distributor, id]
        );

        if (duplicate.length > 0) {
            return NextResponse.json(
                { success: false,
                    message: "Ya existe otro producto con este SKU/EAN asociado al mismo distribuidor.",
                },
                { status: 409 }
            );
        }

        const safeStock = Number.parseInt(stock, 10) || 0;
        const safePriceBuy = Number(cost) || 0;
        const safePriceSell = Number(price) || 0;
        const safePercent = Number(percent) || 0;

        const safeEntryDate =
            entryDate?.trim()
                ? new Date(entryDate).toISOString().slice(0, 19).replace("T", " ")
                : null;

        const safeExpiryDate =
            expiryDate?.trim()
                ? new Date(expiryDate).toISOString().slice(0, 19).replace("T", " ")
                : null;

        await query(
            `UPDATE products SET
            sku = ?,
            ean = ?,
            name = ?,
            stock = ?,
            price_buy = ?,
            price_sell = ?,
            percent_applied = ?,
            category = ?,
            distributor = ?,
            date_in = ?,
            date_exp = ?,
            updated_at = NOW()
            WHERE id = ?`,
            [
                sku || null,
                ean,
                name,
                safeStock,
                safePriceBuy,
                safePriceSell,
                safePercent,
                category || null,
                distributor,
                safeEntryDate,
                safeExpiryDate,
                id,
            ]
        );

        return NextResponse.json(
            { success: true, message: "Producto actualizado correctamente." },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ Error al editar producto:", err);
        return NextResponse.json(
            { success: false,
                message: "Error interno del servidor.",
                details: process.env.NODE_ENV ? err.message : undefined,
            },
            { status: 500 }
        );
    }
}