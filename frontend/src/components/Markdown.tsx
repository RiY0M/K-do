import { CSSProperties, ReactNode } from "react";
import { MarkdownNode, parseMarkdown } from "../services/markdown";

interface Props {
  text: string;
}

// The global `* { font-size }` rule would otherwise reset these to the
// default size inside smaller text
const inherit: CSSProperties = { fontSize: "inherit" };

const styles: Record<string, CSSProperties> = {
  code: {
    fontSize: "0.9em",
    fontFamily: "monospace",
    backgroundColor: "var(--input-bg)",
    borderRadius: "var(--sm-rounded-radius)",
    padding: "0 .2em",
  },
};

function render(nodes: MarkdownNode[], keyPrefix = ""): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}${index}`;

    switch (node.type) {
      case "text":
        return node.text;
      case "br":
        return <br key={key} />;
      case "code":
        return <code key={key} style={styles.code}>{node.text}</code>;
      case "strong":
        return <strong key={key} style={inherit}>{render(node.children, `${key}-`)}</strong>;
      case "em":
        return <em key={key} style={inherit}>{render(node.children, `${key}-`)}</em>;
      case "del":
        return <del key={key} style={inherit}>{render(node.children, `${key}-`)}</del>;
      case "link":
        return (
          <a
            key={key}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer"
            style={inherit}
            // Opens the link instead of switching the line to edit mode
            onClick={(event) => event.stopPropagation()}
          >
            {render(node.children, `${key}-`)}
          </a>
        );
    }
  });
}

// A gift label with its markdown rendered (see services/markdown.ts)
export default function Markdown({ text }: Readonly<Props>) {
  return <>{render(parseMarkdown(text))}</>;
}
