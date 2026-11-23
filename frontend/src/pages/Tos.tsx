import MyListRedirect from "../components/navigation/MyListRedirect";
import Page from "./Page";
import { lgSectionIdealWidth } from "../services/utils";

export default function Tos() {
  return (
    <Page
      title="CGU"
      idealSectionsWidth={lgSectionIdealWidth}
    >
      <MyListRedirect />
      <section>
        <div>
          <h1>Important</h1>
          En tout premier le site est uniquement destiné au personnes que j'ai contacté personnellement, je ne suis pas responsable si le site se propage sans mon autorisation. Si vous voyez ce message, c'est que je n'ai pas donné mon autorisation.
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
          J'ai encore des galères avec le système d'e-mail donc oubliez pas votre mdp par pitié
        </div>
      </section>
    </Page>
  );
}
