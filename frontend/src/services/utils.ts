import { CSSProperties } from "react";
import { useParams } from "react-router-dom";

export type CSS = Record<string, CSSProperties>

export const listDisplayIdealWidth = 350;

export const getOptionalUrl = () => {
    const { url } = useParams();

    return url ? `/${url}` : "";
}
