import { ReactNode, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { CSS, formSectionActualWidth } from "../../services/utils";
import MultiStateButton from "../../components/buttons/MultiStateButton";

interface Props {
  title: string;
  buttonLabel: string;
  validatedLabel?: string;
  redirectMessage: string;
  redirectLinkMessage: string;
  redirectUri: string;
  onSubmit: () => Promise<void>;
  children: ReactNode;
}

export default function FormSection({
  title,
  buttonLabel,
  validatedLabel,
  redirectMessage,
  redirectLinkMessage,
  redirectUri,
  onSubmit,
  children,
}: Readonly<Props>) {

  // Also triggered by the Enter key (implicit submission clicks the button)
  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // preventDefault skips the browser's checks (required fields...)
    const form = event.currentTarget.form;
    if (form && !form.reportValidity()) {
      throw new Error("Formulaire incomplet");
    }

    await onSubmit();
  };

  const styles: CSS = {
    form: {
      textAlign: "center",
    },
    error: {
      color: "var(--important)",
      fontSize: "var(--sm-size)",
    },
    switch: {
      fontSize: "var(--sm-size)",
    },
    section: {
      margin: "auto",
      width: formSectionActualWidth,
    },
  };

  return (
    <section style={styles.section}>
      <form onSubmit={(event) => event.preventDefault()}>
        <div style={styles.form}>
          <h2>{title}</h2>

          {children}

          <div></div>

          <MultiStateButton onClick={handleSubmit} validatedLabel={validatedLabel}>
            {buttonLabel}
          </MultiStateButton>

          <p style={styles.switch}>
            {redirectMessage + " "}
            <Link style={styles.switch} to={redirectUri}>
              {redirectLinkMessage}
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
