import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import CheckSvg from "../../assets/svgs/Check";
import XMarkSvg from "../../assets/svgs/XMarkSvg";
import { CSS } from "../../services/utils";
import IconInlineText from "../statics/IconInlineText";

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
    default: {
      opacity: buttonState === "default" ? 1 : 0,
      transition: "opacity var(--sm-speed)",
    },
    loading: {
      inset: 0,
      opacity: buttonState === "loading" ? 1 : 0,
      transition: "opacity var(--sm-speed)",
    },
    validated: {
      inset: 0,
      color: "var(--validate)",
      opacity: buttonState === "validated" ? 1 : 0,
      transition: "opacity var(--sm-speed)",
    },
    error: {
      inset: 0,
      color: "var(--important)",
      opacity: buttonState === "error" ? 1 : 0,
      transition: "opacity var(--sm-speed)",
    },
  };

  return (
    <button onClick={handleClick} disabled={buttonState === "loading"}>
      <div className="relative">
        <span style={styles.default}>{children}</span>

        <span className="absolute" style={styles.loading}>
          <IconInlineText>
            <CheckSvg />
            Chargement...
          </IconInlineText>
        </span>

        <span className="absolute" style={styles.validated}>
          <IconInlineText>
            <CheckSvg />
            {validatedLabel}
          </IconInlineText>
        </span>

        <span className="absolute" style={styles.error}>
          <IconInlineText>
            <XMarkSvg />
            {errorMessage}
          </IconInlineText>
        </span>
      </div>
    </button>
  );
}