import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/auth";
import { CSS } from "../services/utils";
import TypingInput from "../components/inputs/TypingInput";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await register({
        name: name,
        email: email,
        password: password,
      });

      if (!user) {
        setError("Impossible de créer le compte");
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
        <h2>Inscription</h2>

        <TypingInput
          label="Nom"
          name="name"
          type="text"
          required
          value={name}
          setValue={setName}
        />

        <TypingInput
          label="E-mail"
          name="email"
          type="email"
          placeholder="k-do@exemple.com"
          value={email}
          setValue={setEmail}
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
          {loading ? "Chargement..." : "S'inscrire"}
        </button>

        <p style={styles.switch}>
          Déjà inscrit ?{" "}
          <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </section>
  );
}
