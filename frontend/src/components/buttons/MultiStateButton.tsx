import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import Check from "../../assets/svgs/Check";
import XMark from "../../assets/svgs/XMark";
import { CSS } from "../../services/utils";
import IconInlineText from "../IconInlineText";

type validStates = "default" | "loading" | "validated" | "error";

interface Props {
  onClick: (event: MouseEvent<HTMLButtonElement>) => unknown;
  children: ReactNode;
  validatedLabel?: string;
}

export default function MultiStateButton({
  onClick,
  children,
  validatedLabel = "Réussi !",
}: Readonly<Props>) {
  const timeoutDuration = 2000;
  const [buttonState, setButtonState] = useState<validStates>("default");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    setButtonState("loading");
    window.clearTimeout(timeout.current);

    try {
      await onClick(event);
      setButtonState("validated");
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
      setButtonState("error");
    }

    timeout.current = window.setTimeout(() => {
      setButtonState("default");
    }, timeoutDuration);
  };

  const styles: CSS = {
    div: {
      position: "relative",
    },
    default: {
      opacity: buttonState === "default" ? 1 : 0,
      transition: "opacity var(--sm-speed)",
    },
    loading: {
      position: "absolute",
      inset: 0,
      opacity: buttonState === "loading" ? 1 : 0,
      transition: "opacity var(--sm-speed)",
    },
    validated: {
      position: "absolute",
      inset: 0,
      color: "var(--validate)",
      opacity: buttonState === "validated" ? 1 : 0,
      transition: "opacity var(--sm-speed)",
    },
    error: {
      position: "absolute",
      inset: 0,
      color: "var(--important)",
      opacity: buttonState === "error" ? 1 : 0,
      transition: "opacity var(--sm-speed)",
    },
  };

  return (
    <button onClick={handleClick} disabled={buttonState === "loading"}>
      <div style={styles.div}>
        <span style={styles.default}>{children}</span>

        <span style={styles.loading}>
          <IconInlineText>
            <Check />
            Chargement...
          </IconInlineText>
        </span>

        <span style={styles.validated}>
          <IconInlineText>
            <Check />
            {validatedLabel}
          </IconInlineText>
        </span>

        <span style={styles.error}>
          <IconInlineText>
            <XMark />
            {errorMessage}
          </IconInlineText>
        </span>
      </div>
    </button>
  );
}