import { useState, FormEvent } from "react";
import { Link, useNavigation } from "react-router-dom";
import { login } from "../services/auth";
import { CSS } from "../services/utils";
import TypingInput from "../components/inputs/TypingInput";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // const navigation = useNavigation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({
        name: email,
        password: password,
      });

      // navigation.navigate("/", "/");
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
          label="E-mail"
          name="email"
          type="email"
          placeholder="k-do@exemple.com"
          required
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
