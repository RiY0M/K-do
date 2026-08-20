import { KDo } from '@prisma/client';

export interface ItemDto {
    id: string;
    value: string;
    isChecked: boolean;
    position: number;
}

export function toItemDto(kDo: KDo): ItemDto {
    return {
        id: kDo.id,
        value: kDo.label,
        isChecked: kDo.isChecked,
        position: kDo.position,
    };
}
