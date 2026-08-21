import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { loginAndSaveSession } from "../services/authStorage";
import { CSS } from "../services/utils";
import TypingInput from "../components/inputs/TypingInput";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginAndSaveSession({
        name: name,
        password: password,
      });

    } catch {
      setError("Identifiants invalides");
    } finally {
      setLoading(false);
    }
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
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <div style={styles.form}>
          <h2>Connexion</h2>

          <TypingInput
            label="Nom"
            name="name"
            type="text"
            required
            value={name}
            setValue={setName}
          />

          <TypingInput
            label="Mot de passe"
            name="password"
            type="password"
            required
            value={password}
            setValue={setPassword}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Chargement..." : "Se connecter"}
          </button>

          <p style={styles.switch}>
            Pas de compte ?{" "}
            <Link style={styles.switch} to="/register">S'inscrire</Link>
          </p>
        </div>
      </form>
    </section>
  );
}
