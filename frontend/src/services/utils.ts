import { CSSProperties } from "react";
import { useParams } from "react-router-dom";

export type CSS = Record<string, CSSProperties>

export const listSectionIdealWidth = "350px";
export const groupSectionIdealWidth = "250px";
export const formSectionIdealWidth = "250px";

export const listSectionActualWidth = `min(${listSectionIdealWidth}, 100%)`;
export const groupSectionActualWidth = `min(${groupSectionIdealWidth}, 100%)`;
export const formSectionActualWidth = `min(${formSectionIdealWidth}, 100%)`;

/**
 * Page to come back to after logging in, from the optional `:url` route param
 * (/login/:url?, /register/:url?, /forbidden/:url?). Already decoded, e.g.
 * "/invite/123", or "" if there is none.
 */
export const useOptionalUrl = () => {
    const { url } = useParams();

    return url && url.startsWith("/") ? url : "";
}

// Encodes a url so it can be passed as the `:url` route param
export const toUrlParam = (url: string) => url ? `/${encodeURIComponent(url)}` : "";
