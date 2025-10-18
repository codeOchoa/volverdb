import { productsDB } from "@/lib/db";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const ean = searchParams.get("ean");
    if (!ean) return Response.json({ error: "ean requerido" }, { status: 400 });
    const prod = await productsDB.findOne({ ean });
    if (!prod) return Response.json(null, { status: 404 });
    return Response.json(prod);
}