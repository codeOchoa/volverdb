import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import db from "@/lib/db";

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
                sku,
                ean,
                Producto: name,
                Stock: stock,
                "Precio compra": cost,
                "Precio venta": price,
                "Porcentaje aplicado": percent,
                Categoría: category,
                Distribuidor: distributor,
                "Fecha ingreso": entryDate,
                "Fecha vencimiento": expiryDate
            } = row;

            if (!ean || !name || !distributor) continue;

            const [existing] = await db.query(
                "SELECT id FROM products WHERE ean = ? AND name = ? AND distributor = ?",
                [ean, name, distributor]
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
                    distributor = ?, 
                    date_in = ?, 
                    date_exp = ?, 
                    updated_at = NOW()
                    WHERE ean = ? AND name = ? AND distributor = ?`,
                    [
                        sku || null,
                        stock || 0,
                        cost || 0,
                        price || 0,
                        percent || 0,
                        category || null,
                        distributor || null,
                        entryDate || null,
                        expiryDate || null,
                        ean,
                        name,
                        distributor
                    ]
                );
                updated++;
            } else {
                await db.query(
                    `INSERT INTO products 
                    (sku, ean, name, stock, price_buy, price_sell, percent_applied, category, distributor, date_in, date_exp, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                    [
                        sku || null,
                        ean,
                        name,
                        stock || 0,
                        cost || 0,
                        price || 0,
                        percent || 0,
                        category || null,
                        distributor || null,
                        entryDate || null,
                        expiryDate || null
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