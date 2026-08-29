import { CSSProperties } from "react";
import { useParams } from "react-router-dom";

export type CSS = Record<string, CSSProperties>

export const listSectionIdealWidth = 350;
export const groupSectionIdealWidth = 200;
export const formSectionIdealWidth = 250;

export const listSectionActualWidth = `min(${listSectionIdealWidth}px, 100%)`;
export const groupSectionActualWidth = `min(${groupSectionIdealWidth}px, 100%)`;
export const formSectionActualWidth = `min(${formSectionIdealWidth}px, 100%)`;

export const getOptionalUrl = () => {
    const { url } = useParams();

    return url ? `/${url}` : "";
}
