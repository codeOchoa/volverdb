"use client";

async function request(method, url, { body, headers } = {}) {
    const options = {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(headers || {}),
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);

    if (res.status === 401) {
        console.warn("🔒 Sesión expirada. Redirigiendo a login...");
        window.location.href = "/login";
        throw new Error("Unauthorized");
    }

    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        const message = data?.message || "API Error";
        throw new Error(message);
    }

    return data;
}

export const api = {
    get: (url, options) => request("GET", url, options),
    post: (url, body, options) => request("POST", url, { body, ...options }),
    put: (url, body, options) => request("PUT", url, { body, ...options }),
    delete: (url, options) => request("DELETE", url, options),
};