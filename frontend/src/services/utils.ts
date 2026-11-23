import { CSSProperties } from "react";
import { useParams } from "react-router-dom";

export type CSS = Record<string, CSSProperties>

export const lgSectionIdealWidth = 600;
export const mdSectionIdealWidth = 350;
export const smSectionIdealWidth = 250;

export const lgSectionActualWidth = `min(${lgSectionIdealWidth}px, 100%)`;
export const mdSectionActualWidth = `min(${mdSectionIdealWidth}px, 100%)`;
export const smSectionActualWidth = `min(${smSectionIdealWidth}px, 100%)`;

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
