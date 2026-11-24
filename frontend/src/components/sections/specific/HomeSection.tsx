import { Link } from "react-router-dom";
import CancanDialogBubble from "../../statics/CancanDialogBubble";
import GigachadDialogBubble from "../../statics/GigachadDialogBubble";
import AccordionToggle from "../../accordions/AccordionToggle";
import { Dispatch, SetStateAction } from "react";
import { CSS } from "../../../services/utils";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function HomeSection({
  open,
  setOpen,
}: Readonly<Props>) {

  const styles: CSS = {
    toggle: {
      display: "inline",
    },
  }

  return (
    <section>
      <div>
        <h1>Bienvenue sur {__APP_NAME__}&nbsp;!</h1>

        <CancanDialogBubble>
          Hey ! Mais c'est quoi {__APP_NAME__} ?
        </CancanDialogBubble>

        <GigachadDialogBubble>
          Bonne question !
          Si vous êtes ici c'est que le bouche à oreille a fait son effet et je suis très content de vous voir&nbsp;!{" "}
          {" "}<span className="semi-hidden-text">
            Enfin je vous vois pas vraiment mais vous avez compris l'idée...
          </span>
        </GigachadDialogBubble>

        <GigachadDialogBubble>Et donc mon site consiste à créer des listes de cadeaux.</GigachadDialogBubble>
        <GigachadDialogBubble>Voilà.</GigachadDialogBubble>
        <GigachadDialogBubble>C'est pas mal hein ?</GigachadDialogBubble>
        <GigachadDialogBubble>
          Bon je plaisante un peu, c'est un peu plus élaboré que ça alors permettez-moi d'expliquer plus en détail.<br />
          {__APP_NAME__} est comme dit un site de liste de cadeaux qui regroupe quelques fonctionnalités pratiques comme le fait de pouvoir voir la liste de ses amis.
        </GigachadDialogBubble>
        <GigachadDialogBubble>
          Mais s'il n'y avait que ça l'intérêt serait limité.
          Le vrai intérêt d'utiliser {__APP_NAME__} est de pouvoir <b>prendre des idées cadeux et en créer de nouvelles chez les autres sans que ces derniers le voient&nbsp;!</b><br />
          Idéal pour gérer des évènements comme Noël ou un anniversaire&nbsp;!{" "}
          <span className="semi-hidden-text">C'est marrant on dirait que c'était fait pour...</span>
        </GigachadDialogBubble>

        <CancanDialogBubble>Ç'a l'air compliqué ton truc là.</CancanDialogBubble>
        <GigachadDialogBubble>
          Pas du tout&nbsp;!
          Tout a été pensé pour être facile de compréhension et d'usage donc pas d'inquiétude à ce niveau-là.
          L'utilisation est très simple et intuitive et il y a même un tutoriel pour les plus frileux.{" "}
          <span className="semi-hidden-text">Bon à l'heure actuelle il n'est pas encore là mais ça ne saurait tarder.</span>
        </GigachadDialogBubble>

        <CancanDialogBubble>Est-ce que le site est sécurisé&nbsp;?</CancanDialogBubble>
        <GigachadDialogBubble>
          Pas de problème de ce côté-ci non plus, je me mets toujours à jour le plus rapidement possible pour la sécurité des données.
          Bien sûr, il ne faut jamais dire jamais et je peux toujours me faire pirater, mais je vous assure ne pas stocker plus de données que nécessaire.
        </GigachadDialogBubble>
        <GigachadDialogBubble>
          De fait, il n'y a pas vraiment beaucoup de données sensibles qui pourraient intéresser les pirates.
          Mais ce n'est ni une excuse pour moi de lésiner dessus, ni une excuse pour vous de mettre un mot de passe peu sécurisé&nbsp;!
        </GigachadDialogBubble>

        <CancanDialogBubble>Ok mais euh... il est moche ton site là&nbsp;!</CancanDialogBubble>
        <GigachadDialogBubble>
          Merci...<br />
          Je ne suis pas expert en design donc il y a effectivement des choses à redire sur l'apparence globale, j'en suis conscient.
          Je suis ouvert aux critiques constructives
          {" "}<span className="semi-hidden-text">
            (plus que celle-là en tout cas)
          </span>{" "}
          donc si vous avez des choses à faire remonter vous trouverez mon contact ici ainsi que dans <Link to="/tos">les CGU</Link> et le pied de page si vous ne vous en rapplez plus.
        </GigachadDialogBubble>
        <GigachadDialogBubble>
          Vous le remarquerez sûrement ou l'avez peut-être déjà relevé mais l'inspiration première en terme de design, de fonctionnalité et de facilité d'usage est Google Keep.
          Je ne voulais pas que mon site ressemble à tous ceux fait intégralement sous Claude qui respirent le réchauffé.
          De fait, la direction artistique est faite main bien que les IAs m'aient aidé pour la colorimétrie.
        </GigachadDialogBubble>

        <CancanDialogBubble>T'as parlé d'IA je veux pas de ton truc en fait&nbsp;!</CancanDialogBubble>
        <GigachadDialogBubble>
          Je vais essayer d'écourter mon avis sur l'IA ici pour que ce soit digeste mais soyez réaliste, aujourd'hui vous ne pouvez plus l'éviter d'autant plus que ce n'est pas forcément un défaut.
          {" "}
          <span className="semi-hidden-text">
            Même si j'ai perdu mon travail à cause d'elle...
          </span>
        </GigachadDialogBubble>
        <GigachadDialogBubble>
          Pour mon utilisation de l'IA je m'en sert principalement pour tout le côté fonctionnel du site mais tout le visuel général est de ma conception bien que je puisse redemander à des IAs un avis critique.
          Je vérifie bien sûr toujours ce que les IAs produisent, donc pas de vibe-coding intensif.
          C'est la meilleure manière d'utiliser l'IA selon moi et soyez sûr que toutes les images que vous trouvez sur le site n'ont pas été générées.
        </GigachadDialogBubble>

        <CancanDialogBubble>...</CancanDialogBubble>
        <GigachadDialogBubble>
          On n'a plus rien à dire hein&nbsp;?
        </GigachadDialogBubble>
        <GigachadDialogBubble>
          J'espère avoir répondu à vos questions et vous avoir donné envie d'essayer mon projet&nbsp;!
          {" "}<Link to="/register">Rendez-vous ici</Link> pour tester&nbsp;!
        </GigachadDialogBubble>
        <GigachadDialogBubble>

          Je vous remercie également d'avoir pu vous divertir comme il se doit.
          Mais si vous voulez en savoir encore plus, vous pouvez voir un peu plus
          {" "}<AccordionToggle style={styles.toggle} className="italic" dontShowIcon open={open} setOpen={setOpen}>
            d'histoire...
          </AccordionToggle>{" "}
          C'est mon premier projet que je diffuse et malgré les difficultés je suis très content d'avoir pu en arriver là.
        </GigachadDialogBubble>
      </div>
    </section>
  );
}
