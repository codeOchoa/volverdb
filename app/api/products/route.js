import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const ean = searchParams.get("ean");
        const name = searchParams.get("name");
        const distributor = searchParams.get("distributor");
        const limit = Number(searchParams.get("limit")) || 100;
        const offset = Number(searchParams.get("offset")) || 0;

        let sql = `SELECT 
            id,
            sku,
            ean,
            name,
            stock,
            price_buy AS cost,
            price_sell AS price,
            percent_applied,
            category,
            distributor,
            DATE_FORMAT(date_in, '%Y-%m-%d') AS entryDate,
            DATE_FORMAT(date_exp, '%Y-%m-%d') AS expiryDate
            FROM products
            WHERE (deleted = 0 OR deleted IS NULL)`;

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

        if (distributor) {
            conditions.push("distributor = ?");
            values.push(distributor);
        }

        if (conditions.length > 0) {
            sql += " AND " + conditions.join(" AND ");
        }

        sql += " ORDER BY id DESC LIMIT ? OFFSET ?";
        values.push(limit, offset);

        const rows = await query(sql, values);

        return NextResponse.json(
            { success: true,
                count: rows.length,
                data: rows,
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ Error al obtener productos:", err);
        return NextResponse.json(
            { success: false, message: "Error interno del servidor." },
            { status: 500 }
        );
    }
}

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
            percent = 0,
        } = data;

        if (!sku || !ean || !name || !cost || !distributor) {
            return NextResponse.json(
                { success: false,
                    message: "Campos obligatorios: sku, ean, name, cost, distributor.",
                },
                { status: 400 }
            );
        }

        const duplicate = await query(
            `SELECT id FROM products
            WHERE distributor = ?
            AND (sku = ? OR ean = ?)
            LIMIT 1`,
            [distributor, sku, ean]
        );

        if (duplicate.length > 0) {
            return NextResponse.json(
                { success: false,
                    message: "Ya existe un producto con este SKU/EAN para este distribuidor.",
                },
                { status: 409 }
            );
        }

        const safeStock = Number(stock) || 0;
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
            `INSERT INTO products
            (sku, ean, name, price_buy, price_sell, stock, category, distributor, percent_applied, date_in, date_exp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                sku,
                ean,
                name,
                safePriceBuy,
                safePriceSell,
                safeStock,
                category || null,
                distributor,
                safePercent,
                safeEntryDate,
                safeExpiryDate,
            ]
        );

        return NextResponse.json(
            { success: true,
                message: "Producto cargado correctamente.",
            },
            { status: 201 }
        );

    } catch (err) {
        console.error("❌ Error creando producto vía upload:", err);
        return NextResponse.json(
            { success: false, message: "Error interno del servidor." },
            { status: 500 }
        );
    }
}