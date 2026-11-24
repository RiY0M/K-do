import { Link } from "react-router-dom";
import CancanDialogBubble from "../../statics/CancanDialogBubble";
import GigachadDialogBubble from "../../statics/GigachadDialogBubble";

export default function HistorySection() {

  return (
    <section>
      <div>
        <h1>Un peu d'histoire...</h1>
        <CancanDialogBubble>C'est quoi cette section&nbsp;?</CancanDialogBubble>
        <GigachadDialogBubble>
          Un endroit où je peux raconter ma vie, avec en plus l'assurance d'avoir quelqu'un qui me lit puisqu'il n'a pas trouvé ça par hasard&nbsp;!
        </GigachadDialogBubble>
        <GigachadDialogBubble>
          Ça peut aussi servir de FAQ pour les plus curieux, donc sur ce c'est parti&nbsp;!
        </GigachadDialogBubble>

        <CancanDialogBubble>Comment ça t'es venu l'idée du site&nbsp;?</CancanDialogBubble>
        <GigachadDialogBubble>
          C'était une idée qui me trottait dans la tête de Noël 2025 avec ma famille.
          L'organisation des listes de cadeaux était assez cahotique, tout le monde n'avait pas les listes de tout le monde et personne ne savait vraiment qui avait pris quoi.
          On retrouve en fait les problématiques principales auquelles on peut s'attendre lorsqu'on n'utilise pas mon site et auxquelles il répond plutôt bien.
        </GigachadDialogBubble>
        <GigachadDialogBubble>
          De là mon père m'a fait la remarque devant tout le monde à table que puisque j'étais développeur, je pouvais faire un site pour mieux organiser les listes de tout le monde.
          Pris en sandwitch comme du fois gras entre deux toasts
          {" "}<span className="semi-hidden-text">
            (et étant tout de même d'accord avec lui au préalable puisque j'avais eu l'idée avant)
          </span>{" "}
          je n'ai eu le choix d'accepter.
        </GigachadDialogBubble>

        <div className="no-gap">
          <CancanDialogBubble>Pourquoi t'as choisi les fleurs cancans&nbsp;?</CancanDialogBubble>
          <span className="semi-hidden-text">J'ai pas les droits pour cette fleur cancan</span>
        </div>
        <div className="no-gap">
          <GigachadDialogBubble>
            Quand j'ai joué à <Link to="https://fr.wikipedia.org/wiki/Super_Mario_Bros._Wonder">Mario Wonders</Link> je les ai trouvés absolument incroyables.
            Je sais que c'est un avis controversé mais contrairement à beaucoup de gens je les aime beaucoup avec leurs remarques débiles et surtout leur voix iconiques&nbsp;!
            J'aurais pu prendre les fleurs piranha qui chantent mais comme dit elles chantent et ne parlent pas ce qui casse un peu l'effet recherché.
          </GigachadDialogBubble>
          <span className="semi-hidden-text">J'ai pas les droits pour ce gigachad...<br />Mais quel gigachad</span>
        </div>

        <CancanDialogBubble>Comment tu fais pour gagner de l'argent avec le site&nbsp;?</CancanDialogBubble>
        <GigachadDialogBubble>
          Tu n'es pas le premier à me poser la question, plusieurs personnes m'ont fait remarqué que je pourrais intégrer un système d'abonnement pour ce site.
          {" "}<span className="semi-hidden-text">Qui en terme technique est plus une application web mais passons.</span></GigachadDialogBubble>
        <GigachadDialogBubble>Je n'y suis pas opposé mais se pose un problème majeur au-delà de la technique&nbsp;: qu'est-ce que je fais payer&nbsp;?</GigachadDialogBubble>
        <GigachadDialogBubble>
          Certains pourraient me dire que je fais payer l'entrée avec un essai gratuit, mais faire ça c'est une porte ouverte au piratage.
          Certains vont le voir comme du pessimisme mais {__APP_NAME__} n'est pas très difficile à répliquer avec les IAs d'aujourd'hui.
          Pour donner un exemple, la suite Adobe (Photoshop, PDFReader...) s'est faite entièrement copiée et la copie est disponible gratuitement sur internet alors mon petit projet...
        </GigachadDialogBubble>
        <GigachadDialogBubble>Il faudrait une ou plusieurs fonctionnalité(s) supplémentaire(s) qui justifie(nt) un abonnement sans ternir les fonctionnalités de base mais à l'heure actuelle je n'ai pas trouvé.</GigachadDialogBubble>
        <GigachadDialogBubble>J'ai bien quelques idées mais elles formeraient un tout avec {__APP_NAME__} et ne seraient pas vraiment une extension de celui-ci donc les mêmes problématiques se posent...</GigachadDialogBubble>
        <GigachadDialogBubble>
          Rajouter un moyen de paiment c'est aussi maintenir et sécuriser une fonctionnalité supplémentaire, devenir une cible plus importante pour les pirates, monter une auto-entreprise avec les démarches administratives qui vont avec...
          Que de choses qui ne me plaisent guère, mais l'avenir est incertain donc restons à l'affût&nbsp;!
        </GigachadDialogBubble>
      </div>
    </section>
  );
}
