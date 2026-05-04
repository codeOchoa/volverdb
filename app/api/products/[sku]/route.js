import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { sku } = params;

        const rows = await query(
            `SELECT 
            id, sku, ean, name, stock,
            price_buy AS cost, price_sell AS price,
            percent_applied, category, distributor,
            DATE_FORMAT(date_in, '%Y-%m-%d') AS entryDate,
            DATE_FORMAT(date_exp, '%Y-%m-%d') AS expiryDate
            FROM products
            WHERE sku = ? AND (deleted = 0 OR deleted IS NULL)
            LIMIT 1`,
            [sku]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Producto no encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: rows[0] },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ Error obteniendo producto:", err);
        return NextResponse.json(
            { success: false, message: "Error interno del servidor." },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        const { sku } = params;
        const data = await req.json();

        const existing = await query(
            "SELECT id, distributor FROM products WHERE sku = ? LIMIT 1",
            [sku]
        );

        if (existing.length === 0) {
            return NextResponse.json(
                { success: false, message: "Producto no encontrado." },
                { status: 404 }
            );
        }

        const id = existing[0].id;
        const distributorDB = existing[0].distributor;

        if (data.ean || data.sku) {
            const duplicate = await query(
                `SELECT id FROM products
                WHERE id != ?
                AND distributor = ?
                AND (sku = ? OR ean = ?)
                LIMIT 1`,
                [id, distributorDB, data.sku || sku, data.ean]
            );

            if (duplicate.length > 0) {
                return NextResponse.json(
                    { success: false,
                        message:
                            "Otro producto del mismo distribuidor tiene este SKU/EAN.",
                    },
                    { status: 409 }
                );
            }
        }

        const safeStock = Number(data.stock) || 0;
        const safeCost = Number(data.cost) || 0;
        const safePrice = Number(data.price) || 0;
        const safePercent = Number(data.percent) || 0;

        const safeEntryDate =
            data.entryDate?.trim()
                ? new Date(data.entryDate)
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")
                : null;

        const safeExpiryDate =
            data.expiryDate?.trim()
                ? new Date(data.expiryDate)
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")
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
            date_in = ?,
            date_exp = ?,
            updated_at = NOW()
            WHERE id = ?`,
            [
                data.sku || sku,
                data.ean,
                data.name,
                safeStock,
                safeCost,
                safePrice,
                safePercent,
                data.category || null,
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
        console.error("❌ Error actualizando producto:", err);
        return NextResponse.json(
            { success: false, message: "Error interno del servidor." },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        const { sku } = params;

        const existing = await query(
            "SELECT id FROM products WHERE sku = ? LIMIT 1",
            [sku]
        );

        if (existing.length === 0) {
            return NextResponse.json(
                { success: false, message: "Producto no encontrado." },
                { status: 404 }
            );
        }

        await query(
            `UPDATE products SET deleted = 1, updated_at = NOW() WHERE sku = ?`,
            [sku]
        );

        return NextResponse.json(
            { success: true, message: "Producto eliminado correctamente." },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ Error eliminando producto:", err);
        return NextResponse.json(
            { success: false, message: "Error interno del servidor." },
            { status: 500 }
        );
    }
}