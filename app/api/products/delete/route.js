import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const ean = searchParams.get("ean");
        const distributor = searchParams.get("distributor");

        if (!ean) {
            return NextResponse.json(
                { success: false, message: "Falta el parámetro 'ean'." },
                { status: 400 }
            );
        }

        if (!distributor) {
            return NextResponse.json(
                { success: false, message: "Falta el parámetro 'distributor'." },
                { status: 400 }
            );
        }

        const rows = await query(
            `SELECT id 
            FROM products 
            WHERE ean = ? 
            AND distributor = ?
            AND (deleted = 0 OR deleted IS NULL)
            LIMIT 1`,
            [ean, distributor]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { success: false,
                    message: "Producto no encontrado para este distribuidor.",
                },
                { status: 404 }
            );
        }

        const productId = rows[0].id;

        await query(
            `UPDATE products 
            SET deleted = 1, updated_at = NOW()
            WHERE id = ?`,
            [productId]
        );

        return NextResponse.json(
            { success: true,
                message: "Producto eliminado correctamente.",
                id: productId,
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ Error al eliminar producto:", err);

        return NextResponse.json(
            { success: false,
                message: "Error interno del servidor.",
                details: process.env.NODE_ENV ? err.message : undefined,
            },
            { status: 500 }
        );
    }
}