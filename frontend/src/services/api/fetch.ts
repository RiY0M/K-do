import { clearSession, getToken } from "../authStorage";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// French versions of the error messages sent by the backend
const errorMessages: Record<string, string> = {
    "Invalid credentials": "Nom ou mot de passe incorrect",
    "Username already taken": "Ce nom est déjà pris",
    "Email already used": "Cet e-mail est déjà utilisé",
    "Username or email already used": "Ce nom ou cet e-mail est déjà utilisé",
    "User not found": "Utilisateur introuvable",
    "You cannot add yourself as a friend": "Vous ne pouvez pas vous ajouter vous-même",
    "You are already friends": "Vous êtes déjà amis",
    "Friend request already sent": "Demande déjà envoyée",
    "Friend request not found": "Demande introuvable",
    "Friend not found": "Ami introuvable",
    "You are not friends with this user": "Vous n'êtes pas ami avec cette personne",
    "Invitation not found": "Invitation introuvable",
    "This invitation has expired": "Cette invitation a expiré",
    "You cannot accept your own invitation": "Vous ne pouvez pas accepter votre propre invitation",
    "List not found": "Liste introuvable",
    "Item not found": "Cadeau introuvable",
    "No email address on this account": "Aucun e-mail n'est renseigné sur ce compte : impossible de réinitialiser le mot de passe",
    "Please wait a minute before asking for another email": "Patientez une minute avant de redemander un e-mail",
    "Invalid or already used reset link": "Ce lien est invalide ou a déjà été utilisé",
    "This reset link has expired": "Ce lien a expiré, demandez-en un nouveau",
};

async function getErrorMessage(res: Response, defaultErrorMessage: string): Promise<string> {
    try {
        const data = await res.json();
        // Our routes send { error }, Fastify's own errors (validation...) { error, message }
        const message = data?.message ?? data?.error;
        return typeof message === "string" ? errorMessages[message] ?? message : defaultErrorMessage;
    } catch {
        return defaultErrorMessage;
    }
}

async function handleFetch<T>(endpoint: string, method: Method, object: RequestInit = {}, defaultErrorMessage = "Erreur inconnue"): Promise<T> {
    const token = getToken();

    const res = await fetch(API_URL + endpoint, {
        method: method,
        headers: {
            // Only announce JSON when there is a body: Fastify rejects an
            // empty body sent as application/json (e.g. POST /kdo/me/create)
            ...(object.body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...object
    });

    // Expired or invalid session: log in again, then come back here
    if (res.status === 401 && token && !endpoint.startsWith("/auth")) {
        clearSession();
        window.location.assign(`/login/${encodeURIComponent(window.location.pathname)}`);
    }

    if (res.status === 403) {
        window.location.replace(`/forbidden/${encodeURIComponent(window.location.pathname)}`);
    }

    if (!res.ok) {
        throw new Error(await getErrorMessage(res, defaultErrorMessage));
    }

    return await res.json();
}

export async function getFetch<T>(endpoint: string, object: RequestInit = {}, defaultErrorMessage = "Erreur inconnue") {
    return await handleFetch<T>(endpoint, "GET", object, defaultErrorMessage)
}

export async function postFetch<T>(endpoint: string, object: RequestInit = {}, defaultErrorMessage = "Erreur inconnue") {
    return await handleFetch<T>(endpoint, "POST", object, defaultErrorMessage)
}

export async function putFetch<T>(endpoint: string, object: RequestInit = {}, defaultErrorMessage = "Erreur inconnue") {
    return await handleFetch<T>(endpoint, "PUT", object, defaultErrorMessage)
}

export async function patchFetch<T>(endpoint: string, object: RequestInit = {}, defaultErrorMessage = "Erreur inconnue") {
    return await handleFetch<T>(endpoint, "PATCH", object, defaultErrorMessage)
}

export async function deleteFetch<T>(endpoint: string, object: RequestInit = {}, defaultErrorMessage = "Erreur inconnue") {
    return await handleFetch<T>(endpoint, "DELETE", object, defaultErrorMessage)
}
