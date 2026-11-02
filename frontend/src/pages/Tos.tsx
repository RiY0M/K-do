import Header from "../components/navigation/Header";

export default function Tos() {
  return (
    <div>
      <Header forceHomeRedirect />
      <section>
        <div>
          <h1>Important</h1>
          En tout premier le site est uniquement destiné au groupe Famille Rigaut, je le trouve pas assez abouti pour l'exporter
        </div>
      </section>
      <section>
        <div>
          <h1>Retours</h1>
          Le site est encore en beta donc si vous avez des retours à faire je prends
        </div>
      </section>
      <section>
        <div>
          <h1>E-mail et mdp</h1>
          J'ai eu des galères avec le système d'e-mail donc oubliez pas votre mdp par pitié
        </div>
      </section>
    </div>
  );
}
