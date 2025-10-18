import { productsDB } from "@/lib/db";

export async function GET() {
    const products = await productsDB.find({});
    return Response.json(products);
}

export async function POST(req) {
    const newProd = await req.json();
    await productsDB.insert(newProd);
    return Response.json({ ok: true });
}

export async function PUT(req) {
    const { ean, update } = await req.json();
    await productsDB.update({ ean }, { $set: update });
    return Response.json({ ok: true });
}