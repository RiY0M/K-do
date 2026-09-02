import { KDo } from '@prisma/client';

export interface KdoDto {
    id: string;
    label: string;
    isChecked: boolean;
    position: number;
    // Optional fields filled in by callers depending on context - see
    // KdoResponseDto.ts for what each means.
    authorId?: string;
    takenBy?: { id: string; name: string; isFriend: boolean }[];
}

// NOTE: an earlier version of this mapper renamed KDo.label to `value`
// (leftover from a more generic "Item" abstraction). The frontend's Kdo
// interface (frontend/src/interfaces/Kdo.ts) expects `label`, so we map it
// straight through instead of renaming it.
export function toKdoDto(kDo: KDo): KdoDto {
    return {
        id: kDo.id,
        label: kDo.label,
        isChecked: kDo.isChecked,
        position: kDo.position,
    };
}
