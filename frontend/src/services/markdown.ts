/**
 * Inline markdown for gift labels: **bold** / __bold__, *italic* / _italic_,
 * ~~strikethrough~~, `code`, [text](https://link) and \ to escape a character.
 * Line breaks are kept. Spans don't cross lines.
 *
 * Parsed into a small tree (no HTML strings), rendered by
 * components/Markdown.tsx, so a label can never inject HTML.
 */

export type MarkdownNode =
    | { type: "text"; text: string }
    | { type: "br" }
    | { type: "code"; text: string }
    | { type: "strong" | "em" | "del"; children: MarkdownNode[] }
    | { type: "link"; href: string; children: MarkdownNode[] };

const isWordChar = (char: string | undefined) => !!char && /[\p{L}\p{N}]/u.test(char);

interface Rule {
    // Sticky regexes: they only match at the current position
    pattern: RegExp;
    build: (match: RegExpExecArray) => MarkdownNode;
    // "_" doesn't count inside a word (snake_case, file_name.pdf...)
    notInsideWords?: boolean;
}

const wrap = (type: "strong" | "em" | "del") => (match: RegExpExecArray): MarkdownNode => ({
    type,
    children: parseMarkdown(match[1] ?? ""),
});

const rules: Rule[] = [
    { pattern: /\\([\\`*_~[\]()])/y, build: (match) => ({ type: "text", text: match[1] ?? "" }) },
    { pattern: /`([^`\n]+)`/y, build: (match) => ({ type: "code", text: match[1] ?? "" }) },
    {
        pattern: /\[([^\]\n]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)/y,
        build: (match) => ({ type: "link", href: match[2] ?? "", children: parseMarkdown(match[1] ?? "") }),
    },
    { pattern: /\*\*(?=\S)([^\n]*?\S)\*\*/y, build: wrap("strong") },
    { pattern: /__(?=\S)([^\n]*?\S)__/y, build: wrap("strong"), notInsideWords: true },
    { pattern: /~~(?=\S)([^\n]*?\S)~~/y, build: wrap("del") },
    // The text can't start or end with the marker itself ("** not bold **")
    { pattern: /\*(?=[^\s*])([^\n]*?[^\s*])\*/y, build: wrap("em") },
    { pattern: /_(?=[^\s_])([^\n]*?[^\s_])_/y, build: wrap("em"), notInsideWords: true },
];

export function parseMarkdown(source: string): MarkdownNode[] {
    const nodes: MarkdownNode[] = [];
    let text = "";

    const flushText = () => {
        if (text) nodes.push({ type: "text", text });
        text = "";
    };

    let index = 0;
    while (index < source.length) {
        if (source[index] === "\n") {
            flushText();
            nodes.push({ type: "br" });
            index++;
            continue;
        }

        let matched = false;
        for (const rule of rules) {
            if (rule.notInsideWords && isWordChar(source[index - 1])) continue;

            rule.pattern.lastIndex = index;
            const match = rule.pattern.exec(source);
            if (!match) continue;

            const end = index + match[0].length;
            if (rule.notInsideWords && isWordChar(source[end])) continue;

            flushText();
            nodes.push(rule.build(match));
            index = end;
            matched = true;
            break;
        }

        if (!matched) {
            text += source[index];
            index++;
        }
    }

    flushText();
    return nodes;
}

function toPlainText(nodes: MarkdownNode[]): string {
    return nodes
        .map((node) => {
            switch (node.type) {
                case "text":
                case "code":
                    return node.text;
                case "br":
                    return " ";
                default:
                    return toPlainText(node.children);
            }
        })
        .join("");
}

// The label without its markdown characters (excerpts, tooltips, titles...)
export function markdownToPlainText(source: string): string {
    return toPlainText(parseMarkdown(source));
}
