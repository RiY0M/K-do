import { getToken } from "./authStorage";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function handleFetch(endpoint: string, method: Method, object: object = {}) {
    try {
        const token = getToken();

        const res = await fetch(API_URL + endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            ...object
        });

        if (!res.ok) {
            throw new Error("Something went wrong");
        }

        return await res.json();
    } catch (error) {
        console.log(error)
        return null;
    }
}

export async function getFetch(endpoint: string, object: object = {}) {
    return await handleFetch(endpoint, "GET", object)
}

export async function postFetch(endpoint: string, object: object = {}) {
    return await handleFetch(endpoint, "POST", object)
}

export async function putFetch(endpoint: string, object: object = {}) {
    return await handleFetch(endpoint, "PUT", object)
}

export async function patchFetch(endpoint: string, object: object = {}) {
    return await handleFetch(endpoint, "PATCH", object)
}

export async function deleteFetch(endpoint: string, object: object = {}) {
    return await handleFetch(endpoint, "DELETE", object)
}
