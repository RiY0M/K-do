import { ReactNode, MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import { CSS, formSectionActualWidth } from "../../services/utils";
import MultiStateButton from "../../components/buttons/MultiStateButton";

interface Props {
  title: string;
  buttonLabel: string;
  redirectMessage: string;
  redirectLinkMessage: string;
  redirectUri: string;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export default function FormSection({
  title,
  buttonLabel,
  redirectMessage,
  redirectLinkMessage,
  redirectUri,
  onSubmit,
  children,
}: Readonly<Props>) {

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    await onSubmit(event);
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
      <form onSubmit={handleSubmit}>
        <div style={styles.form}>
          <h2>{title}</h2>

          {children}

          <div></div>

          <MultiStateButton onClick={handleSubmit}>
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
