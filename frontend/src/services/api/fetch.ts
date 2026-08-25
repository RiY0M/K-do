import { getToken } from "../authStorage";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function handleFetch(endpoint: string, method: Method, object: object = {}, defaultErrorMessage = "Erreur inconnue") {
    const token = getToken();

    const res = await fetch(API_URL + endpoint, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...object
    });

    if (res.status === 403) {
        window.location.replace(`/forbidden/${encodeURIComponent(window.location.href)}`);
    }

    if (!res.ok) {
        throw new Error(defaultErrorMessage);
    }

    return await res.json();
}

export async function getFetch(endpoint: string, object: object = {}, defaultErrorMessage = "Erreur inconnue") {
    return await handleFetch(endpoint, "GET", object, defaultErrorMessage)
}

export async function postFetch(endpoint: string, object: object = {}, defaultErrorMessage = "Erreur inconnue") {
    return await handleFetch(endpoint, "POST", object, defaultErrorMessage)
}

export async function putFetch(endpoint: string, object: object = {}, defaultErrorMessage = "Erreur inconnue") {
    return await handleFetch(endpoint, "PUT", object, defaultErrorMessage)
}

export async function patchFetch(endpoint: string, object: object = {}, defaultErrorMessage = "Erreur inconnue") {
    return await handleFetch(endpoint, "PATCH", object, defaultErrorMessage)
}

export async function deleteFetch(endpoint: string, object: object = {}, defaultErrorMessage = "Erreur inconnue") {
    return await handleFetch(endpoint, "DELETE", object, defaultErrorMessage)
}
