import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const data = await req.json();

        const {
            sku,
            ean,
            name,
            cost,
            price,
            stock = 0,
            category,
            distributor,
            entryDate,
            expiryDate,
        } = data;

        if (!sku || !ean || !name || !cost || !distributor) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Campos obligatorios: sku, ean, name, cost, distributor",
                },
                { status: 400 }
            );
        }

        const exists = await query(
            `SELECT id
            FROM products
            WHERE (sku = ? AND distributor = ?)
            OR (ean = ? AND distributor = ?)
            LIMIT 1`,
            [sku, distributor, ean, distributor]
        );

        if (exists.length > 0) {
            return NextResponse.json(
                { success: false,
                    message: "Ya existe un producto con este SKU/EAN para este mismo distribuidor.",
                },
                { status: 409 }
            );
        }

        const safePriceBuy = Number(cost) || 0;
        const safePriceSell = Number(price) || 0;
        const safeStock = Number.parseInt(stock, 10) || 0;

        const safeEntryDate =
            entryDate?.trim() ? new Date(entryDate).toISOString().slice(0, 19).replace("T", " ") : null;

        const safeExpiryDate =
            expiryDate?.trim() ? new Date(expiryDate).toISOString().slice(0, 19).replace("T", " ") : null;

        await query(
            `INSERT INTO products
            (sku, ean, name, price_buy, price_sell, stock, category, distributor, date_in, date_exp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [ sku,
                ean,
                name,
                safePriceBuy,
                safePriceSell,
                safeStock,
                category || null,
                distributor,
                safeEntryDate,
                safeExpiryDate,
            ]
        );

        return NextResponse.json(
            { success: true,
                message: "Producto creado correctamente.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("❌ Error creando producto:", error);
        return NextResponse.json(
            { success: false,
                message: "Error interno del servidor.",
                error: process.env.NODE_ENV ? error.message : undefined,
            },
            { status: 500 }
        );
    }
}