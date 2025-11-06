import db from "@/lib/db";
import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";

export const runtime = "nodejs";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "Archivo CSV requerido" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const csvText = buffer.toString("utf-8");

        const records = parse(csvText, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        let inserted = 0;
        let updated = 0;

        for (const row of records) {
            const {
                SKU,
                EAN,
                Producto,
                Stock,
                "Precio compra": price_buy,
                "Precio venta": price_sell,
                "Porcentaje aplicado": percent_applied,
                Categoría,
                Distribuidor,
                "Fecha ingreso": date_in,
                "Fecha vencimiento": date_exp,
            } = row;

            if (!EAN || !Producto || !Distribuidor) continue;

            const [existing] = await db.query(
                "SELECT id FROM products WHERE ean = ? AND name = ? AND distributor = ?",
                [EAN, Producto, Distribuidor]
            );

            if (existing.length > 0) {
                await db.query(
                    `UPDATE products SET 
                    sku = ?, 
                    stock = ?, 
                    price_buy = ?, 
                    price_sell = ?, 
                    percent_applied = ?, 
                    category = ?, 
                    date_in = ?, 
                    date_exp = ?, 
                    updated_at = NOW()
                    WHERE ean = ? AND name = ? AND distributor = ?`,
                    [
                        SKU,
                        Stock || 0,
                        price_buy || 0,
                        price_sell || null,
                        percent_applied || null,
                        Categoría || null,
                        date_in || null,
                        date_exp || null,
                        EAN,
                        Producto,
                        Distribuidor,
                    ]
                );
                updated++;
            } else {
                await db.query(
                    `INSERT INTO products 
                    (sku, ean, name, stock, price_buy, price_sell, percent_applied, category, distributor, date_in, date_exp) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        SKU,
                        EAN,
                        Producto,
                        Stock || 0,
                        price_buy || 0,
                        price_sell || null,
                        percent_applied || null,
                        Categoría || null,
                        Distribuidor,
                        date_in || null,
                        date_exp || null,
                    ]
                );
                inserted++;
            }
        }

        return NextResponse.json({
            message: "Importación completada",
            inserted,
            updated,
        });
    } catch (err) {
        console.error("Error al procesar CSV:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}