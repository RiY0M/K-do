import { CSSProperties } from "react";
import { useParams } from "react-router-dom";

export type CSS = Record<string, CSSProperties>
export type GapSpaceType = "xs" | "sm" | "md" | "lg" | "xl";

export const lgSectionIdealWidth = 600;
export const mdSectionIdealWidth = 350;
export const smSectionIdealWidth = 250;

export const lgSectionActualWidth = `min(${lgSectionIdealWidth}px, 100%)`;
export const mdSectionActualWidth = `min(${mdSectionIdealWidth}px, 100%)`;
export const smSectionActualWidth = `min(${smSectionIdealWidth}px, 100%)`;

export const useOptionalUrl = () => {
    const { url } = useParams();

    return url && url.startsWith("/") ? url : "";
}

export const toUrlParam = (url: string) => url ? `/${encodeURIComponent(url)}` : "";
