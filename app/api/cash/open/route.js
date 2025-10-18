import { cashDB } from "@/lib/db";

export async function POST(req) {
    const { date, initialAmount } = await req.json();

    await cashDB.insert({
        date,
        initialAmount: parseFloat(initialAmount),
        openedAt: new Date(),
    });

    return Response.json({ ok: true });
}