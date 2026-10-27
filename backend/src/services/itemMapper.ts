import { KDo, Link } from '@prisma/client';

export interface LinkDto {
    id: string;
    href: string;
}

export interface KdoDto {
    id: string;
    label: string;
    isChecked: boolean;
    position: number;
    // Optional fields filled in by callers depending on context - see
    // KdoResponseDto.ts for what each means.
    authorId?: string;
    takenBy?: { id: string; name: string; isFriend: boolean }[];
    links?: LinkDto[];
}

// Links are included when the query loaded them (`include: kdoLinksInclude`)
export const kdoLinksInclude = { links: { orderBy: { createdAt: 'asc' as const } } };

export function toLinkDto(link: Link): LinkDto {
    return { id: link.id, href: link.href };
}

// NOTE: an earlier version of this mapper renamed KDo.label to `value`
// (leftover from a more generic "Item" abstraction). The frontend's Kdo
// interface (frontend/src/interfaces/Kdo.ts) expects `label`, so we map it
// straight through instead of renaming it.
export function toKdoDto(kDo: KDo & { links?: Link[] }): KdoDto {
    return {
        id: kDo.id,
        label: kDo.label,
        isChecked: kDo.isChecked,
        position: kDo.position,
        ...(kDo.links ? { links: kDo.links.map(toLinkDto) } : {}),
    };
}
