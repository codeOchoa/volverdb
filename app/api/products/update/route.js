import { NextResponse } from "next/server";
import db from "@/lib/db";
import csv from "csv-parser";
import { Readable } from "stream";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const results = [];

        await new Promise((resolve, reject) => {
            Readable.from(buffer.toString())
                .pipe(csv({ separator: ",", skipLines: 0 }))
                .on("data", (row) => results.push(row))
                .on("end", resolve)
                .on("error", reject);
        });

        if (results.length === 0) {
            return NextResponse.json({ error: "El archivo CSV está vacío" }, { status: 400 });
        }

        let inserted = 0;
        let updated = 0;

        for (const r of results) {
            const {
                sku,
                ean,
                Producto: name,
                Stock: stock,
                "Precio compra": price_buy,
                "Precio venta": price_sell,
                "Porcentaje aplicado": percent_applied,
                Categoría: category,
                Distribuidor: distributor,
                "Fecha ingreso": date_in,
                "Fecha vencimiento": date_exp
            } = r;

            if (!ean || !name || !distributor) continue;

            let percent = percent_applied;
            if (!percent && price_buy > 0 && price_sell > 0) {
                percent = (((price_sell - price_buy) / price_buy) * 100).toFixed(2);
            }

            const [exists] = await db.query(
                "SELECT id FROM products WHERE ean = ? AND name = ? AND distributor = ?",
                [ean, name, distributor]
            );

            if (exists.length > 0) {
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
                        price_buy || 0,
                        price_sell || 0,
                        percent || 0,
                        category || null,
                        distributor || null,
                        date_in || null,
                        date_exp || null,
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
                        price_buy || 0,
                        price_sell || 0,
                        percent || 0,
                        category || null,
                        distributor || null,
                        date_in || null,
                        date_exp || null
                    ]
                );
                inserted++;
            }
        }

        return NextResponse.json({
            message: "Carga procesada correctamente",
            inserted,
            updated,
        });
    } catch (err) {
        console.error("Error al procesar CSV:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}