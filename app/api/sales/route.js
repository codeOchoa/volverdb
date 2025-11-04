import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const connection = await db.getConnection(); 

    try {
        const { date, paymentMethod, subtotal, adjustment, total, items } = await req.json();

        if (!date || !paymentMethod || !subtotal || !total || !items || items.length === 0) {
            return NextResponse.json(
                { ok: false, message: "Datos incompletos o venta vacía" },
                { status: 400 }
            );
        }

        await connection.beginTransaction();

        // 1️⃣ Insertar la venta principal
        const [saleResult] = await connection.query(
            `INSERT INTO sales (date, payment_method, subtotal, adjustment, total, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())`,
            [date, paymentMethod, subtotal, adjustment, total]
        );

        const saleId = saleResult.insertId;

        for (const item of items) {
            const [productRows] = await connection.query("SELECT id, stock FROM products WHERE id = ?", [item.id]);
            if (productRows.length === 0) {
                throw new Error(`Producto con ID ${item.id} no encontrado`);
            }

            await connection.query(
                `INSERT INTO sale_items (sale_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)`,
                [saleId, item.id, item.qty, item.price]
            );

            const newStock = Math.max(productRows[0].stock - item.qty, 0);
            await connection.query("UPDATE products SET stock = ? WHERE id = ?", [newStock, item.id]);
        }

        await connection.commit();
        return NextResponse.json({ ok: true, saleId }, { status: 201 });
    } catch (err) {
        console.error("❌ Error registrando venta:", err);
        await connection.rollback();
        return NextResponse.json(
            { ok: false, message: "Error al registrar la venta", error: err.message },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}