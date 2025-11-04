import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date");
        const method = searchParams.get("paymentMethod");
        const limit = parseInt(searchParams.get("limit")) || 100;
        const offset = parseInt(searchParams.get("offset")) || 0;

        let query = "SELECT * FROM sales";
        const conditions = [];
        const values = [];

        if (date) {
            conditions.push("DATE(date) = ?");
            values.push(date);
        }
        if (method) {
            conditions.push("payment_method = ?");
            values.push(method);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY date DESC LIMIT ? OFFSET ?";
        values.push(limit, offset);

        const [rows] = await db.query(query, values);

        return NextResponse.json(rows);
    } catch (err) {
        console.error("Error al listar ventas:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}