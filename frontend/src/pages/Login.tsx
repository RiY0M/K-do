import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import { CSS } from "../services/utils";
import TypingInput from "../components/inputs/TypingInput";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login({
        name: name,
        password: password,
      });

      if (!user) {
        setError("Identifiants invalides");
        return;
      }

      navigate("/");
    } catch (err) {
      setError(`${err}`);
    } finally {
      setLoading(false);
    }
  };

  const styles: CSS = {
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
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
      <form onSubmit={handleSubmit} style={styles.form}>
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
          <Link to="/register">S'inscrire</Link>
        </p>
      </form>
    </section>
  );
}
