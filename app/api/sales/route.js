import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const connection = await db.getConnection();

    try {
        const { paymentMethod, subtotal, adjustment, total, items } = await req.json();

        if (
            !paymentMethod ||
            subtotal === undefined ||
            total === undefined ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return NextResponse.json(
                { ok: false, message: "Datos incompletos o venta vacía" },
                { status: 400 }
            );
        }

        await connection.beginTransaction();

        const [saleResult] = await connection.query(
            `INSERT INTO sales (date, payment_method, subtotal, adjustment, total, created_at)
            VALUES (NOW(), ?, ?, ?, ?, NOW())`,
            [
                paymentMethod,
                Number(subtotal) || 0,
                Number(adjustment) || 0,
                Number(total) || 0,
            ]
        );

        const saleId = saleResult.insertId;

        for (const item of items) {
            const ean = String(item?.ean || "").trim();
            const qty = Math.max(1, Number(item?.qty) || 1);
            const price = Number(item?.price) || 0;

            if (!ean) throw new Error("Item inválido: falta EAN.");

            const [productRows] = await connection.query(
                `SELECT id, stock
                FROM products
                WHERE ean = ? AND (deleted = 0 OR deleted IS NULL)
                LIMIT 1
                FOR UPDATE`,
                [ean]
            );

            if (productRows.length === 0) {
                throw new Error(`Producto con EAN ${ean} no encontrado`);
            }

            const productId = productRows[0].id;
            const currentStock = Number(productRows[0].stock) || 0;

            if (qty > currentStock) {
                throw new Error(`Stock insuficiente para EAN ${ean}. Disponible: ${currentStock}`);
            }

            await connection.query(
                `INSERT INTO sale_items (sale_id, product_id, quantity, price)
                VALUES (?, ?, ?, ?)`,
                [saleId, productId, qty, price]
            );

            await connection.query(
                `UPDATE products
                SET stock = stock - ?, updated_at = NOW()
                WHERE id = ?`,
                [qty, productId]
            );
        }

        await connection.commit();
        return NextResponse.json({ ok: true, saleId }, { status: 201 });
    } catch (err) {
        console.error("❌ Error registrando venta:", err);
        try {
            await connection.rollback();
        } catch { }

        return NextResponse.json(
            { ok: false, message: "Error al registrar la venta", error: err.message },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}