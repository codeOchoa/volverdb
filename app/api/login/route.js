import { loginUser } from "@/lib/auth";

export async function POST(req) {
    const { username, password } = await req.json();
    const token = await loginUser(username, password);
    if (!token) return Response.json({ error: "Credenciales inválidas" }, { status: 401 });
    return Response.json({ token });
}